export interface paths {
  '/accounts/{account-name}/reputation': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Account reputation
     * @description Returns calculated reputation with formula found in:
     *     https://hive.blog/steemit/@digitalnotvir/how-reputation-scores-are-calculated-the-details-explained-with-simple-math
     *
     *     SQL example
     *     * `SELECT * FROM reptracker_endpoints.get_account_reputation('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/reputation-api/accounts/blocktrades/reputation'`
     */
    get: operations['reptracker_endpoints.get_account_reputation']
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
     * Get reputation tracker's version
     * @description Get reputation tracker's last commit hash (versions set by by hash value).
     *
     *     SQL example
     *     * `SELECT * FROM reptracker_endpoints.get_reptracker_version();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/reputation-api/version'`
     */
    get: operations['reptracker_endpoints.get_reptracker_version']
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
     * Get last block number synced by reputation tracker (deprecated)
     * @deprecated
     * @description **Deprecated** — superseded by `/sync-status`, which returns the block
     *     number together with its timestamp (enabling single-call staleness
     *     checks). This endpoint remains for backward compatibility.
     *
     *     Get the block number of the last block synced by reputation tracker.
     *
     *     SQL example
     *     * `SELECT * FROM reptracker_endpoints.get_rep_last_synced_block();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/reputation-api/last-synced-block'`
     */
    get: operations['reptracker_endpoints.get_rep_last_synced_block']
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
     * Get reputation tracker's sync status
     * @description Get the last block processed by reputation tracker as an object containing
     *     both the block number and its timestamp (UTC). This is the uniform
     *     HAF-app sync/health endpoint: the timestamp lets a consumer compute
     *     staleness with a single call (`age = now() - last_block_time`) without
     *     needing a separate head-block reference. Supersedes the deprecated
     *     `/last-synced-block`.
     *
     *     SQL example
     *     * `SELECT * FROM reptracker_endpoints.get_rep_sync_status();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/reputation-api/sync-status'`
     */
    get: operations['reptracker_endpoints.get_rep_sync_status']
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
  schemas: never
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  'reptracker_endpoints.get_account_reputation': {
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
       * @description Account reputation
       *
       *     * Returns `INT`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example 69 */
          'application/json': number
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
  'reptracker_endpoints.get_reptracker_version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description reputation tracker version
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
  'reptracker_endpoints.get_rep_last_synced_block': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last synced block by reputation tracker
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
  'reptracker_endpoints.get_rep_sync_status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last block processed by reputation tracker and its timestamp.
       *     `last_block_time` is null if no block has been processed yet.
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
            /** @description highest block number processed by the app */
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
