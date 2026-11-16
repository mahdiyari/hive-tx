import { cachedRPC } from './cachedRPC.js'

/**
 * Stake, mana, vote, and reputation math. Account helpers take a name, or an account object
 * you already have (condenser_api or database_api format) to skip the request.
 * Chain data is fetched internally and cached for 2 seconds.
 * Results are JavaScript numbers: exact enough for display and estimates, not for consensus.
 */

/** Asset as returned by condenser_api (`"1.000 HIVE"`) or by database_api (NAI object) */
export type AssetInput = string | { amount: string; precision: number; nai: string }

/** Manabar fields as returned by the API */
export interface ManabarInput {
  current_mana: number | string
  last_update_time: number
}

/** Account fields used for stake and mana, from `get_accounts` or `find_accounts` */
export interface StakeAccount {
  vesting_shares: AssetInput
  delegated_vesting_shares: AssetInput
  received_vesting_shares: AssetInput
  vesting_withdraw_rate: AssetInput
  to_withdraw: number | string
  withdrawn: number | string
  voting_manabar: ManabarInput
  downvote_manabar: ManabarInput
}

/** Account fields from `rc_api.find_rc_accounts` */
export interface RCAccount {
  max_rc: number | string
  rc_manabar: ManabarInput
}

/** Account fields used for its value, from `get_accounts` */
export interface WalletAccount extends StakeAccount {
  name: string
  balance: AssetInput
  savings_balance: AssetInput
  hbd_balance: AssetInput
  savings_hbd_balance: AssetInput
}

/** Account name, or an account object from `get_accounts` / `find_accounts` */
export type AccountInput = string | StakeAccount

/** Account name, or an object from `rc_api.find_rc_accounts` */
export type RCAccountInput = string | RCAccount

export interface Manabar {
  /** Current mana, regenerated to now */
  current: number
  max: number
  /** 0 to 100 */
  percentage: number
  /** When the mana will be full; already passed if it is full */
  fullAt: Date
}

const fetchAccount = async <T extends StakeAccount>(account: string | T): Promise<T> => {
  if (typeof account !== 'string') return account
  const [found] = await cachedRPC<T[]>('condenser_api.get_accounts', [[account]])
  if (!found) throw new Error(`Account not found: ${account}`)
  return found
}

const fetchRCAccount = async (account: RCAccountInput): Promise<RCAccount> => {
  if (typeof account !== 'string') return account
  const { rc_accounts } = await cachedRPC('rc_api.find_rc_accounts', { accounts: [account] })
  if (!rc_accounts[0]) throw new Error(`Account not found: ${account}`)
  return rc_accounts[0]
}

// shortcut: chain constants hardcoded as of HF28; update them if a hardfork changes them
/** Mana regenerates from 0 to full in 5 days */
const MANA_REGEN_SECONDS = 432_000
/** dgp.downvote_pool_percent: downvote mana is 25% of voting mana since HF21 */
const DOWNVOTE_POOL = 0.25
/** dgp.vote_power_reserve_rate: a 100% vote uses 2% of max mana */
const VOTE_POWER_RESERVE_RATE = 10
/** Votes below this many rshares count as 0 */
const VOTE_DUST_THRESHOLD = 50_000_000

const NAI_SYMBOLS: Record<string, string> = {
  '@@000000021': 'HIVE',
  '@@000000013': 'HBD',
  '@@000000037': 'VESTS'
}

/** Parses `"1.000 HIVE"` or `{ amount: "1000", precision: 3, nai: "@@000000021" }` */
export const parseAsset = (asset: AssetInput): { amount: number; symbol: string } => {
  const parsed =
    typeof asset === 'string'
      ? { amount: Number(asset.split(' ')[0]), symbol: asset.split(' ')[1] }
      : { amount: Number(asset.amount) / 10 ** asset.precision, symbol: NAI_SYMBOLS[asset.nai] }
  if (!Number.isFinite(parsed.amount) || !parsed.symbol) {
    throw new Error(`Invalid asset: ${JSON.stringify(asset)}`)
  }
  return parsed
}

