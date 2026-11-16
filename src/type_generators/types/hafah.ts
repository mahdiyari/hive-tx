export interface paths {
  '/blocks': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get block details in range
     * @description Retrieve a range of full, signed blocks.
     *     The list may be shorter than requested if count blocks would take you past the current head block.
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_block_range(4999999,5000000);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/blocks?from-block=4999999&to-block=5000000'`
     */
    get: operations['hafah_endpoints.get_block_range']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/blocks/{block-num}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get block details
     * @description Retrieve a full, signed block of the referenced block, or null if no matching block was found.
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_block(5000000);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/blocks/5000000'`
     */
    get: operations['hafah_endpoints.get_block']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/blocks/{block-num}/header': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get block header of the referenced block
     * @description Retrieve a block header of the referenced block, or null if no matching block was found.
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_block_header(500000);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/blocks/500000/header'`
     */
    get: operations['hafah_endpoints.get_block_header']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/blocks/{block-num}/operations': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get operations in block
     * @description List the operations in the specified order that are within the given block number.
     *     The page size determines the number of operations per page
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_ops_by_block_paging(5000000,'5,64');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/blocks/5000000/operations?operation-types=80&path-filter=value.creator=steem'`
     */
    get: operations['hafah_endpoints.get_ops_by_block_paging']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operations': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get operations in a block range
     * @description Returns all operations contained in specified block range, supports various forms of filtering.
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_operations(4999999,5000000);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/operations?from-block=4999999&to-block=5000000&operation-group-type=virtual'`
     */
    get: operations['hafah_endpoints.get_operations']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operations/{operation-id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * lookup an operation by its id.
     * @description Get operation's body and its extended parameters
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_operation(3448858738752);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/operations/3448858738752'`
     */
    get: operations['hafah_endpoints.get_operation']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operation-types': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Lookup operation type ids for operations matching a partial operation name.
     * @description Lookup operation type ids for operations matching a partial operation name.
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_op_types('author');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/operation-types?partial-operation-name=author'`
     */
    get: operations['hafah_endpoints.get_op_types']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operation-types/{type-id}/keys': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Returns key names for an operation type.
     * @description Returns json body keys for an operation type
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_operation_keys(1);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/operation-types/1/keys'`
     */
    get: operations['hafah_endpoints.get_operation_keys']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/transactions/{transaction-id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Lookup a transaction's details from its transaction id.
     * @description Returns the details of a transaction based on a transaction id (including its signatures,
     *     operations, and containing block number).
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_transaction('954f6de36e6715d128fa8eb5a053fc254b05ded0');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/transactions/954f6de36e6715d128fa8eb5a053fc254b05ded0'`
     */
    get: operations['hafah_endpoints.get_transaction']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/operations': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get operations for an account by recency.
     * @description List the operations in reversed order (first page is the oldest) for given account.
     *     The page size determines the number of operations per page.
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_ops_by_account('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/accounts/blocktrades/operations?page-size=3'`
     */
    get: operations['hafah_endpoints.get_ops_by_account']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/operation-types': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Lists all types of operations that account has performed
     * @description Lists all types of operations that the account has performed since its creation
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_acc_op_types('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/accounts/blocktrades/operations/types'`
     */
    get: operations['hafah_endpoints.get_acc_op_types']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market-history/trade-history': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Returns the trade history for the internal HBD:HIVE market.
     * @description SQL example
     *     * `SELECT * FROM hafah_endpoints.get_trade_history('2016-08-15 19:47:21', '2016-09-15 19:47:21',1000);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/market-history/trade-history?result-limit=100&from-block=2016-08-15 19:47:21&to-block==2016-09-15 19:47:21'`
     */
    get: operations['hafah_endpoints.get_trade_history']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market-history/recent-trades': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Returns the most recent trades for the internal HBD:HIVE market.
     * @description SQL example
     *     * `SELECT * FROM hafah_endpoints.get_recent_trades(1000);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/market-history/recent-trades?result-limit=1000'`
     */
    get: operations['hafah_endpoints.get_recent_trades']
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
     * hafah's version
     * @description Get hafah's last commit hash (hash is used for versioning).
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_version();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/version'`
     */
    get: operations['hafah_endpoints.get_version']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/headblock': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get last synced block in the HAF database.
     * @description Get last synced block in the HAF database
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_head_block_num();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/headblock'`
     */
    get: operations['hafah_endpoints.get_head_block_num']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sync-status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get hafah's sync status
     * @description Get the last block for which HAfAH data is available, as an object
     *     containing both the block number and its timestamp (UTC). This is the
     *     uniform HAF-app sync/health endpoint: the timestamp lets a consumer
     *     compute staleness with a single call (`age = now() - last_block_time`)
     *     without needing a separate head-block reference.
     *
     *     HAfAH serves account history directly from HAF's own tables and has no
     *     app-specific sync process, so its data freshness is HAF's freshness:
     *     this endpoint reports HAF's consistent (last irreversible) block. For
     *     HAfAH, "synced" means the HAF database itself is synced (its last
     *     irreversible block is recent).
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_sync_status();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/sync-status'`
     */
    get: operations['hafah_endpoints.get_sync_status']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/global-state': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Reports global state information at the given block.
     * @description Reports dgpo-style data for a given block.
     *
     *     SQL example
     *     * `SELECT * FROM hafah_endpoints.get_global_state(5000000);`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/hafah-api/global-state?block-num=5000000'`
     */
    get: operations['hafah_endpoints.get_global_state']
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
    'hafah_backend.op_types': {
      /** @description operation type id */
      op_type_id?: number
      /** @description operation type name */
      operation_name?: string
      /** @description true if operation is virtual */
      is_virtual?: boolean
    }
    /** @enum {string} */
    'hafah_backend.operation_group_types': 'virtual' | 'real' | 'all'
    'hafah_backend.block_range_type': {
      from?: number
      to?: number
    }
    'hafah_backend.operation_body': {
      type?: string
      value?: Record<string, never>
    }
    'hafah_backend.array_of_operations': components['schemas']['hafah_backend.operation_body'][]
    'hafah_backend.operation': {
      /** @description operation body */
      op?: components['schemas']['hafah_backend.operation_body']
      /** @description block containing the operation */
      block?: number
      /** @description hash of the transaction */
      trx_id?: string | null
      /** @description operation identifier that indicates its sequence number in transaction */
      op_pos?: number
      /** @description operation type identifier */
      op_type_id?: number
      /**
       * Format: date-time
       * @description creation date
       */
      timestamp?: string
      /** @description true if is a virtual operation */
      virtual_op?: boolean
      /** @description unique operation identifier with an encoded block number and operation type id */
      operation_id?: string
      /** @description transaction identifier that indicates its sequence number in block */
      trx_in_block?: number
    }
    'hafah_backend.operation_history': {
      /** @description Total number of operations */
      total_operations?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description List of operation results */
      operations_result?: components['schemas']['hafah_backend.operation'][]
    }
    'hafah_backend.account_operation_history': {
      /** @description Total number of operations */
      total_operations?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description Range of blocks that contains the returned pages */
      block_range?: components['schemas']['hafah_backend.block_range_type']
      /** @description List of operation results */
      operations_result?: components['schemas']['hafah_backend.operation'][]
    }
    'hafah_backend.operations_in_block_range': {
      /** @description Lower bound for the next block number */
      next_block_range_begin?: number
      /** @description Lower bound for the next operation id */
      next_operation_begin?: string
      /** @description List of operation results */
      ops?: components['schemas']['hafah_backend.operation'][]
    }
    /** @enum {string} */
    'hafah_backend.sort_direction': 'asc' | 'desc'
    'hafah_backend.extensions': {
      type?: string
      value?: string
    }[]
    'hafah_backend.block': {
      /** @description block number */
      block_num?: number
      /** @description block hash in a blockchain is a unique, fixed-length string generated  by applying a cryptographic hash function to a block's contents */
      hash?: string
      /** @description hash of a previous block */
      prev?: string
      /** @description account name of block's producer */
      producer_account?: string
      /** @description single hash representing the combined hashes of all transactions in a block */
      transaction_merkle_root?: string
      /** @description various additional data/parameters related to the subject at hand. Most often, there's nothing specific, but it's a mechanism for extending various functionalities where something might appear in the future. */
      extensions?: components['schemas']['hafah_backend.extensions']
      /** @description witness signature */
      witness_signature?: string
      /** @description it refers to the public key of the witness used for signing blocks and other witness operations */
      signing_key?: string
      /** @description the interest rate on HBD in savings, expressed in basis points (previously for each HBD), is one of the values determined by the witnesses */
      hbd_interest_rate?: number
      /** @description the balance of the "counterweight" for these VESTS (total_vesting_shares) in the form of HIVE  (the price of VESTS is derived from these two values). A portion of the inflation is added to the balance, ensuring that each block corresponds to more HIVE for the VESTS */
      total_vesting_fund_hive?: string
      /** @description the total amount of VEST present in the system */
      total_vesting_shares?: string
      /** @description deprecated after HF17 */
      total_reward_fund_hive?: string
      /** @description the total amount of HIVE, including the HIVE that would be generated from converting HBD to HIVE at the current price */
      virtual_supply?: string
      /** @description the total amount of HIVE present in the system */
      current_supply?: string
      /** @description the total amount of HBD present in the system, including what is in the treasury */
      current_hbd_supply?: string
      /** @description the dhf_interval_ledger is a temporary HBD balance. Each block allocates a portion of inflation for proposal payouts, but these payouts occur every hour. To avoid cluttering the history with small amounts each block,  the new funds are first accumulated in the dhf_interval_ledger. Then, every HIVE_PROPOSAL_MAINTENANCE_PERIOD, the accumulated funds are transferred to the treasury account (this operation generates the virtual operation dhf_funding_operation), from where they are subsequently paid out to the approved proposals */
      dhf_interval_ledger?: number
      /**
       * Format: date-time
       * @description the timestamp when the block was created
       */
      created_at?: string
    }
    'hafah_backend.block_header': {
      /** @description hash of a previous block */
      previous?: string
      /**
       * Format: date-time
       * @description the timestamp when the block was created
       */
      timestamp?: string
      /** @description account name of block's producer */
      witness?: string
      /** @description single hash representing the combined hashes of all transactions in a block */
      transaction_merkle_root?: string
      /** @description various additional data/parameters related to the subject at hand. Most often, there's nothing specific, but it's a mechanism for extending various functionalities where something might appear in the future. */
      extensions?: components['schemas']['hafah_backend.extensions']
    }
    'hafah_backend.transactions': {
      ref_block_num?: number
      ref_block_prefix?: number
      expiration?: string
      operations?: components['schemas']['hafah_backend.array_of_operations']
      extensions?: components['schemas']['hafah_backend.extensions']
      signatures?: string[]
    }
    'hafah_backend.block_range': {
      /** @description hash of a previous block */
      previous?: string
      /**
       * Format: date-time
       * @description the timestamp when the block was created
       */
      timestamp?: string
      /** @description account name of block's producer */
      witness?: string
      /** @description single hash representing the combined hashes of all transactions in a block */
      transaction_merkle_root?: string
      /** @description various additional data/parameters related to the subject at hand. Most often, there's nothing specific, but it's a mechanism for extending various functionalities where something might appear in the future. */
      extensions?: components['schemas']['hafah_backend.extensions']
      /** @description witness signature */
      witness_signature?: string
      /** @description transactions in the block */
      transactions?: components['schemas']['hafah_backend.transactions']
      /** @description block hash in a blockchain is a unique, fixed-length string generated  by applying a cryptographic hash function to a block's contents */
      block_id?: string
      /** @description it refers to the public key of the witness used for signing blocks and other witness operations */
      signing_key?: string
      transaction_ids?: string[]
    }
    'hafah_backend.transaction': {
      /** @description transactions in the block */
      transaction_json?: components['schemas']['hafah_backend.transactions']
      /** @description hash of the transaction */
      transaction_id?: string
      /** @description block number */
      block_num?: number
      /** @description transaction identifier that indicates its sequence number in block */
      transaction_num?: number
      /**
       * Format: date-time
       * @description the timestamp when the block was created
       */
      timestamp?: string
    }
    'hafah_backend.nai_object': {
      /** @description String representation of a NAI (Network Asset Identifier) */
      nai?: string
      /** @description Amount of the asset */
      amount?: string
      /** @description Precision of the asset */
      precision?: number
    }
    'hafah_backend.fill_order': {
      current_pays?: components['schemas']['hafah_backend.nai_object']
      /** Format: date-time */
      date?: string
      maker?: string
      open_pays?: components['schemas']['hafah_backend.nai_object']
      taker?: string
    }
    'hafah_backend.array_of_fill_order': components['schemas']['hafah_backend.fill_order'][]
    /** @enum {string} */
    'hafah_backend.participation_mode': 'include' | 'exclude' | 'all'
    'hafah_backend.array_of_block_range': components['schemas']['hafah_backend.block_range'][]
    'hafah_backend.array_of_op_types': components['schemas']['hafah_backend.op_types'][]
    'hafah_backend.version_type': {
      /** @description Application name */
      app_name?: string
      /** @description Last commit hash */
      commit?: string
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  'hafah_endpoints.get_block_range': {
    parameters: {
      query: {
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
        'from-block': string
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
        'to-block': string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns array of `hafah_backend.block_range` */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "witness": "smooth.witness",
           *         "block_id": "004c4b3fc6a8735b4ab5433d59f4526e4a042644",
           *         "previous": "004c4b3e03ea2eac2494790786bfb9e41a8669d9",
           *         "timestamp": "2016-09-15T19:47:18",
           *         "extensions": [],
           *         "signing_key": "STM5jtPaM5G2jemsqTY8xYgy3CVUgzygKn7vUVpFozr6nWcCJ8mDW",
           *         "transactions": [
           *           {
           *             "expiration": "2016-09-15T19:47:27",
           *             "extensions": [],
           *             "operations": [
           *               {
           *                 "type": "vote_operation",
           *                 "value": {
           *                   "voter": "rkpl",
           *                   "author": "thedevil",
           *                   "weight": -10000,
           *                   "permlink": "re-rkpl-how-to-make-a-good-picture-of-the-moon-my-guide-and-photos-20160915t193128824z"
           *                 }
           *               }
           *             ],
           *             "signatures": [
           *               "2046cca841a2c84caf416ccec47f4d894732236505c21964ca092a4bf83b755979402486e49f4f6c116fc7e8d8525df14592d2993365b54ac26cb4bc52d3611e50"
           *             ],
           *             "ref_block_num": 19245,
           *             "ref_block_prefix": 325640405
           *           },
           *           {
           *             "expiration": "2016-09-15T19:47:45",
           *             "extensions": [],
           *             "operations": [
           *               {
           *                 "type": "limit_order_cancel_operation",
           *                 "value": {
           *                   "owner": "cvk",
           *                   "orderid": 1473968539
           *                 }
           *               }
           *             ],
           *             "signatures": [
           *               "20388171dcf8401b9ca74a79991fa2aaeff26729a28c3acb5510663a930e51f15e180e712e0e7fd3a65b2082ea89583b5155239259fc37c9a0c2b0ec4aacfb6963"
           *             ],
           *             "ref_block_num": 19262,
           *             "ref_block_prefix": 2888755715
           *           },
           *           {
           *             "expiration": "2016-09-15T20:47:15",
           *             "extensions": [],
           *             "operations": [
           *               {
           *                 "type": "pow2_operation",
           *                 "value": {
           *                   "work": {
           *                     "type": "pow2",
           *                     "value": {
           *                       "input": {
           *                         "nonce": "12906882138532220661",
           *                         "prev_block": "004c4b3e03ea2eac2494790786bfb9e41a8669d9",
           *                         "worker_account": "rabbit-25"
           *                       },
           *                       "pow_summary": 3818441282
           *                     }
           *                   },
           *                   "props": {
           *                     "hbd_interest_rate": 1000,
           *                     "maximum_block_size": 131072,
           *                     "account_creation_fee": {
           *                       "nai": "@@000000021",
           *                       "amount": "10000",
           *                       "precision": 3
           *                     }
           *                   }
           *                 }
           *               }
           *             ],
           *             "signatures": [
           *               "200cecb32d535041c061ea00ec8092c4ab12bf1453035c52987beffb53099f4d5045b29946037b15f9cdde3cbbe0f6e72b8f2f42027cafbeeee54cb8e780f8b07f"
           *             ],
           *             "ref_block_num": 19262,
           *             "ref_block_prefix": 2888755715
           *           },
           *           {
           *             "expiration": "2016-09-15T19:47:45",
           *             "extensions": [],
           *             "operations": [
           *               {
           *                 "type": "limit_order_cancel_operation",
           *                 "value": {
           *                   "owner": "paco-steem",
           *                   "orderid": 1243424767
           *                 }
           *               }
           *             ],
           *             "signatures": [
           *               "1f7de4d1ea38b5ddb2de499242aacc92d3fff529a74264c568114a48bf4182e4e775bd757cd718cb31b92017279bc781d7282be48abf615aa856bf6828a53b7fe1"
           *             ],
           *             "ref_block_num": 19262,
           *             "ref_block_prefix": 2888755715
           *           }
           *         ],
           *         "transaction_ids": [
           *           "9f4639be729f8ca436ac5bd01b5684cbc126d44d",
           *           "8f2a70dbe09902473eac39ffbd8ff626cb49bb51",
           *           "a9596ee741bd4b4b7d3d8cadd15416bfe854209e",
           *           "b664e368d117e0b0d4b1b32325a18044f47b5ca5"
           *         ],
           *         "witness_signature": "1f4a3e6e868c4b729790e64b0656cf12996f35010dd07b535a502b019080c849c75f370642b00e302d003def5e6b2280246b08ee8ab37824af4664ab740a79b940",
           *         "transaction_merkle_root": "708e4d6a2a722ef7fecc58d1f177a2826e54edd3"
           *       },
           *       {
           *         "witness": "ihashfury",
           *         "block_id": "004c4b40245ffb07380a393fb2b3d841b76cdaec",
           *         "previous": "004c4b3fc6a8735b4ab5433d59f4526e4a042644",
           *         "timestamp": "2016-09-15T19:47:21",
           *         "extensions": [],
           *         "signing_key": "STM8aUs6SGoEmNYMd3bYjE1UBr6NQPxGWmTqTdBaxJYSx244edSB2",
           *         "transactions": [
           *           {
           *             "expiration": "2016-09-15T19:47:33",
           *             "extensions": [],
           *             "operations": [
           *               {
           *                 "type": "account_create_operation",
           *                 "value": {
           *                   "fee": {
           *                     "nai": "@@000000021",
           *                     "amount": "10000",
           *                     "precision": 3
           *                   },
           *                   "owner": {
           *                     "key_auths": [
           *                       [
           *                         "STM871wj5KKnbwwiRv3scVcxQ26ynPnE1uaZr6dPpqVu9F4zJZgjZ",
           *                         1
           *                       ]
           *                     ],
           *                     "account_auths": [],
           *                     "weight_threshold": 1
           *                   },
           *                   "active": {
           *                     "key_auths": [
           *                       [
           *                         "STM73bAnWEwkdUa7Lp4ovNzyu4soHUCaCNSz79YHQsDqscNdSe1E8",
           *                         1
           *                       ]
           *                     ],
           *                     "account_auths": [],
           *                     "weight_threshold": 1
           *                   },
           *                   "creator": "steem",
           *                   "posting": {
           *                     "key_auths": [
           *                       [
           *                         "STM7fXKrnQN3xhgFTQBFMgR9TU8CxfgAJrLvSDjGuM2bFkiuKfwZg",
           *                         1
           *                       ]
           *                     ],
           *                     "account_auths": [],
           *                     "weight_threshold": 1
           *                   },
           *                   "memo_key": "STM8i93Zznxu2QRNLCHBDXt5yyiMW1c3GEyVKV9XAs8H5wEWwdJaM",
           *                   "json_metadata": "",
           *                   "new_account_name": "kefadex"
           *                 }
           *               }
           *             ],
           *             "signatures": [
           *               "1f63c75cc966916ea705a6fdef0821a810bdabb07118a3721f4cd52c972b9e4522534248c45ac908c1498752165a1d937eaf55ab6c028d7ee0ad893d3d4330d066"
           *             ],
           *             "ref_block_num": 19263,
           *             "ref_block_prefix": 1534306502
           *           },
           *           {
           *             "expiration": "2016-09-15T19:47:48",
           *             "extensions": [],
           *             "operations": [
           *               {
           *                 "type": "limit_order_create_operation",
           *                 "value": {
           *                   "owner": "cvk",
           *                   "orderid": 1473968838,
           *                   "expiration": "2035-10-29T06:32:22",
           *                   "fill_or_kill": false,
           *                   "amount_to_sell": {
           *                     "nai": "@@000000021",
           *                     "amount": "10324",
           *                     "precision": 3
           *                   },
           *                   "min_to_receive": {
           *                     "nai": "@@000000013",
           *                     "amount": "6819",
           *                     "precision": 3
           *                   }
           *                 }
           *               }
           *             ],
           *             "signatures": [
           *               "203e8ef6d16005180dc06756462bd867513a929bc4fa7c45f24ca2b0763cafdb06678812d777216f46d205e68a740dd19e32a1aa1a1df022500c0f1ef97800d0e0"
           *             ],
           *             "ref_block_num": 19263,
           *             "ref_block_prefix": 1534306502
           *           }
           *         ],
           *         "transaction_ids": [
           *           "6707feb450da66dc223ab5cb3e259937b2fef6bf",
           *           "973290d26bac31335c000c7a3d3fe058ce3dbb9f"
           *         ],
           *         "witness_signature": "1f6aa1c6311c768b5225b115eaf5798e5f1d8338af3970d90899cd5ccbe38f6d1f7676c5649bcca18150cbf8f07c0cc7ec3ae40d5936cfc6d5a650e582ba0f8002",
           *         "transaction_merkle_root": "97a8f2b04848b860f1792dc07bf58efcb15aeb8c"
           *       }
           *     ]
           */
          'application/json': components['schemas']['hafah_backend.array_of_block_range']
        }
      }
    }
  }
  'hafah_endpoints.get_block': {
    parameters: {
      query?: {
        /** @description If true, virtual operations will be included. */
        'include-virtual'?: boolean
      }
      header?: never
      path: {
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
        'block-num': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns `hafah_backend.block_range` */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "witness": "ihashfury",
           *       "block_id": "004c4b40245ffb07380a393fb2b3d841b76cdaec",
           *       "previous": "004c4b3fc6a8735b4ab5433d59f4526e4a042644",
           *       "timestamp": "2016-09-15T19:47:21",
           *       "extensions": [],
           *       "signing_key": "STM8aUs6SGoEmNYMd3bYjE1UBr6NQPxGWmTqTdBaxJYSx244edSB2",
           *       "transactions": [
           *         {
           *           "expiration": "2016-09-15T19:47:33",
           *           "extensions": [],
           *           "operations": [
           *             {
           *               "type": "account_create_operation",
           *               "value": {
           *                 "fee": {
           *                   "nai": "@@000000021",
           *                   "amount": "10000",
           *                   "precision": 3
           *                 },
           *                 "owner": {
           *                   "key_auths": [
           *                     [
           *                       "STM871wj5KKnbwwiRv3scVcxQ26ynPnE1uaZr6dPpqVu9F4zJZgjZ",
           *                       1
           *                     ]
           *                   ],
           *                   "account_auths": [],
           *                   "weight_threshold": 1
           *                 },
           *                 "active": {
           *                   "key_auths": [
           *                     [
           *                       "STM73bAnWEwkdUa7Lp4ovNzyu4soHUCaCNSz79YHQsDqscNdSe1E8",
           *                       1
           *                     ]
           *                   ],
           *                   "account_auths": [],
           *                   "weight_threshold": 1
           *                 },
           *                 "creator": "steem",
           *                 "posting": {
           *                   "key_auths": [
           *                     [
           *                       "STM7fXKrnQN3xhgFTQBFMgR9TU8CxfgAJrLvSDjGuM2bFkiuKfwZg",
           *                       1
           *                     ]
           *                   ],
           *                   "account_auths": [],
           *                   "weight_threshold": 1
           *                 },
           *                 "memo_key": "STM8i93Zznxu2QRNLCHBDXt5yyiMW1c3GEyVKV9XAs8H5wEWwdJaM",
           *                 "json_metadata": "",
           *                 "new_account_name": "kefadex"
           *               }
           *             }
           *           ],
           *           "signatures": [
           *             "1f63c75cc966916ea705a6fdef0821a810bdabb07118a3721f4cd52c972b9e4522534248c45ac908c1498752165a1d937eaf55ab6c028d7ee0ad893d3d4330d066"
           *           ],
           *           "ref_block_num": 19263,
           *           "ref_block_prefix": 1534306502
           *         },
           *         {
           *           "expiration": "2016-09-15T19:47:48",
           *           "extensions": [],
           *           "operations": [
           *             {
           *               "type": "limit_order_create_operation",
           *               "value": {
           *                 "owner": "cvk",
           *                 "orderid": 1473968838,
           *                 "expiration": "2035-10-29T06:32:22",
           *                 "fill_or_kill": false,
           *                 "amount_to_sell": {
           *                   "nai": "@@000000021",
           *                   "amount": "10324",
           *                   "precision": 3
           *                 },
           *                 "min_to_receive": {
           *                   "nai": "@@000000013",
           *                   "amount": "6819",
           *                   "precision": 3
           *                 }
           *               }
           *             }
           *           ],
           *           "signatures": [
           *             "203e8ef6d16005180dc06756462bd867513a929bc4fa7c45f24ca2b0763cafdb06678812d777216f46d205e68a740dd19e32a1aa1a1df022500c0f1ef97800d0e0"
           *           ],
           *           "ref_block_num": 19263,
           *           "ref_block_prefix": 1534306502
           *         }
           *       ],
           *       "transaction_ids": [
           *         "6707feb450da66dc223ab5cb3e259937b2fef6bf",
           *         "973290d26bac31335c000c7a3d3fe058ce3dbb9f"
           *       ],
           *       "witness_signature": "1f6aa1c6311c768b5225b115eaf5798e5f1d8338af3970d90899cd5ccbe38f6d1f7676c5649bcca18150cbf8f07c0cc7ec3ae40d5936cfc6d5a650e582ba0f8002",
           *       "transaction_merkle_root": "97a8f2b04848b860f1792dc07bf58efcb15aeb8c"
           *     }
           */
          'application/json': components['schemas']['hafah_backend.block_range']
        }
      }
    }
  }
  'hafah_endpoints.get_block_header': {
    parameters: {
      query?: never
      header?: never
      path: {
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
        'block-num': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns `hafah_backend.block_header` */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "witness": "ihashfury",
           *       "previous": "004c4b3fc6a8735b4ab5433d59f4526e4a042644",
           *       "timestamp": "2016-09-15T19:47:21",
           *       "extensions": [],
           *       "transaction_merkle_root": "97a8f2b04848b860f1792dc07bf58efcb15aeb8c"
           *     }
           */
          'application/json': components['schemas']['hafah_backend.block_header']
        }
      }
    }
  }
  'hafah_endpoints.get_ops_by_block_paging': {
    parameters: {
      query?: {
        /**
         * @description List of operations: if the parameter is empty, all operations will be included,
         *     example: `18,12`
         */
        'operation-types'?: string
        /** @description Filter operations by the account that created them */
        'account-name'?: string
        /** @description Return page on `page` number, defaults to `1` */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100` */
        'page-size'?: number
        /**
         * @description page order:
         *
         *      * `asc` - Ascending, from oldest to newest page
         *
         *      * `desc` - Descending, from newest to oldest page
         */
        'page-order'?: components['schemas']['hafah_backend.sort_direction']
        /**
         * @description If the operation length exceeds the data size limit,
         *     the operation body is replaced with a placeholder, defaults to `200000`
         */
        'data-size-limit'?: number
        /**
         * @description A parameter specifying the expected value in operation body,
         *     example: `value.creator=steem`
         */
        'path-filter'?: string[]
      }
      header?: never
      path: {
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
        'block-num': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Result contains total operations number,
       *     total pages and the list of operations
       *
       *     * Returns `hafah_backend.operation_history`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_operations": 1,
           *       "total_pages": 1,
           *       "operations_result": [
           *         {
           *           "op": {
           *             "type": "account_created_operation",
           *             "value": {
           *               "creator": "steem",
           *               "new_account_name": "kefadex",
           *               "initial_delegation": {
           *                 "nai": "@@000000037",
           *                 "amount": "0",
           *                 "precision": 6
           *               },
           *               "initial_vesting_shares": {
           *                 "nai": "@@000000037",
           *                 "amount": "30038455132",
           *                 "precision": 6
           *               }
           *             }
           *           },
           *           "block": 5000000,
           *           "trx_id": "6707feb450da66dc223ab5cb3e259937b2fef6bf",
           *           "op_pos": 1,
           *           "op_type_id": 80,
           *           "timestamp": "2016-09-15T19:47:21",
           *           "virtual_op": true,
           *           "operation_id": "21474836480000336",
           *           "trx_in_block": 0
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafah_backend.operation_history']
        }
      }
      /** @description The result is empty */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafah_endpoints.get_operations': {
    parameters: {
      query: {
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
        'from-block': string
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
        'to-block': string
        /**
         * @description List of operations: if the parameter is empty, all operations will be included.
         *     example: `18,12`
         */
        'operation-types'?: string
        /**
         * @description filter operations by:
         *
         *      * `virtual` - only virtual operations
         *
         *      * `real` - only real operations
         *
         *      * `all` - all operations
         */
        'operation-group-type'?: components['schemas']['hafah_backend.operation_group_types']
        /** @description Starting operation id */
        'operation-begin'?: string
        /**
         * @description A limit of retrieved operations per page,
         *     up to 150000
         */
        'page-size'?: number
        /** @description If true, operations from reversible blocks will be included. */
        'include-reversible'?: boolean
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns `hafah_backend.operations_in_block_range` */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "ops": [
           *         {
           *           "op": {
           *             "type": "effective_comment_vote_operation",
           *             "value": {
           *               "voter": "rkpl",
           *               "author": "thedevil",
           *               "weight": 0,
           *               "rshares": -1383373254,
           *               "permlink": "re-rkpl-how-to-make-a-good-picture-of-the-moon-my-guide-and-photos-20160915t193128824z",
           *               "pending_payout": {
           *                 "nai": "@@000000013",
           *                 "amount": "0",
           *                 "precision": 3
           *               },
           *               "total_vote_weight": 590910411298246
           *             }
           *           },
           *           "block": 4999999,
           *           "trx_id": "9f4639be729f8ca436ac5bd01b5684cbc126d44d",
           *           "op_in_trx": 1,
           *           "timestamp": "2016-09-15T19:47:18",
           *           "virtual_op": true,
           *           "operation_id": "21474832185033032",
           *           "trx_in_block": 0
           *         },
           *         {
           *           "op": {
           *             "type": "limit_order_cancelled_operation",
           *             "value": {
           *               "seller": "cvk",
           *               "orderid": 1473968539,
           *               "amount_back": {
           *                 "nai": "@@000000021",
           *                 "amount": "9941",
           *                 "precision": 3
           *               }
           *             }
           *           },
           *           "block": 4999999,
           *           "trx_id": "8f2a70dbe09902473eac39ffbd8ff626cb49bb51",
           *           "op_in_trx": 1,
           *           "timestamp": "2016-09-15T19:47:18",
           *           "virtual_op": true,
           *           "operation_id": "21474832185033557",
           *           "trx_in_block": 1
           *         },
           *         {
           *           "op": {
           *             "type": "pow_reward_operation",
           *             "value": {
           *               "reward": {
           *                 "nai": "@@000000037",
           *                 "amount": "5031442145",
           *                 "precision": 6
           *               },
           *               "worker": "smooth.witness"
           *             }
           *           },
           *           "block": 4999999,
           *           "trx_id": "a9596ee741bd4b4b7d3d8cadd15416bfe854209e",
           *           "op_in_trx": 1,
           *           "timestamp": "2016-09-15T19:47:18",
           *           "virtual_op": true,
           *           "operation_id": "21474832185034062",
           *           "trx_in_block": 2
           *         },
           *         {
           *           "op": {
           *             "type": "limit_order_cancelled_operation",
           *             "value": {
           *               "seller": "paco-steem",
           *               "orderid": 1243424767,
           *               "amount_back": {
           *                 "nai": "@@000000013",
           *                 "amount": "19276",
           *                 "precision": 3
           *               }
           *             }
           *           },
           *           "block": 4999999,
           *           "trx_id": "b664e368d117e0b0d4b1b32325a18044f47b5ca5",
           *           "op_in_trx": 1,
           *           "timestamp": "2016-09-15T19:47:18",
           *           "virtual_op": true,
           *           "operation_id": "21474832185034581",
           *           "trx_in_block": 3
           *         },
           *         {
           *           "op": {
           *             "type": "producer_reward_operation",
           *             "value": {
           *               "producer": "smooth.witness",
           *               "vesting_shares": {
           *                 "nai": "@@000000037",
           *                 "amount": "3003846056",
           *                 "precision": 6
           *               }
           *             }
           *           },
           *           "block": 4999999,
           *           "trx_id": "0000000000000000000000000000000000000000",
           *           "op_in_trx": 1,
           *           "timestamp": "2016-09-15T19:47:18",
           *           "virtual_op": true,
           *           "operation_id": "21474832185034816",
           *           "trx_in_block": 4294967295
           *         },
           *         {
           *           "op": {
           *             "type": "account_created_operation",
           *             "value": {
           *               "creator": "steem",
           *               "new_account_name": "kefadex",
           *               "initial_delegation": {
           *                 "nai": "@@000000037",
           *                 "amount": "0",
           *                 "precision": 6
           *               },
           *               "initial_vesting_shares": {
           *                 "nai": "@@000000037",
           *                 "amount": "30038455132",
           *                 "precision": 6
           *               }
           *             }
           *           },
           *           "block": 5000000,
           *           "trx_id": "6707feb450da66dc223ab5cb3e259937b2fef6bf",
           *           "op_in_trx": 1,
           *           "timestamp": "2016-09-15T19:47:21",
           *           "virtual_op": true,
           *           "operation_id": "21474836480000336",
           *           "trx_in_block": 0
           *         },
           *         {
           *           "op": {
           *             "type": "producer_reward_operation",
           *             "value": {
           *               "producer": "ihashfury",
           *               "vesting_shares": {
           *                 "nai": "@@000000037",
           *                 "amount": "3003845513",
           *                 "precision": 6
           *               }
           *             }
           *           },
           *           "block": 5000000,
           *           "trx_id": "0000000000000000000000000000000000000000",
           *           "op_in_trx": 1,
           *           "timestamp": "2016-09-15T19:47:21",
           *           "virtual_op": true,
           *           "operation_id": "21474836480000832",
           *           "trx_in_block": 4294967295
           *         }
           *       ],
           *       "next_operation_begin": 0,
           *       "next_block_range_begin": 5000000
           *     }
           */
          'application/json': components['schemas']['hafah_backend.operations_in_block_range']
        }
      }
    }
  }
  'hafah_endpoints.get_operation': {
    parameters: {
      query?: never
      header?: never
      path: {
        /**
         * @description An operation-id is a unique operation identifier,
         *     encodes three key pieces of information into a single number,
         *     with each piece occupying a specific number of bits:
         *
         *     ```
         *     msb.....................lsb
         *      || block | op_pos | type ||
         *      ||  32b  |  24b   |  8b  ||
         *     ```
         *
         *      * block (block number) - occupies 32 bits.
         *
         *      * op_pos (position of an operation in block) - occupies 24 bits.
         *
         *      * type (operation type) - occupies 8 bits.
         */
        'operation-id': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Operation parameters
       *
       *     * Returns `hafah_backend.operation`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "op": {
           *         "type": "producer_reward_operation",
           *         "value": {
           *           "producer": "initminer",
           *           "vesting_shares": {
           *             "nai": "@@000000021",
           *             "amount": "1000",
           *             "precision": 3
           *           }
           *         }
           *       },
           *       "block": 803,
           *       "trx_id": null,
           *       "op_pos": 1,
           *       "op_type_id": 64,
           *       "timestamp": "2016-03-24T16:45:39",
           *       "virtual_op": true,
           *       "operation_id": "3448858738752",
           *       "trx_in_block": -1
           *     }
           */
          'application/json': components['schemas']['hafah_backend.operation']
        }
      }
    }
  }
  'hafah_endpoints.get_op_types': {
    parameters: {
      query?: {
        /** @description parial name of operation */
        'partial-operation-name'?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Operation type list,
       *     if `partial-operation-name` is provided then the list
       *     is limited to operations that partially match the `partial-operation-name`
       *
       *     * Returns array of `hafah_backend.op_types`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "op_type_id": 51,
           *         "operation_name": "author_reward_operation",
           *         "is_virtual": true
           *       }
           *     ]
           */
          'application/json': components['schemas']['hafah_backend.array_of_op_types']
        }
      }
      /** @description No operations in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafah_endpoints.get_operation_keys': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Unique operation type identifier */
        'type-id': number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Operation json key paths
       *
       *     * Returns `JSON`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       [
           *         "value",
           *         "body"
           *       ],
           *       [
           *         "value",
           *         "title"
           *       ],
           *       [
           *         "value",
           *         "author"
           *       ],
           *       [
           *         "value",
           *         "permlink"
           *       ],
           *       [
           *         "value",
           *         "json_metadata"
           *       ],
           *       [
           *         "value",
           *         "parent_author"
           *       ],
           *       [
           *         "value",
           *         "parent_permlink"
           *       ]
           *     ]
           */
          'application/json': string[][]
        }
      }
    }
  }
  'hafah_endpoints.get_transaction': {
    parameters: {
      query?: {
        /** @description If true, virtual operations will be included. */
        'include-virtual'?: boolean
      }
      header?: never
      path: {
        /** @description transaction id of transaction to look up */
        'transaction-id': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description The transaction body
       *
       *     * Returns `hafah_backend.transaction`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "transaction_json": {
           *         "ref_block_num": 25532,
           *         "ref_block_prefix": 3338687976,
           *         "extensions": [],
           *         "expiration": "2016-08-12T17:23:48",
           *         "operations": [
           *           {
           *             "type": "custom_json_operation",
           *             "value": {
           *               "id": "follow",
           *               "json": "{\"follower\":\"breck0882\",\"following\":\"steemship\",\"what\":[]}",
           *               "required_auths": [],
           *               "required_posting_auths": [
           *                 "breck0882"
           *               ]
           *             }
           *           }
           *         ],
           *         "signatures": [
           *           "201655190aac43bb272185c577262796c57e5dd654e3e491b9b32bd2d567c6d5de75185f221a38697d04d1a8e6a9deb722ec6d6b5d2f395dcfbb94f0e5898e858f"
           *         ]
           *       },
           *       "transaction_id": "954f6de36e6715d128fa8eb5a053fc254b05ded0",
           *       "block_num": 4023233,
           *       "transaction_num": 0,
           *       "timestamp": "2016-08-12T17:23:39"
           *     }
           */
          'application/json': components['schemas']['hafah_backend.transaction']
        }
      }
    }
  }
  'hafah_endpoints.get_ops_by_account': {
    parameters: {
      query?: {
        /** @description Account to filter operations by, if provided only operations where the account is an author will be returned. */
        'transacting-account-name'?: string
        /**
         * @description filter operations by:
         *
         *      * `include` - List only operations where transacting_account_id was the author.
         *
         *      * `exclude` - List only operations where transacting_account_id was not the author.
         *
         *      * `all` -  No filtering, transacting_account_id must be NULL.
         */
        'participation-mode'?: components['schemas']['hafah_backend.participation_mode']
        /**
         * @description List of operation types to get. If NULL, gets all operation types.
         *     example: `18,12`
         */
        'operation-types'?: string
        /**
         * @description Return page on `page` number, default null due to reversed order of pages,
         *     the first page is the oldest,
         *     example: first call returns the newest page and total_pages is 100 - the newest page is number 100, next 99 etc.
         */
        page?: number
        /** @description Return max `page-size` operations per page, defaults to `100`. */
        'page-size'?: number
        /**
         * @description If the operation length exceeds the data size limit,
         *     the operation body is replaced with a placeholder (defaults to `200000`).
         */
        'data-size-limit'?: number
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
        /** @description Account to get operations for. */
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
       *     * Returns `hafah_backend.account_operation_history`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "total_operations": 219867,
           *       "total_pages": 73289,
           *       "block_range": {
           *         "from": 1,
           *         "to": 5000000
           *       },
           *       "operations_result": [
           *         {
           *           "op": {
           *             "type": "transfer_operation",
           *             "value": {
           *               "to": "blocktrades",
           *               "from": "mrwang",
           *               "memo": "a79c09cd-0084-4cd4-ae63-bf6d2514fef9",
           *               "amount": {
           *                 "nai": "@@000000013",
           *                 "amount": "1633",
           *                 "precision": 3
           *               }
           *             }
           *           },
           *           "block": 4999997,
           *           "trx_id": "e75f833ceb62570c25504b55d0f23d86d9d76423",
           *           "op_pos": 0,
           *           "op_type_id": 2,
           *           "timestamp": "2016-09-15T19:47:12",
           *           "virtual_op": false,
           *           "operation_id": "21474823595099394",
           *           "trx_in_block": 3
           *         },
           *         {
           *           "op": {
           *             "type": "producer_reward_operation",
           *             "value": {
           *               "producer": "blocktrades",
           *               "vesting_shares": {
           *                 "nai": "@@000000037",
           *                 "amount": "3003850165",
           *                 "precision": 6
           *               }
           *             }
           *           },
           *           "block": 4999992,
           *           "trx_id": null,
           *           "op_pos": 1,
           *           "op_type_id": 64,
           *           "timestamp": "2016-09-15T19:46:57",
           *           "virtual_op": true,
           *           "operation_id": "21474802120262208",
           *           "trx_in_block": -1
           *         },
           *         {
           *           "op": {
           *             "type": "producer_reward_operation",
           *             "value": {
           *               "producer": "blocktrades",
           *               "vesting_shares": {
           *                 "nai": "@@000000037",
           *                 "amount": "3003868105",
           *                 "precision": 6
           *               }
           *             }
           *           },
           *           "block": 4999959,
           *           "trx_id": null,
           *           "op_pos": 1,
           *           "op_type_id": 64,
           *           "timestamp": "2016-09-15T19:45:12",
           *           "virtual_op": true,
           *           "operation_id": "21474660386343488",
           *           "trx_in_block": -1
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hafah_backend.account_operation_history']
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
  'hafah_endpoints.get_acc_op_types': {
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
       * @description Operation type list
       *
       *     * Returns array of `INT`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       0,
           *       1,
           *       2,
           *       3,
           *       4,
           *       5,
           *       6,
           *       7,
           *       10,
           *       11,
           *       12,
           *       13,
           *       14,
           *       15,
           *       18,
           *       20,
           *       51,
           *       52,
           *       53,
           *       55,
           *       56,
           *       57,
           *       61,
           *       64,
           *       72,
           *       77,
           *       78,
           *       79,
           *       80,
           *       85,
           *       86
           *     ]
           */
          'application/json': number[]
        }
      }
    }
  }
  'hafah_endpoints.get_trade_history': {
    parameters: {
      query: {
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
        'from-block': string
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
        'to-block': string
        /** @description A limit of retrieved orders */
        'result-limit': number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns `hafah_backend.array_of_fill_order` */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "current_pays": {
           *           "amount": "1000",
           *           "nai": "@@000000013",
           *           "precision": 3
           *         },
           *         "date": "2025-04-26T11:45:57",
           *         "maker": "quicktrades",
           *         "open_pays": {
           *           "amount": "3871",
           *           "nai": "@@000000021",
           *           "precision": 3
           *         },
           *         "taker": "elon.curator"
           *       },
           *       {
           *         "current_pays": {
           *           "amount": "1939",
           *           "nai": "@@000000021",
           *           "precision": 3
           *         },
           *         "date": "2025-05-26T11:45:30",
           *         "maker": "quicktrades",
           *         "open_pays": {
           *           "amount": "500",
           *           "nai": "@@000000013",
           *           "precision": 3
           *         },
           *         "taker": "cst90"
           *       }
           *     ]
           */
          'application/json': components['schemas']['hafah_backend.array_of_fill_order']
        }
      }
    }
  }
  'hafah_endpoints.get_recent_trades': {
    parameters: {
      query: {
        /** @description A limit of retrieved orders */
        'result-limit': number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns `hafah_backend.array_of_fill_order` */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "current_pays": {
           *           "amount": "1000",
           *           "nai": "@@000000013",
           *           "precision": 3
           *         },
           *         "date": "2025-05-26T11:45:57",
           *         "maker": "quicktrades",
           *         "open_pays": {
           *           "amount": "3871",
           *           "nai": "@@000000021",
           *           "precision": 3
           *         },
           *         "taker": "elon.curator"
           *       },
           *       {
           *         "current_pays": {
           *           "amount": "1939",
           *           "nai": "@@000000021",
           *           "precision": 3
           *         },
           *         "date": "2025-05-26T11:45:30",
           *         "maker": "quicktrades",
           *         "open_pays": {
           *           "amount": "500",
           *           "nai": "@@000000013",
           *           "precision": 3
           *         },
           *         "taker": "cst90"
           *       }
           *     ]
           */
          'application/json': components['schemas']['hafah_backend.array_of_fill_order']
        }
      }
    }
  }
  'hafah_endpoints.get_version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns `hafah_backend.version_type` */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "app_name": "PostgRESTHAfAH",
           *       "commit": "136fe35c62cdc0fd7d6ff41cf6c946cadc2a4cd5"
           *     }
           */
          'application/json': components['schemas']['hafah_backend.version_type']
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
  'hafah_endpoints.get_head_block_num': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last block stored in HAF
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
      /** @description No blocks in the database */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hafah_endpoints.get_sync_status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description HAF's consistent (last irreversible) block and its timestamp.
       *     `last_block_time` is null if HAF has no consistent block yet.
       *     While the HAF instance is still in massive sync (indexes not yet
       *     built) the call fails fast with an error rather than executing an
       *     unindexed lookup.
       *
       *     * Returns `JSON`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "last_block_num": 5000000,
           *       "last_block_time": "2016-09-15T19:47:21"
           *     }
           */
          'application/json': {
            /** @description HAF's consistent (last irreversible) block number */
            last_block_num?: number
            /**
             * Format: date-time
             * @description UTC timestamp of that block
             */
            last_block_time?: string
          }
        }
      }
    }
  }
  'hafah_endpoints.get_global_state': {
    parameters: {
      query: {
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
        'block-num': string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Given block's stats
       *
       *     * Returns `hafah_backend.block`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "block_num": 5000000,
           *       "hash": "004c4b40245ffb07380a393fb2b3d841b76cdaec",
           *       "prev": "004c4b3fc6a8735b4ab5433d59f4526e4a042644",
           *       "producer_account": "ihashfury",
           *       "transaction_merkle_root": "97a8f2b04848b860f1792dc07bf58efcb15aeb8c",
           *       "extensions": [],
           *       "witness_signature": "1f6aa1c6311c768b5225b115eaf5798e5f1d8338af3970d90899cd5ccbe38f6d1f7676c5649bcca18150cbf8f07c0cc7ec3ae40d5936cfc6d5a650e582ba0f8002",
           *       "signing_key": "STM8aUs6SGoEmNYMd3bYjE1UBr6NQPxGWmTqTdBaxJYSx244edSB2",
           *       "hbd_interest_rate": 1000,
           *       "total_vesting_fund_hive": "149190428013",
           *       "total_vesting_shares": "448144916705468350",
           *       "total_reward_fund_hive": "66003975",
           *       "virtual_supply": "161253662237",
           *       "current_supply": "157464400971",
           *       "current_hbd_supply": "2413759427",
           *       "dhf_interval_ledger": 0,
           *       "created_at": "2016-09-15T19:47:21"
           *     }
           */
          'application/json': components['schemas']['hafah_backend.block']
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
