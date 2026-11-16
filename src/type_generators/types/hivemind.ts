export interface paths {
  '/accounts/{account-name}/operations': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get operations for an account by recency.
     * @description List the non-virtual operations in reversed order (first page is the oldest) for given account.
     *     The page size determines the number of operations per page.
     *
     *     SQL example
     *     * `SELECT * FROM hivemind_endpoints.get_ops_by_account('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://{hivemind-host}/hivemind-api/accounts/blocktrades/operations?page-size=3'`
     */
    get: operations['hivemind_endpoints.get_ops_by_account']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/pending-author-rewards': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get pending (pre-payout) author rewards for an account.
     * @description Returns the aggregated pending author and beneficiary rewards across all
     *     of the account's posts that have not yet reached payout (i.e. `is_paidout = false`
     *     and not deleted). For each unpaid post the gross pending payout is capped by
     *     `max_accepted_payout` and is split between the author and the beneficiaries.
     *     Posts that declined payout (`is_declined = true`) contribute zero.
     *     The response intentionally does not expose final HBD/HIVE/VESTS payout
     *     assets. Hivemind does not have exact HBD print-rate and reward-vesting
     *     state, so the endpoint returns only HBD-denominated reward basis values
     *     split into liquid, vesting, and direct buckets.
     *
     *     SQL example
     *     * `SELECT * FROM hivemind_endpoints.get_account_pending_author_rewards('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://{hivemind-host}/hivemind-api/accounts/blocktrades/pending-author-rewards'`
     */
    get: operations['hivemind_endpoints.get_account_pending_author_rewards']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{account-name}/pending-curation-rewards': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get pending (pre-payout) curation rewards for an account.
     * @description Returns the aggregated curation reward basis for the account, summed
     *     across all of the account's votes on posts that have not yet reached payout.
     *     Only votes cast within the last eight chain-days (relative to the head block)
     *     are considered, matching the chain's curation reward window. Posts that
     *     declined payout or disabled curation rewards contribute zero.
     *     Curation rewards resolve to HP/VESTS outside Hivemind. This endpoint returns
     *     only the HBD-denominated reward basis, not final VESTS/HBD/HIVE payout assets.
     *
     *     SQL example
     *     * `SELECT * FROM hivemind_endpoints.get_account_pending_curation_rewards('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://{hivemind-host}/hivemind-api/accounts/blocktrades/pending-curation-rewards'`
     */
    get: operations['hivemind_endpoints.get_account_pending_curation_rewards']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/blog/reblogs': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get reblog status for ranked posts
     * @description Returns reblog status for posts matching the same criteria as bridge.get_ranked_posts.
     *     This is a lightweight endpoint that only returns post identifiers and whether the observer has reblogged each post.
     *
     *     SQL example
     *     * `SELECT * FROM hivemind_endpoints.get_reblogs('trending', '', 'alice', 20);`
     *
     *     REST call example
     *     * `GET 'https://{hivemind-host}/hivemind-api/blog/reblogs?sort=trending&observer=alice&limit=20'`
     */
    get: operations['hivemind_endpoints.get_reblogs']
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
     * Get hivemind's sync status
     * @description Get the last block processed by hivemind as an object containing both
     *     the block number and its timestamp (UTC). This is the uniform HAF-app
     *     sync/health endpoint: the timestamp lets a consumer compute staleness
     *     with a single call (`age = now() - last_block_time`) without needing a
     *     separate head-block reference.
     *     `last_block_time` is null if no block has been processed yet.
     *     While the HAF instance is still in massive sync (indexes not yet
     *     built) the call fails fast with an error rather than executing an
     *     unindexed lookup.
     *
     *     SQL example
     *     * `SELECT hivemind_endpoints.get_sync_status();`
     *
     *     REST call example
     *     * `GET 'https://{hivemind-host}/hivemind-api/sync-status'`
     */
    get: operations['hivemind_endpoints.get_sync_status']
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
    'hivemind_endpoints.block_range_type': {
      from?: number
      to?: number
    }
    'hivemind_endpoints.operation_body': {
      type?: string
      value?: Record<string, never>
    }
    'hivemind_endpoints.array_of_operations': components['schemas']['hivemind_endpoints.operation_body'][]
    'hivemind_endpoints.operation': {
      /** @description operation body */
      op?: components['schemas']['hivemind_endpoints.operation_body']
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
    'hivemind_endpoints.operation_history': {
      /** @description Total number of operations */
      total_operations?: number
      /** @description Total number of pages */
      total_pages?: number
      /** @description Range of blocks that contains the returned pages */
      block_range?: components['schemas']['hivemind_endpoints.block_range_type']
      /** @description List of operation results */
      operations_result?: components['schemas']['hivemind_endpoints.operation'][]
    }
    'hivemind_endpoints.reblog_status': {
      /** @description Post author account name */
      author?: string
      /** @description Post permlink */
      permlink?: string
      /** @description True if the observer has reblogged this post */
      reblogged?: boolean
    }
    'hivemind_endpoints.array_of_reblog_status': components['schemas']['hivemind_endpoints.reblog_status'][]
    'hivemind_endpoints.asset': {
      /** @description Asset amount in raw integer units (multiply by 10^-precision to get the decimal amount) */
      amount?: string
      /** @description Decimal precision for the NAI asset */
      precision?: number
      /** @description Numeric Asset Identifier */
      nai?: string
    }
    'hivemind_endpoints.pending_reward_basis': {
      /** @description HBD-denominated reward basis routed to liquid payout; final HBD/HIVE split requires exact hbd_print_rate outside Hivemind */
      liquid?: components['schemas']['hivemind_endpoints.asset']
      /** @description HBD-denominated reward basis routed to HP/VESTS; final VESTS amount requires exact reward vesting state outside Hivemind */
      vesting?: components['schemas']['hivemind_endpoints.asset']
      /** @description HBD-denominated reward basis for direct-HBD paths such as treasury beneficiaries */
      direct?: components['schemas']['hivemind_endpoints.asset']
      /** @description Sum of the visible liquid, vesting, and direct HBD-denominated reward-basis buckets */
      total?: components['schemas']['hivemind_endpoints.asset']
    }
    'hivemind_endpoints.pending_author_rewards': {
      /** @description Account name */
      account?: string
      /** @description Number of posts awaiting payout */
      pending_post_count?: number
      /** @description Sum of pending reward basis across all unpaid posts, capped by max_accepted_payout */
      gross_reward_basis?: components['schemas']['hivemind_endpoints.asset']
      /** @description Author reward basis after beneficiary split; not final HBD/HIVE/VESTS payout */
      author_reward_basis?: components['schemas']['hivemind_endpoints.pending_reward_basis']
      /** @description Beneficiary reward basis, including direct-HBD treasury beneficiary basis when present; not final HBD/HIVE/VESTS payout */
      beneficiaries_reward_basis?: components['schemas']['hivemind_endpoints.pending_reward_basis']
      /** @description Curator reward basis for the account's posts; curation resolves to HP/VESTS outside Hivemind */
      curators_reward_basis?: components['schemas']['hivemind_endpoints.pending_reward_basis']
    }
    'hivemind_endpoints.pending_curation_rewards': {
      /** @description Account name */
      account?: string
      /** @description Number of recent votes awaiting payout (within the last 8 chain-days) */
      pending_vote_count?: number
      /** @description Curation reward basis across the account's pending votes; resolves to HP/VESTS outside Hivemind */
      curation_reward_basis?: components['schemas']['hivemind_endpoints.pending_reward_basis']
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
  'hivemind_endpoints.get_ops_by_account': {
    parameters: {
      query?: {
        /** @description Account name of the observer */
        'observer-name'?: string
        /**
         * @description List of operation types to get. If NULL, gets all non-virtual operation types.
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
       *     * Returns `hivemind_endpoints.operation_history`
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
           *         }
           *       ]
           *     }
           */
          'application/json': components['schemas']['hivemind_endpoints.operation_history']
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
  'hivemind_endpoints.get_account_pending_author_rewards': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Account to get pending author rewards for. */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Aggregated pending author rewards.
       *
       *     * Returns `hivemind_endpoints.pending_author_rewards`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "account": "blocktrades",
           *       "pending_post_count": 1,
           *       "gross_reward_basis": {
           *         "amount": "2000",
           *         "precision": 3,
           *         "nai": "@@000000013"
           *       },
           *       "author_reward_basis": {
           *         "liquid": {
           *           "amount": "500",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "vesting": {
           *           "amount": "500",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "direct": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "total": {
           *           "amount": "1000",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         }
           *       },
           *       "beneficiaries_reward_basis": {
           *         "liquid": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "vesting": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "direct": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "total": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         }
           *       },
           *       "curators_reward_basis": {
           *         "liquid": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "vesting": {
           *           "amount": "1000",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "direct": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "total": {
           *           "amount": "1000",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         }
           *       }
           *     }
           */
          'application/json': components['schemas']['hivemind_endpoints.pending_author_rewards']
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
  'hivemind_endpoints.get_account_pending_curation_rewards': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Account to get pending curation rewards for. */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Aggregated pending curation rewards.
       *
       *     * Returns `hivemind_endpoints.pending_curation_rewards`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example {
           *       "account": "blocktrades",
           *       "pending_vote_count": 1,
           *       "curation_reward_basis": {
           *         "liquid": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "vesting": {
           *           "amount": "1000",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "direct": {
           *           "amount": "0",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         },
           *         "total": {
           *           "amount": "1000",
           *           "precision": 3,
           *           "nai": "@@000000013"
           *         }
           *       }
           *     }
           */
          'application/json': components['schemas']['hivemind_endpoints.pending_curation_rewards']
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
  'hivemind_endpoints.get_reblogs': {
    parameters: {
      query: {
        /** @description Sorting method for posts */
        sort: 'trending' | 'hot' | 'created' | 'payout' | 'payout_comments' | 'muted'
        /** @description Filter by tag, community name, 'my' for observer's subscribed communities, or empty/'all' for all posts */
        tag?: string
        /** @description Account name to check reblog status for (required) */
        observer?: string
        /** @description Maximum number of posts to return */
        limit?: number
        /** @description Author of post to start pagination from */
        'start-author'?: string
        /** @description Permlink of post to start pagination from */
        'start-permlink'?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Array of posts with reblog status
       *
       *     * Returns `SETOF hivemind_endpoints.reblog_status`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "author": "hiveio",
           *         "permlink": "hive-5-celebrating-our-5th-anniversary-as-hive",
           *         "reblogged": true
           *       },
           *       {
           *         "author": "alice",
           *         "permlink": "my-awesome-post",
           *         "reblogged": false
           *       }
           *     ]
           */
          'application/json': components['schemas']['hivemind_endpoints.array_of_reblog_status']
        }
      }
      /** @description Invalid parameters (missing observer or invalid sort) */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hivemind_endpoints.get_sync_status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last block processed by hivemind and its timestamp.
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
            /** @description highest block number processed by hivemind */
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
}