const amountOf = (value: number | AssetInput) =>
  typeof value === 'number' ? value : parseAsset(value).amount

// shortcut: the median feed is a 3.5-day median of witness feeds, not the live market price;
// use a market price where it matters (trading, exact valuations)
/** HBD per HIVE from the witnesses' median price feed */
const medianPrice = async (): Promise<number> => {
  const price = await cachedRPC('condenser_api.get_current_median_history_price')
  return amountOf(price.base) / amountOf(price.quote)
}

/** Converts HIVE to HBD at the median price feed */
export const hiveToHbd = async (hive: number | AssetInput): Promise<number> =>
  amountOf(hive) * (await medianPrice())

/** Converts HBD to HIVE at the median price feed */
export const hbdToHive = async (hbd: number | AssetInput): Promise<number> =>
  amountOf(hbd) / (await medianPrice())

/** Converts VESTS to HIVE Power at the current rate */
export const vestsToHP = async (vests: number | AssetInput): Promise<number> => {
  const props = await cachedRPC('condenser_api.get_dynamic_global_properties')
  return (
    (amountOf(vests) * amountOf(props.total_vesting_fund_hive)) /
    amountOf(props.total_vesting_shares)
  )
}

/** Converts HIVE Power to VESTS at the current rate */
export const hpToVests = async (hp: number | AssetInput): Promise<number> => {
  const props = await cachedRPC('condenser_api.get_dynamic_global_properties')
  return (
    (amountOf(hp) * amountOf(props.total_vesting_shares)) / amountOf(props.total_vesting_fund_hive)
  )
}

const effectiveVests = (account: StakeAccount): number => {
  // to_withdraw and withdrawn are in micro-VESTS
  const remainingPowerDown = (Number(account.to_withdraw) - Number(account.withdrawn)) / 1e6
  return (
    amountOf(account.vesting_shares) -
    amountOf(account.delegated_vesting_shares) +
    amountOf(account.received_vesting_shares) -
    Math.min(amountOf(account.vesting_withdraw_rate), remainingPowerDown)
  )
}

/**
 * VESTS that give voting power: own + received - delegated - this week's power down.
 * This is also the maximum voting mana, in VESTS.
 */
export const getEffectiveVests = async (account: AccountInput): Promise<number> =>
  effectiveVests(await fetchAccount(account))

// shortcut: `now` defaults to the local clock, so a skewed clock skews mana; pass chain time if it matters
const regenerate = (bar: ManabarInput, max: number, now: number): Manabar => {
  const elapsed = Math.max(0, now / 1000 - bar.last_update_time)
  const current = Math.min(
    max,
    Number(bar.current_mana) + Math.floor((max * elapsed) / MANA_REGEN_SECONDS)
  )
  const secondsToFull = max > 0 ? ((max - current) * MANA_REGEN_SECONDS) / max : 0
  return {
    current,
    max,
    percentage: max > 0 ? (current / max) * 100 : 0,
    fullAt: new Date(now + secondsToFull * 1000)
  }
}

/** Mana is counted in micro-VESTS */
const maxVotingMana = (account: StakeAccount) => Math.round(effectiveVests(account) * 1e6)

/** Upvote mana ("voting power") of an account at `now` (ms) */
export const getVotingMana = async (account: AccountInput, now = Date.now()): Promise<Manabar> => {
  const acc = await fetchAccount(account)
  return regenerate(acc.voting_manabar, maxVotingMana(acc), now)
}

/** Downvote mana of an account at `now` (ms) */
export const getDownvoteMana = async (
  account: AccountInput,
  now = Date.now()
): Promise<Manabar> => {
  const acc = await fetchAccount(account)
  return regenerate(acc.downvote_manabar, Math.floor(maxVotingMana(acc) * DOWNVOTE_POOL), now)
}

/** Resource credits of an account at `now` (ms) */
export const getRCMana = async (account: RCAccountInput, now = Date.now()): Promise<Manabar> => {
  const acc = await fetchRCAccount(account)
  return regenerate(acc.rc_manabar, Number(acc.max_rc), now)
}

