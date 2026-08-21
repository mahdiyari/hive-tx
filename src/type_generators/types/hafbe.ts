export interface paths {
  '/witnesses': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List witnesses
     * @description List all witnesses (both active and standby)
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_witnesses(1,2);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/witnesses?page-size=2'`
     */
    get: operations['hafbe_endpoints.get_witnesses']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/witnesses/{account-name}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Returns information about a witness.
     * @description Returns information about a witness given their account name.
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_witness('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/witnesses/blocktrades'`
     */
    get: operations['hafbe_endpoints.get_witness']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/witnesses/{account-name}/voters': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get information about the voters for a witness
     * @description Get information about the voters voting for a given witness
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_witness_voters('blocktrades',1,2);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/witnesses/blocktrades/voters?page-size=2'`
     */
    get: operations['hafbe_endpoints.get_witness_voters']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/witnesses/{account-name}/voters/count': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get the number of voters for a witness
     * @description Get the number of voters for a witness
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_witness_voters_num('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/witnesses/blocktrades/voters/count'`
     */
    get: operations['hafbe_endpoints.get_witness_voters_num']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/witnesses/{account-name}/votes/history': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get the history of votes for this witness.
     * @description Get information about each vote cast for this witness
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_witness_votes_history('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/witnesses/blocktrades/votes/history?page-size=2'`
     */
    get: operations['hafbe_endpoints.get_witness_votes_history']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get information about an account including Hive token balances.
     * @description Get account's balances and parameters
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_account('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/accounts/blocktrades'`
     */
    get: operations['hafbe_endpoints.get_account']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/authority': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get account's owner, active, posting, memo and witness signing authorities
     * @description Get information about account's owner, active, posting, memo and witness signing authorities.
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_account_authority('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/accounts/blocktrades/authority'`
     */
    get: operations['hafbe_endpoints.get_account_authority']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/proxy-power': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get delegators and total vested power they contribute via witness-proxy
     * @description Lists every account that has set **{account-name}** as its witness proxy,
     *     the date the proxy was set, and the total vested power contributed
     *     (own vesting_shares plus sum of proxied vesting shares levels 1–4 and decreased by delayed vests).
     *
     *     SQL example:
     *     * `SELECT * FROM hafbe_endpoints.get_account_proxies_power('gtg', 1);`
     *
     *     REST call example:
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/accounts/gtg/proxy-power?page=1'`
     */
    get: operations['hafbe_endpoints.get_account_proxies_power']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/comment-permlinks': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get comment permlinks for an account.
     * @description List comment permlinks of root posts or comments for an account.
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_comment_permlinks('blocktrades','post',1,2,'4000000','4800000');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/accounts/blocktrades/comment-permlinks?comment-type=post&page-size=2&from-block=4000000&to-block=4800000'`
     */
    get: operations['hafbe_endpoints.get_comment_permlinks']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/operations/comments/{permlink}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get comment-related operations for an author-permlink.
     * @description List operations related to account. Optionally filtered by permlink,
     *     time/blockrange, and specific comment-related operations.
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_comment_operations('blocktrades','blocktrades-witness-report-for-3rd-week-of-august','0',1,3);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/accounts/blocktrades/operations/comments/blocktrades-witness-report-for-3rd-week-of-august?page-size=3&operation-types=0'`
     */
    get: operations['hafbe_endpoints.get_comment_operations']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/block-search': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List block stats that match operation type filter, account name, and time/block range.
     * @description List the block stats that match given operation type filter,
     *     account name and time/block range in specified order
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_block_by_op(NULL,NULL,NULL,5);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/block-search?page-size=5'`
     */
    get: operations['hafbe_endpoints.get_block_by_op']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/transaction-statistics': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Aggregated transaction statistics
     * @description History of amount of transactions per day, month or year.
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_transaction_statistics();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/transaction-statistics'`
     */
    get: operations['hafbe_endpoints.get_transaction_statistics']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Haf_block_explorer's version
     * @description Get haf_block_explorer's last commit hash (versions set by by hash value).
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_hafbe_version();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/version'`
     */
    get: operations['hafbe_endpoints.get_hafbe_version']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/last-synced-block': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get last block number synced by haf_block_explorer
     * @description Get the block number of the last block synced by haf_block_explorer.
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_hafbe_last_synced_block();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/last-synced-block'`
     */
    get: operations['hafbe_endpoints.get_hafbe_last_synced_block']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/input-type/{input-value}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Determines object type of input-value.
     * @description Determines whether the entered value is a block,
     *     block hash, transaction hash, or account name.
     *     This method is very specific to block explorer UIs.
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_input_type('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/input-type/blocktrades'`
     */
    get: operations['hafbe_endpoints.get_input_type']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operation-type-counts': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Returns histogram of operation types in blocks.
     * @description Lists the counts of operations in result-limit blocks along with their creators.
     *     If block-num is not specified, the result includes the counts of operations in the most recent blocks.
     *
     *
     *     SQL example
     *     * `SELECT * FROM hafbe_endpoints.get_latest_blocks(1);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafbe-api/operation-type-counts?result-limit=1'`
     */
    get: operations['hafbe_endpoints.get_latest_blocks']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    /** @enum {string} */
    'hafbe_types.comment_type': 'post' | 'comment' | 'all'
    /** @enum {string} */
    'hafbe_types.sort_direction': 'asc' | 'desc'
    /** @enum {string} */
    'hafbe_types.order_by_votes':
      'voter' | 'vests' | 'account_vests' | 'proxied_vests' | 'timestamp'
    /** @enum {string} */
    'hafbe_types.order_by_witness':
      | 'witness'
      | 'rank'
      | 'url'
      | 'votes'
      | 'votes_daily_change'
      | 'voters_num'
      | 'voters_num_daily_change'
      | 'price_feed'
      | 'bias'
      | 'block_size'
      | 'signing_key'
      | 'version'
      | 'feed_updated_at'
    'hafbe_types.witness': {
      /** @description witness's account name */
      witness_name?: string
      /** @description the current rank of the witness according to the votes cast on the blockchain. The top 20 witnesses (ranks 1 - 20) will produce blocks each round. */
      rank?: number
      /** @description the witness's home page */
      url?: string
      /** @description the total weight of votes cast in favor of this witness, expressed in VESTS */
      vests?: string
      /** @description the increase or decrease in votes for this witness over the last 24 hours, expressed in vests */
      votes_daily_change?: string
      /** @description the number of voters for this witness */
      voters_num?: number
      /** @description the increase or decrease in the number of voters voting for this witness over the last 24 hours */
      voters_num_daily_change?: number
      /** @description the current price feed provided by the witness in HIVE/HBD */
      price_feed?: number
      /**
       * @description When setting the price feed, you specify the base and quote. Typically, if market conditions are stable and, for example, HBD is trading at 0.25 USD on exchanges, a witness would set:
       *       base: 0.250 HBD
       *       quote: 1.000 HIVE
       *     (This indicates that one HIVE costs 0.25 HBD.) However, if the peg is not maintained and HBD does not equal 1 USD (either higher or lower), the witness can adjust the feed accordingly. For instance, if HBD is trading at only 0.90 USD on exchanges, the witness might set:
       *       base: 0.250 HBD
       *       quote: 1.100 HIVE
       *     In this case, the bias is 10%
       */
      bias?: number
      /**
       * Format: date-time
       * @description timestamp when feed was updated
       */
      feed_updated_at?: string
      /** @description the maximum block size the witness is currently voting for, in bytes */
      block_size?: number
      /** @description the key used to verify blocks signed by this witness */
      signing_key?: string
      /** @description the version of hived the witness is running */
      version?: string
      /** @description the number of blocks the witness should have generated but didn't (over the entire lifetime of the blockchain) */
      missed_blocks?: number
      /** @description the interest rate the witness is voting for */
      hbd_interest_rate?: number
      /** @description the last block number created by the witness */
      last_confirmed_block_num?: number
      /** @description the cost of creating an account. */
      account_creation_fee?: number
    }
    'hafbe_types.witnesses_return': {
      /** @description Total number of witnesses */
      total_witnesses?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description List of witness parameters */
      witnesses?: components['schemas']['hafbe_types.witness'][]
    }
    'hafbe_types.witness_voter': {
      /** @description account name of the voter */
      voter_name?: string
      /** @description number of vests this voter is directly voting with */
      vests?: string
      /** @description number of vests in the voter's account.  if some vests are delegated, they will not be counted in voting */
      account_vests?: string
      /** @description the number of vests proxied to this account */
      proxied_vests?: string
      /**
       * Format: date-time
       * @description the time this account last changed its voting power
       */
      timestamp?: string
    }
    'hafbe_types.witness_voter_history': {
      /** @description Total number of votes */
      total_votes?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description List of votes results */
      voters?: components['schemas']['hafbe_types.witness_voter'][]
    }
    'hafbe_types.witness_votes_history_record': {
      /** @description account name of the voter */
      voter_name?: string
      /** @description whether the voter approved or rejected the witness */
      approve?: boolean
      /** @description number of vests this voter is directly voting with */
      vests?: string
      /** @description number of vests in the voter's account.  if some vests are delegated, they will not be counted in voting */
      account_vests?: string
      /** @description the number of vests proxied to this account */
      proxied_vests?: string
      /**
       * Format: date-time
       * @description the time of the vote change
       */
      timestamp?: string
    }
    'hafbe_types.witness_votes_history': {
      /** @description Total number of votes */
      total_votes?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description List of witness votes */
      votes_history?: components['schemas']['hafbe_types.witness_votes_history_record'][]
    }
    'hafbe_types.account': {
      /** @description account's identification number */
      id?: number
      /** @description account's name */
      name?: string
      /** @description information whether the account can vote or not */
      can_vote?: boolean
      /** @description information whether made a prove of work */
      mined?: boolean
      /** @description an account to which the account has designated as its proxy */
      proxy?: string
      /** @description an account to which the account has designated as its recovery account */
      recovery_account?: string
      /**
       * Format: date-time
       * @description time when the last account recovery was performed
       */
      last_account_recovery?: string
      /**
       * Format: date-time
       * @description date of account creation
       */
      created?: string
      /** @description numerical rating of the user  based on upvotes and downvotes on user's posts */
      reputation?: number
      /** @description pool of prepaid accounts available for user allocation.  These accounts are pre-registered and can be claimed by users as needed */
      pending_claimed_accounts?: number
      /** @description parameter encompasses personalized profile information */
      json_metadata?: string
      /** @description parameter encompasses personalized profile information */
      posting_json_metadata?: string
      /** @description url to profile image */
      profile_image?: string
      /** @description number of HIVE backed dollars the account has */
      hbd_balance?: number
      /** @description account's HIVE balance */
      balance?: number
      /** @description account's VEST balance */
      vesting_shares?: string
      /** @description the VEST balance, presented in HIVE,  is calculated based on the current HIVE price */
      vesting_balance?: number
      /** @description saving balance of HIVE backed dollars */
      hbd_saving_balance?: number
      /** @description HIVE saving balance */
      savings_balance?: number
      /** @description number representing how many payouts are pending  from user's saving balance */
      savings_withdraw_requests?: number
      /** @description not yet claimed HIVE backed dollars  stored in hbd reward balance */
      reward_hbd_balance?: number
      /** @description not yet claimed HIVE  stored in hive reward balance */
      reward_hive_balance?: number
      /** @description not yet claimed VESTS  stored in vest reward balance */
      reward_vesting_balance?: string
      /** @description the reward vesting balance, denominated in HIVE,  is determined by the prevailing HIVE price at the time of reward reception */
      reward_vesting_hive?: number
      /** @description rewards obtained by posting and commenting expressed in VEST */
      posting_rewards?: string
      /** @description curator's reward expressed in VEST */
      curation_rewards?: string
      /** @description VESTS delegated to another user,  account's power is lowered by delegated VESTS */
      delegated_vesting_shares?: string
      /** @description VESTS received from another user,  account's power is increased by received VESTS */
      received_vesting_shares?: string
      /** @description recursive proxy of VESTS */
      proxied_vsf_votes?: string[]
      /** @description the total VESTS already withdrawn from active withdrawals */
      withdrawn?: string
      /** @description received until the withdrawal is complete,  with each installment amounting to 1/13 of the withdrawn total */
      vesting_withdraw_rate?: string
      /** @description the remaining total VESTS needed to complete withdrawals */
      to_withdraw?: string
      /** @description list of account receiving the part of a withdrawal */
      withdraw_routes?: number
      /** @description blocked VESTS by a withdrawal */
      delayed_vests?: string
      /** @description the roster of witnesses voted by the account */
      witness_votes?: string[]
      /** @description count of witness_votes */
      witnesses_voted_for?: number
      /** @description the number of operations performed by the account */
      ops_count?: number
      /** @description whether account is a witness */
      is_witness?: boolean
    }
    'hafbe_types.auth_with_weight': (string | number)[]
    'hafbe_types.authority_type': {
      key_auths?: components['schemas']['hafbe_types.auth_with_weight'][]
      account_auths?: components['schemas']['hafbe_types.auth_with_weight'][]
      weight_threshold?: number
    }
    'hafbe_types.account_authority': {
      /** @description the most powerful key because it can change any key of an account, including the owner key. Ideally it is meant to be stored offline, and only used to recover a compromised account */
      owner?: components['schemas']['hafbe_types.authority_type']
      /** @description key meant for more sensitive tasks such as transferring funds, power up/down transactions, converting Hive Dollars, voting for witnesses, updating profile details and avatar, and placing a market order */
      active?: components['schemas']['hafbe_types.authority_type']
      /** @description key allows accounts to post, comment, edit, vote, reblog and follow or mute other accounts */
      posting?: components['schemas']['hafbe_types.authority_type']
      /** @description default key to be used for memo encryption */
      memo?: string
      /** @description key used by a witness to sign blocks */
      witness_signing?: string
    }
    'hafbe_types.proxy_power': {
      account?: string
      /** Format: date-time */
      proxy_date?: string
      /** @description Own vesting shares plus sum of proxied vesting shares (levels 1–4) decreased by delayed vests */
      proxied_vests?: string
    }
    'hafbe_types.block_range': {
      from?: number
      to?: number
    }
    'hafbe_types.block_operations': {
      /** @description operation type identifier */
      op_type_id?: number
      /** @description amount of operations in block */
      op_count?: number
    }
    'hafbe_types.blocksearch': {
      /** @description block number */
      block_num?: number
      /**
       * Format: date-time
       * @description creation date
       */
      created_at?: string
      /** @description account name of block's producer */
      producer_account?: string
      /** @description operation type identifier */
      producer_reward?: string
      /** @description count of transactions in block */
      trx_count?: number
      /** @description block hash in a blockchain is a unique, fixed-length string generated  by applying a cryptographic hash function to a block's contents */
      hash?: string
      /** @description hash of a previous block */
      prev?: string
      /** @description List of block_operation */
      operations?: components['schemas']['hafbe_types.block_operations'][]
    }
    'hafbe_types.block_history': {
      /** @description Total number of blocks */
      total_blocks?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description Range of blocks that contains the returned pages */
      block_range?: components['schemas']['hafbe_types.block_range']
      /** @description List of block results */
      blocks_result?: components['schemas']['hafbe_types.blocksearch'][]
    }
    'hafbe_types.permlink': {
      /** @description unique post identifier containing post's title and generated number */
      permlink?: string
      /** @description operation block number */
      block?: number
      /** @description hash of the transaction */
      trx_id?: string
      /**
       * Format: date-time
       * @description creation date
       */
      timestamp?: string
      /** @description unique operation identifier with an encoded block number and operation type id */
      operation_id?: string
    }
    'hafbe_types.permlink_history': {
      /** @description Total number of permlinks */
      total_permlinks?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description Range of blocks that contains the returned pages */
      block_range?: components['schemas']['hafbe_types.block_range']
      /** @description List of permlinks */
      permlinks_result?: components['schemas']['hafbe_types.permlink'][]
    }
    'hafbe_types.latest_blocks': {
      /** @description block number */
      block_num?: number
      /** @description witness that created the block */
      witness?: string
      /** @description List of block_operation */
      operations?: components['schemas']['hafbe_types.block_operations'][]
    }
    'hafbe_types.array_of_latest_blocks': components['schemas']['hafbe_types.latest_blocks'][]
    'hafbe_types.input_type_return': {
      /** @description operation type id */
      input_type?: string
      /** @description number of operations in the block */
      input_value?: string[]
    }
    'hafbe_types.operation_body': {
      type?: string
      value?: Record<string, never>
    }
    'hafbe_types.operation': {
      /** @description operation body */
      op?: components['schemas']['unknown_operation']
      /** @description operation block number */
      block?: number
      /** @description hash of the transaction */
      trx_id?: string
      /** @description operation identifier that indicates its sequence number in transaction */
      op_pos?: number
      /** @description operation type identifier */
      op_type_id?: number
      /**
       * Format: date-time
       * @description the time operation was included in the blockchain
       */
      timestamp?: string
      /** @description true if is a virtual operation */
      virtual_op?: boolean
      /** @description unique operation identifier with an encoded block number and operation type id */
      operation_id?: string
      /** @description transaction identifier that indicates its sequence number in block */
      trx_in_block?: number
    }
    'hafbe_types.operation_history': {
      /** @description Total number of operations */
      total_operations?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description List of operation results */
      operations_result?: components['schemas']['hafbe_types.operation'][]
    }
    /** @enum {string} */
    'hafbe_types.granularity': 'daily' | 'monthly' | 'yearly'
    'hafbe_types.transaction_stats': {
      /**
       * Format: date-time
       * @description the time transaction was included in the blockchain
       */
      date?: string
      /** @description amount of transactions */
      trx_count?: number
      /** @description avarage amount of transactions in block */
      avg_trx?: number
      /** @description minimal amount of transactions in block */
      min_trx?: number
      /** @description maximum amount of transactions in block */
      max_trx?: number
      /** @description last block number in time range */
      last_block_num?: number
    }
    'hafbe_types.array_of_transaction_stats': components['schemas']['hafbe_types.transaction_stats'][]
    'hafbe_types.array_of_proxy_power': components['schemas']['hafbe_types.proxy_power'][]
    unknown_operation: Record<string, never>
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  'hafbe_endpoints.get_witnesses': {
    parameters: {
      query?: {
        /** @description Return page on `page` number, defaults to `1` */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100` */
        'page-size'?: number
        /**
         * @description Sort key:
         *
         *      * `witness` - the witness name
         *
         *      * `rank` - their current rank (highest weight of votes => lowest rank)
         *
         *      * `url` - the witness url
         *
         *      * `votes` - total number of votes
         *
         *      * `votes_daily_change` - change in `votes` in the last 24 hours
         *
         *      * `voters_num` - total number of voters approving the witness
         *
         *      * `voters_num_daily_change` - change in `voters_num` in the last 24 hours
         *
         *      * `price_feed` - their current published value for the HIVE/HBD price feed
         *
         *      * `feed_updated_at` - feed update timestamp
         *
         *      * `bias` - if HBD is trading at only 0.90 USD on exchanges, the witness might set:
         *             base: 0.250 HBD
         *             quote: 1.100 HIVE
         *           In this case, the bias is 10%
         *
         *      * `block_size` - the block size they are voting for
         *
         *      * `signing_key` - the witness' block-signing public key
         *
         *      * `version` - the version of hived the witness is running
         */
        sort?: components['schemas']['hafbe_types.order_by_witness']
        /**
         * @description Sort order:
         *
         *      * `asc` - Ascending, from A to Z or smallest to largest
         *
         *      * `desc` - Descending, from Z to A or largest to smallest
         */
        direction?: components['schemas']['hafbe_types.sort_direction']
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description The list of witnesses
       *
       *     * Returns `hafbe_types.witnesses_return`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_witnesses": 731,
           *       "total_pages": 366,
           *       "witnesses": [
           *         {
           *           "witness_name": "roadscape",
           *           "rank": 1,
           *           "url": "https://steemit.com/witness-category/@roadscape/witness-roadscape",
           *           "vests": "94172201023355097",
           *           "votes_daily_change": "0",
           *           "voters_num": 306,
           *           "voters_num_daily_change": 0,
           *           "price_feed": 0.539,
           *           "bias": 0,
           *           "feed_updated_at": "2016-09-15T16:07:42",
           *           "block_size": 65536,
           *           "signing_key": "STM5AS7ZS33pzTf1xbTi8ZUaUeVAZBsD7QXGrA51HvKmvUDwVbFP9",
           *           "version": "0.13.0",
           *           "missed_blocks": 129,
           *           "hbd_interest_rate": 1000,
           *           "last_confirmed_block_num": 4999986,
           *           "account_creation_fee": 2000
           *         },
           *         {
           *           "witness_name": "arhag",
           *           "rank": 2,
           *           "url": "https://steemit.com/witness-category/@arhag/witness-arhag",
           *           "vests": "91835048921097725",
           *           "votes_daily_change": "0",
           *           "voters_num": 348,
           *           "voters_num_daily_change": 0,
           *           "price_feed": 0.536,
           *           "bias": 0,
           *           "feed_updated_at": "2016-09-15T19:31:18",
           *           "block_size": 65536,
           *           "signing_key": "STM8kvk4JH2m6ZyHBGNor4qk2Zwdi2MJAjMYUpfqiicCKu7HqAeZh",
           *           "version": "0.13.0",
           *           "missed_blocks": 61,
           *           "hbd_interest_rate": 1000,
           *           "last_confirmed_block_num": 4999993,
           *           "account_creation_fee": 7000
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafbe_types.witnesses_return']
        }
      }
    }
  }
  'hafbe_endpoints.get_witness': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description witness account name */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Various witness statistics
       *
       *     * Returns `hafbe_types.witness_return`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "witness_name": "blocktrades",
           *       "rank": 8,
           *       "url": "https://blocktrades.us",
           *       "vests": "82373419958692803",
           *       "votes_daily_change": "0",
           *       "voters_num": 263,
           *       "voters_num_daily_change": 0,
           *       "price_feed": 0.545,
           *       "bias": 0,
           *       "feed_updated_at": "2016-09-15T16:02:21",
           *       "block_size": 65536,
           *       "signing_key": "STM4vmVc3rErkueyWNddyGfmjmLs3Rr4i7YJi8Z7gFeWhakXM4nEz",
           *       "version": "0.13.0",
           *       "missed_blocks": 935,
           *       "hbd_interest_rate": 1000,
           *       "last_confirmed_block_num": 4999992,
           *       "account_creation_fee": 9000
           *     }
           */
          'application/json': components['schemas']['hafbe_types.witness']
        }
      }
      /** @description No such witness */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_witness_voters': {
    parameters: {
      query?: {
        /**
         * @description When provided, only votes associated with this account will be included in the results,
         *     allowing for targeted analysis of an individual account's voting activity.
         */
        'voter-name'?: string
        /** @description Return page on `page` number, defaults to `1` */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100` */
        'page-size'?: number
        /**
         * @description Sort order:
         *
         *      * `voter` - account name of voter
         *
         *      * `vests` - total voting power = account_vests + proxied_vests of voter
         *
         *      * `account_vests` - direct vests of voter
         *
         *      * `proxied_vests` - proxied vests of voter
         *
         *      * `timestamp` - last time voter voted for the witness
         */
        sort?: components['schemas']['hafbe_types.order_by_votes']
        /**
         * @description Sort order:
         *
         *      * `asc` - Ascending, from A to Z or smallest to largest
         *
         *      * `desc` - Descending, from Z to A or largest to smallest
         */
        direction?: components['schemas']['hafbe_types.sort_direction']
      }
      header?: never
      path: {
        /** @description witness account name */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description The number of voters currently voting for this witness
       *
       *     * Returns `hafbe_types.witness_voter_history`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_votes": 263,
           *       "total_pages": 132,
           *       "voters": [
           *         {
           *           "voter_name": "blocktrades",
           *           "vests": "13155953611548185",
           *           "account_vests": "8172549681941451",
           *           "proxied_vests": "4983403929606734",
           *           "timestamp": "2016-04-15T02:19:57"
           *         },
           *         {
           *           "voter_name": "dan",
           *           "vests": "9928811304950768",
           *           "account_vests": "9928811304950768",
           *           "proxied_vests": "0",
           *           "timestamp": "2016-06-27T12:41:42"
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafbe_types.witness_voter_history']
        }
      }
      /** @description No such witness */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_witness_voters_num': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description The witness account name */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description The number of voters currently voting for this witness
       *
       *     * Returns `INT`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example 263 */
          'application/json': number
        }
      }
      /** @description No such witness */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_witness_votes_history': {
    parameters: {
      query?: {
        /**
         * @description When provided, only votes associated with this account will be included in the results,
         *     allowing for targeted analysis of an individual account's voting activity.
         */
        'voter-name'?: string
        /** @description Return page on `page` number, defaults to `1` */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100` */
        'page-size'?: number
        direction?: components['schemas']['hafbe_types.sort_direction']
        /**
         * @description Lower limit of the block range, can be represented either by a block-number (integer) or a timestamp (in the format YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is more than or equal to the given `timestamp` (i.e. `block's created_at >= timestamp`).
         *
         *     The function will interpret and convert the input based on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'from-block'?: string
        /**
         * @description Similar to the from-block parameter, can either be a block-number (integer) or a timestamp (formatted as YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is less than or equal to the given `timestamp` (i.e. `block's created_at <= timestamp`).
         *
         *     The function will convert the value depending on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'to-block'?: string
      }
      header?: never
      path: {
        /** @description witness account name */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description The number of voters currently voting for this witness
       *
       *     * Returns `hafbe_types.witness_votes_history`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_votes": 263,
           *       "total_pages": 132,
           *       "votes_history": [
           *         {
           *           "voter_name": "jeremyfromwi",
           *           "approve": true,
           *           "vests": "441156952466",
           *           "account_vests": "441156952466",
           *           "proxied_vests": "0",
           *           "timestamp": "2016-09-15T07:07:15"
           *         },
           *         {
           *           "voter_name": "cryptomental",
           *           "approve": true,
           *           "vests": "686005633844",
           *           "account_vests": "686005633844",
           *           "proxied_vests": "0",
           *           "timestamp": "2016-09-15T07:00:51"
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafbe_types.witness_votes_history']
        }
      }
      /** @description No such witness */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_account': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Name of the account */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description The account's parameters
       *
       *     * Returns `hafbe_types.account`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "id": 440,
           *       "name": "blocktrades",
           *       "can_vote": true,
           *       "mined": true,
           *       "proxy": "",
           *       "recovery_account": "steem",
           *       "last_account_recovery": "1970-01-01T00:00:00",
           *       "created": "2016-03-30T00:04:36",
           *       "reputation": 69,
           *       "pending_claimed_accounts": 0,
           *       "json_metadata": "",
           *       "posting_json_metadata": "",
           *       "profile_image": "",
           *       "hbd_balance": 77246982,
           *       "balance": 29594875,
           *       "vesting_shares": "8172549681941451",
           *       "vesting_balance": 2720696229,
           *       "hbd_saving_balance": 0,
           *       "savings_balance": 0,
           *       "savings_withdraw_requests": 0,
           *       "reward_hbd_balance": 0,
           *       "reward_hive_balance": 0,
           *       "reward_vesting_balance": "0",
           *       "reward_vesting_hive": 0,
           *       "posting_rewards": "65916519",
           *       "curation_rewards": "196115157",
           *       "delegated_vesting_shares": "0",
           *       "received_vesting_shares": "0",
           *       "proxied_vsf_votes": [
           *         "4983403929606734",
           *         "0",
           *         "0",
           *         "0"
           *       ],
           *       "withdrawn": "804048182205290",
           *       "vesting_withdraw_rate": "80404818220529",
           *       "to_withdraw": "8362101094935031",
           *       "withdraw_routes": 4,
           *       "delayed_vests": "0",
           *       "witness_votes": [
           *         "steempty",
           *         "blocktrades",
           *         "datasecuritynode",
           *         "steemed",
           *         "silversteem",
           *         "witness.svk",
           *         "joseph",
           *         "smooth.witness",
           *         "gtg"
           *       ],
           *       "witnesses_voted_for": 9,
           *       "ops_count": 219867,
           *       "is_witness": true
           *     }
           */
          'application/json': components['schemas']['hafbe_types.account']
        }
      }
      /** @description No such account in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_account_authority': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Name of the account */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description List of account's authorities
       *
       *     * Returns `hafbe_types.account_authority`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "owner": {
           *         "key_auths": [
           *           [
           *             "STM7WdrxF6iuSiHUB4maoLGXXBKXbqAJ9AZbzACX1MPK2AkuCh23S",
           *             1
           *           ]
           *         ],
           *         "account_auths": [],
           *         "weight_threshold": 1
           *       },
           *       "active": {
           *         "key_auths": [
           *           [
           *             "STM5vgGoHBrUuDCspAPYi3dLwSyistyrz61NWkZNUAXAifZJaDLPF",
           *             1
           *           ]
           *         ],
           *         "account_auths": [],
           *         "weight_threshold": 1
           *       },
           *       "posting": {
           *         "key_auths": [
           *           [
           *             "STM5SaNVKJgy6ghnkNoMAprTxSDG55zps21Bo8qe1rnHmwAR4LzzC",
           *             1
           *           ]
           *         ],
           *         "account_auths": [],
           *         "weight_threshold": 1
           *       },
           *       "memo": "STM7EAUbNf1CdTrMbydPoBTRMG4afXCoAErBJYevhgne6zEP6rVBT",
           *       "witness_signing": "STM4vmVc3rErkueyWNddyGfmjmLs3Rr4i7YJi8Z7gFeWhakXM4nEz"
           *     }
           */
          'application/json': components['schemas']['hafbe_types.account_authority']
        }
      }
      /** @description No such account in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_account_proxies_power': {
    parameters: {
      query?: {
        /** @description 1-based page number (100 rows per page) */
        page?: number
      }
      header?: never
      path: {
        /** @description Name of the proxy account */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Array of delegators and their total vested power */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['hafbe_types.array_of_proxy_power']
        }
      }
      /** @description No such account in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_comment_permlinks': {
    parameters: {
      query?: {
        /**
         * @description Sort order:
         *
         *      * `post`    - permlinks related to root posts
         *
         *      * `comment` - permlinks related to comments
         *
         *      * `all`     - both, posts and comments
         */
        'comment-type'?: components['schemas']['hafbe_types.comment_type']
        /** @description Return page on `page` number, defaults to `1` */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100` */
        'page-size'?: number
        /**
         * @description Lower limit of the block range, can be represented either by a block-number (integer) or a timestamp (in the format YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is more than or equal to the given `timestamp` (i.e. `block's created_at >= timestamp`).
         *
         *     The function will interpret and convert the input based on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'from-block'?: string
        /**
         * @description Similar to the from-block parameter, can either be a block-number (integer) or a timestamp (formatted as YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is less than or equal to the given `timestamp` (i.e. `block's created_at <= timestamp`).
         *
         *     The function will convert the value depending on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'to-block'?: string
      }
      header?: never
      path: {
        /** @description Account to get operations for */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Result contains total number of operations,
       *     total pages, and the list of operations.
       *
       *     * Returns `hafbe_types.permlink_history`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_permlinks": 3,
           *       "total_pages": 2,
           *       "block_range": {
           *         "from": 4000000,
           *         "to": 4800000
           *       },
           *       "permlinks_result": [
           *         {
           *           "permlink": "witness-report-for-blocktrades-for-last-week-of-august",
           *           "block": 4575065,
           *           "trx_id": "d35590b9690ee8aa4b572901d62bc6263953346a",
           *           "timestamp": "2016-09-01T00:18:51",
           *           "operation_id": "19649754552074241"
           *         },
           *         {
           *           "permlink": "blocktrades-witness-report-for-3rd-week-of-august",
           *           "block": 4228346,
           *           "trx_id": "bdcd754eb66f18eac11322310ae7ece1e951c08c",
           *           "timestamp": "2016-08-19T21:27:00",
           *           "operation_id": "18160607786173953"
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafbe_types.permlink_history']
        }
      }
      /** @description No such account in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_comment_operations': {
    parameters: {
      query?: {
        /**
         * @description List of operation types to include. If NULL, all comment operation types will be included.
         *     comment-related operation type ids: `0, 1, 17, 19, 51, 52, 53, 61, 63, 72, 73`
         */
        'operation-types'?: string
        /** @description Return page on `page` number, defaults to `1` */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100` */
        'page-size'?: number
        /**
         * @description Sort order:
         *
         *      * `asc` - Ascending, from A to Z or smallest to largest
         *
         *      * `desc` - Descending, from Z to A or largest to smallest
         */
        direction?: components['schemas']['hafbe_types.sort_direction']
        /**
         * @description If the operation length exceeds the `data-size-limit`,
         *     the operation body is replaced with a placeholder (defaults to `200000`).
         */
        'data-size-limit'?: number
      }
      header?: never
      path: {
        /** @description Account to get operations for */
        'account-name': string
        /** @description Unique post identifier containing post's title and generated number */
        permlink: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Result contains total number of operations,
       *     total pages, and the list of operations.
       *
       *     * Returns `hafbe_types.operation_history `
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_operations": 350,
           *       "total_pages": 117,
           *       "operations_result": [
           *         {
           *           "op": {
           *             "type": "vote_operation",
           *             "value": {
           *               "voter": "blocktrades",
           *               "author": "blocktrades",
           *               "weight": 10000,
           *               "permlink": "blocktrades-witness-report-for-3rd-week-of-august"
           *             }
           *           },
           *           "block": 4228228,
           *           "trx_id": "2bbeb7513e49cb169d4fe446ff980f2102f7210a",
           *           "op_pos": 1,
           *           "op_type_id": 0,
           *           "timestamp": "2016-08-19T21:21:03",
           *           "virtual_op": false,
           *           "operation_id": "18160100980032256",
           *           "trx_in_block": 1
           *         },
           *         {
           *           "op": {
           *             "type": "vote_operation",
           *             "value": {
           *               "voter": "murh",
           *               "author": "blocktrades",
           *               "weight": 3301,
           *               "permlink": "blocktrades-witness-report-for-3rd-week-of-august"
           *             }
           *           },
           *           "block": 4228239,
           *           "trx_id": "e06bc7ad9c51a974ee2bd673e8fa4b4f7018bc18",
           *           "op_pos": 0,
           *           "op_type_id": 0,
           *           "timestamp": "2016-08-19T21:21:36",
           *           "virtual_op": false,
           *           "operation_id": "18160148224672256",
           *           "trx_in_block": 1
           *         },
           *         {
           *           "op": {
           *             "type": "vote_operation",
           *             "value": {
           *               "voter": "weenis",
           *               "author": "blocktrades",
           *               "weight": 10000,
           *               "permlink": "blocktrades-witness-report-for-3rd-week-of-august"
           *             }
           *           },
           *           "block": 4228240,
           *           "trx_id": "c5a07b2a069db3ac9faffe0c5a6c6296ef3e78c5",
           *           "op_pos": 0,
           *           "op_type_id": 0,
           *           "timestamp": "2016-08-19T21:21:39",
           *           "virtual_op": false,
           *           "operation_id": "18160152519641600",
           *           "trx_in_block": 5
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafbe_types.operation_history']
        }
      }
      /** @description No such account in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_block_by_op': {
    parameters: {
      query?: {
        /**
         * @description List of operations: if the parameter is NULL, all operations will be included.
         *     example: `18,12`
         */
        'operation-types'?: string
        /** @description Filter operations by the account that created them. */
        'account-name'?: string
        /** @description Return page on `page` number, defaults to `NULL` */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100` */
        'page-size'?: number
        /**
         * @description Sort order:
         *
         *      * `asc` - Ascending, from A to Z or smallest to largest
         *
         *      * `desc` - Descending, from Z to A or largest to smallest
         */
        direction?: components['schemas']['hafbe_types.sort_direction']
        /**
         * @description Lower limit of the block range, can be represented either by a block-number (integer) or a timestamp (in the format YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is more than or equal to the given `timestamp` (i.e. `block's created_at >= timestamp`).
         *
         *     The function will interpret and convert the input based on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'from-block'?: string
        /**
         * @description Similar to the from-block parameter, can either be a block-number (integer) or a timestamp (formatted as YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is less than or equal to the given `timestamp` (i.e. `block's created_at <= timestamp`).
         *
         *     The function will convert the value depending on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'to-block'?: string
        /**
         * @description A parameter specifying the desired value in operation body,
         *     example: `value.creator=alpha`
         */
        'path-filter'?: string[]
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Block number with filtered operations
       *
       *     * Returns `hafbe_types.block_history`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_blocks": 5000000,
           *       "total_pages": 1000000,
           *       "block_range": {
           *         "from": 1,
           *         "to": 5000000
           *       },
           *       "blocks_result": [
           *         {
           *           "block_num": 5000000,
           *           "created_at": "2016-09-15T19:47:21",
           *           "producer_account": "ihashfury",
           *           "producer_reward": "3003845513",
           *           "trx_count": 2,
           *           "hash": "004c4b40245ffb07380a393fb2b3d841b76cdaec",
           *           "prev": "004c4b3fc6a8735b4ab5433d59f4526e4a042644",
           *           "operations": [
           *             {
           *               "op_type_id": 5,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 9,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 64,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 80,
           *               "op_count": 1
           *             }
           *           ]
           *         },
           *         {
           *           "block_num": 4999999,
           *           "created_at": "2016-09-15T19:47:18",
           *           "producer_account": "smooth.witness",
           *           "producer_reward": "3003846056",
           *           "trx_count": 4,
           *           "hash": "004c4b3fc6a8735b4ab5433d59f4526e4a042644",
           *           "prev": "004c4b3e03ea2eac2494790786bfb9e41a8669d9",
           *           "operations": [
           *             {
           *               "op_type_id": 0,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 6,
           *               "op_count": 2
           *             },
           *             {
           *               "op_type_id": 30,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 64,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 72,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 78,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 85,
           *               "op_count": 2
           *             }
           *           ]
           *         },
           *         {
           *           "block_num": 4999998,
           *           "created_at": "2016-09-15T19:47:15",
           *           "producer_account": "steemed",
           *           "producer_reward": "3003846904",
           *           "trx_count": 2,
           *           "hash": "004c4b3e03ea2eac2494790786bfb9e41a8669d9",
           *           "prev": "004c4b3d6c34ebe3eb75dad04ce0a13b5f8a08cf",
           *           "operations": [
           *             {
           *               "op_type_id": 0,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 1,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 64,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 72,
           *               "op_count": 1
           *             }
           *           ]
           *         },
           *         {
           *           "block_num": 4999997,
           *           "created_at": "2016-09-15T19:47:12",
           *           "producer_account": "clayop",
           *           "producer_reward": "3003847447",
           *           "trx_count": 4,
           *           "hash": "004c4b3d6c34ebe3eb75dad04ce0a13b5f8a08cf",
           *           "prev": "004c4b3c51ee947feceeb1812702816114aea6e4",
           *           "operations": [
           *             {
           *               "op_type_id": 0,
           *               "op_count": 2
           *             },
           *             {
           *               "op_type_id": 2,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 5,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 61,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 64,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 72,
           *               "op_count": 2
           *             }
           *           ]
           *         },
           *         {
           *           "block_num": 4999996,
           *           "created_at": "2016-09-15T19:47:09",
           *           "producer_account": "riverhead",
           *           "producer_reward": "3003847991",
           *           "trx_count": 2,
           *           "hash": "004c4b3c51ee947feceeb1812702816114aea6e4",
           *           "prev": "004c4b3bd268694ea02f24de50c50c9e7a831e60",
           *           "operations": [
           *             {
           *               "op_type_id": 6,
           *               "op_count": 2
           *             },
           *             {
           *               "op_type_id": 64,
           *               "op_count": 1
           *             },
           *             {
           *               "op_type_id": 85,
           *               "op_count": 2
           *             }
           *           ]
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafbe_types.block_history']
        }
      }
      /** @description No operations in database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_transaction_statistics': {
    parameters: {
      query?: {
        /**
         * @description granularity types:
         *
         *     * daily
         *
         *     * monthly
         *
         *     * yearly
         */
        granularity?: components['schemas']['hafbe_types.granularity']
        /**
         * @description Sort order:
         *
         *      * `asc` - Ascending, from oldest to newest
         *
         *      * `desc` - Descending, from newest to oldest
         */
        direction?: components['schemas']['hafbe_types.sort_direction']
        /**
         * @description Lower limit of the block range, can be represented either by a block-number (integer) or a timestamp (in the format YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is more than or equal to the given `timestamp` (i.e. `block's created_at >= timestamp`).
         *
         *     The function will interpret and convert the input based on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'from-block'?: string
        /**
         * @description Similar to the from-block parameter, can either be a block-number (integer) or a timestamp (formatted as YYYY-MM-DD HH:MI:SS).
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is less than or equal to the given `timestamp` (i.e. `block's created_at <= timestamp`).
         *
         *     The function will convert the value depending on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'to-block'?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Balance change
       *
       *     * Returns array of `hafbe_types.transaction_stats`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "date": "2017-01-01T00:00:00",
           *         "trx_count": 6961192,
           *         "avg_trx": 1,
           *         "min_trx": 0,
           *         "max_trx": 89,
           *         "last_block_num": 5000000
           *       }
           *     ]
           */
          'application/json': components['schemas']['hafbe_types.array_of_transaction_stats']
        }
      }
      /** @description No such account in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_hafbe_version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Haf_block_explorer version
       *
       *     * Returns `TEXT`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example c2fed8958584511ef1a66dab3dbac8c40f3518f0 */
          'application/json': string
        }
      }
      /** @description App not installed */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_hafbe_last_synced_block': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last synced block by Haf_block_explorer
       *
       *     * Returns `INT`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example 5000000 */
          'application/json': number
        }
      }
      /** @description No blocks synced */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_input_type': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Object type to be identified. */
        'input-value': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Result contains total operations number,
       *     total pages and the list of operations
       *
       *     * Returns `hafbe_types.input_type_return `
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "input_type": "account_name",
           *       "input_value": [
           *         "blocktrades"
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafbe_types.input_type_return']
        }
      }
      /** @description Input is not recognized */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafbe_endpoints.get_latest_blocks': {
    parameters: {
      query?: {
        /**
         * @description Given block, can be represented either by a `block-num` (integer) or a `timestamp` (in the format `YYYY-MM-DD HH:MI:SS`),
         *
         *     The provided `timestamp` will be converted to a `block-num` by finding the first block
         *     where the block's `created_at` is less than or equal to the given `timestamp` (i.e. `block's created_at <= timestamp`).
         *
         *     The function will interpret and convert the input based on its format, example input:
         *
         *     * `2016-09-15 19:47:21`
         *
         *     * `5000000`
         */
        'block-num'?: string
        /** @description Specifies number of blocks to return starting with head block, defaults to `20` */
        'result-limit'?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Operation counts for each block
       *
       *     * Returns array of `hafbe_types.latest_blocks`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "block_num": 5000000,
           *         "witness": "ihashfury",
           *         "operations": [
           *           {
           *             "op_count": 1,
           *             "op_type_id": 64
           *           },
           *           {
           *             "op_count": 1,
           *             "op_type_id": 9
           *           },
           *           {
           *             "op_count": 1,
           *             "op_type_id": 80
           *           },
           *           {
           *             "op_count": 1,
           *             "op_type_id": 5
           *           }
           *         ]
           *       }
           *     ]
           */
          'application/json': components['schemas']['hafbe_types.array_of_latest_blocks']
        }
      }
      /** @description No blocks in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}
