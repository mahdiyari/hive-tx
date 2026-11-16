import { AppliedOperation, Block } from '../types.js'
import { callRPCBatch } from './call.js'
import { getDynamicGlobalProperties } from './getDynamicProps.js'
import { sleep } from './sleep.js'

/** Blocks fetched per request while catching up */
const BATCH_SIZE = 20
/** Wait between polls once caught up; Hive makes a block every 3s */
const POLL_INTERVAL = 1000

export interface StreamOptions {
  /** First block to stream. Default: the last irreversible block */
  from?: number
  /** Last block to stream; the stream ends after it. Default: never ends */
  to?: number
}

export interface StreamOperationsOptions extends StreamOptions {
  /** As in `get_ops_in_block`: true streams only virtual operations, false streams all. Default: false */
  only_virtual?: boolean
}

/**
 * Yields `[blockNum, data]` for each irreversible block in order, with no gaps or duplicates.
 * `fetchBatch` returns null for blocks the node does not have yet; those are fetched again.
 */
async function* followChain<T>(
  { from, to = Infinity }: StreamOptions,
  fetchBatch: (nums: number[]) => Promise<(T | null)[]>
): AsyncGenerator<[number, T]> {
  // Cache period 0: always fetch fresh props
  let lib = (await getDynamicGlobalProperties(0)).last_irreversible_block_num
  let next = from ?? lib
  if (!Number.isInteger(next) || next < 1) {
    throw new Error('from must be a block number >= 1')
  }
  while (next <= to) {
    if (next > lib) {
      await sleep(POLL_INTERVAL)
      lib = (await getDynamicGlobalProperties(0)).last_irreversible_block_num
      continue
    }
    const count = Math.min(Math.min(lib, to) - next + 1, BATCH_SIZE)
    const results = await fetchBatch(Array.from({ length: count }, (_, i) => next + i))
    for (const result of results) {
      if (result === null) {
        // The node we hit is behind the one that reported `lib`; retry from here
        await sleep(POLL_INTERVAL)
        break
      }
      yield [next++, result]
    }
  }
}

/**
 * Streams irreversible block numbers in order, with no gaps or duplicates, without fetching the blocks.
 * Same catch-up, stop, and resume behavior as `streamBlocks`.
 *
 * @example
 * ```typescript
 * import { streamBlockNumbers } from 'hive-tx'
 *
 * for await (const num of streamBlockNumbers()) {
 *   console.log(num)
 * }
 * ```
 */
export async function* streamBlockNumbers(options: StreamOptions = {}): AsyncGenerator<number> {
  for await (const [num] of followChain(options, async (nums) => nums)) {
    yield num
  }
}

/**
 * Streams irreversible blocks in order, with no gaps or duplicates.
 * Catches up on past blocks in batches, then follows the chain as new blocks become irreversible.
 * Hive blocks become irreversible within a few seconds, so this is close to real time.
 *
 * Stop by `break`ing out of the loop. On network failure the stream throws;
 * resume with `from: lastBlock.block_num + 1`.
 *
 * @example
 * ```typescript
 * import { streamBlocks } from 'hive-tx'
 *
 * for await (const block of streamBlocks()) {
 *   console.log(block.block_num, block.transactions.length)
 * }
 * ```
 */
export async function* streamBlocks(options: StreamOptions = {}): AsyncGenerator<Block> {
  const blocks = followChain(options, (nums) =>
    callRPCBatch<Block | null>(
      'condenser_api.get_block',
      nums.map((num) => [num])
    )
  )
  for await (const [num, block] of blocks) {
    block.block_num = num
    yield block
  }
}

/**
 * Streams the operations of irreversible blocks in chain order, with no gaps or duplicates.
 * Includes virtual operations (rewards, order fills, interest, ...) like `get_ops_in_block` does.
 * Same catch-up and stop behavior as `streamBlocks`. To resume, pass `from` as the last fully handled block + 1.
 *
 * @example
 * ```typescript
 * import { streamOperations } from 'hive-tx'
 *
 * for await (const { block, trx_id, op } of streamOperations()) {
 *   if (op[0] === 'transfer') console.log(block, trx_id, op[1].from, op[1].amount)
 *   if (op[0] === 'producer_reward') console.log(block, op[1].producer)
 * }
 * ```
 */
export async function* streamOperations({
  only_virtual = false,
  ...range
}: StreamOperationsOptions = {}): AsyncGenerator<AppliedOperation> {
  const blocks = followChain(range, async (nums) => {
    const lists = await callRPCBatch<AppliedOperation[]>(
      'condenser_api.get_ops_in_block',
      nums.map((num) => [num, only_virtual])
    )
    // Every block has a producer_reward virtual op, so an empty list means the node lacks the block yet
    return lists.map((ops) => (ops.length ? ops : null))
  })
  for await (const [, ops] of blocks) {
    yield* ops
  }
}