/**
 * rshares a vote adds to a post. `weight` is -10000 to 10000 (-100% to 100%).
 * Since HF28 vote strength depends only on stake and weight, not on current mana;
 * mana only limits how many votes an account can cast.
 */
export const getVoteRShares = async (account: AccountInput, weight = 10000): Promise<number> => {
  const usedMana = Math.ceil(
    (maxVotingMana(await fetchAccount(account)) * Math.abs(weight) * 86400) /
      10000 /
      (VOTE_POWER_RESERVE_RATE * MANA_REGEN_SECONDS)
  )
  return Math.sign(weight) * Math.max(0, usedMana - VOTE_DUST_THRESHOLD)
}

/** HBD value of rshares at the current reward pool and median price (linear reward curve) */
export const rsharesToHBD = async (rshares: number): Promise<number> => {
  const [fund, price] = await Promise.all([
    cachedRPC('condenser_api.get_reward_fund', ['post']),
    medianPrice()
  ])
  return ((rshares * amountOf(fund.reward_balance)) / Number(fund.recent_claims)) * price
}

/** Estimated HBD value of a vote, author and curation rewards combined */
export const getVoteValue = async (account: AccountInput, weight = 10000): Promise<number> =>
  rsharesToHBD(await getVoteRShares(account, weight))

/** Yearly HIVE Power interest in percent, from the chain's current inflation */
export const getHpApr = async (): Promise<number> => {
  const [props, [treasury], price] = await Promise.all([
    cachedRPC('condenser_api.get_dynamic_global_properties'),
    cachedRPC('condenser_api.get_accounts', [['hive.fund']]),
    medianPrice()
  ])
  // shortcut: treasury account name and inflation schedule hardcoded as of HF28; update on hardfork
  // Inflation started at 9.78% and drops 0.01% every 250k blocks, down to 0.95%
  const inflation = Math.max(978 - Math.floor(props.head_block_number / 250_000), 95) / 10000
  // Since HF28 the treasury's HBD does not count toward the inflation base
  const hbdOutsideTreasury = amountOf(props.current_hbd_supply) - amountOf(treasury.hbd_balance)
  const supply = amountOf(props.current_supply) + hbdOutsideTreasury / price
  const yearlyVestingReward = (supply * inflation * props.vesting_reward_percent) / 10000
  return (yearlyVestingReward / amountOf(props.total_vesting_fund_hive)) * 100
}

/** Yearly interest on HBD in savings, in percent, as set by witnesses */
export const getHbdApr = async (): Promise<number> =>
  (await cachedRPC('condenser_api.get_dynamic_global_properties')).hbd_interest_rate / 100

/**
 * Estimated account value in HBD at the median price: liquid, savings, HIVE Power
 * (own, including delegated out), and funds in open market orders.
 */
export const estimateAccountValue = async (account: string | WalletAccount): Promise<number> => {
  const acc = await fetchAccount(account)
  const [orders, hp, price] = await Promise.all([
    cachedRPC<{ for_sale: number; sell_price: { base: AssetInput } }[]>(
      'condenser_api.get_open_orders',
      [acc.name]
    ),
    vestsToHP(acc.vesting_shares),
    medianPrice()
  ])
  let hive = amountOf(acc.balance) + amountOf(acc.savings_balance) + hp
  let hbd = amountOf(acc.hbd_balance) + amountOf(acc.savings_hbd_balance)
  for (const order of orders) {
    // for_sale is in thousandths of the asset being sold
    if (parseAsset(order.sell_price.base).symbol === 'HIVE') hive += order.for_sale / 1000
    else hbd += order.for_sale / 1000
  }
  return hbd + hive * price
}

/** Converts raw reputation (e.g. `"79470587263453"`) to the familiar score (e.g. `66.2`) */
export const formatReputation = (raw: number | string): number => {
  const rep = Number(raw)
  // log10(0) is -Infinity, so 0 maps to 25 without a special case
  return Math.max(Math.log10(Math.abs(rep)) - 9, 0) * Math.sign(rep) * 9 + 25
}
