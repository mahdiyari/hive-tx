export interface paths {
  '/version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get NFT Tracker's version
     * @description Get NFT Tracker's last commit hash (versions set by hash value).
     *
     *     SQL example
     *     * `SELECT * FROM nfttracker_endpoints.get_version();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/version'`
     */
    get: operations['nfttracker_endpoints.get_version']
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
     * Get NFT Tracker's sync status
     * @description Get the last block processed by NFT Tracker as an object containing
     *     both the block number and its timestamp (UTC). This is the uniform
     *     HAF-app sync/health endpoint: the timestamp lets a consumer compute
     *     staleness with a single call (`age = now() - last_block_time`) without
     *     needing a separate head-block reference.
     *
     *     SQL example
     *     * `SELECT * FROM nfttracker_endpoints.get_sync_status();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/sync-status'`
     */
    get: operations['nfttracker_endpoints.get_sync_status']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/nfts': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * NFT types
     * @description Returns registered NFT types.
     *
     *     SQL example
     *     * `SELECT * FROM nfttracker_endpoints.get_nft_types();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/nfts'`
     */
    get: operations['nfttracker_endpoints.get_nft_types']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/nfts/{creator}/{symbol}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * NFT instances
     * @description Returns issued instances of given NFT symbol.
     *
     *     SQL example
     *     * `SELECT * FROM nfttracker_endpoints.get_nft_instances('alice', 'TEST');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/nfts/alice/TEST'`
     */
    get: operations['nfttracker_endpoints.get_nft_instances']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/nfts/{creator}/{symbol}/{tags}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * NFT instances
     * @description Returns issued instances of given NFT symbol.
     *
     *     SQL example
     *     * `SELECT * FROM nfttracker_endpoints.get_nft_instances('alice', 'TEST');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/nfts/alice/TEST'`
     */
    get: operations['nfttracker_endpoints.get_nft_instances_with_tags']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/nfts/by-trx/{trx_id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * NFT instances by transaction
     * @description Returns NFT instances created by a given transaction.
     *
     *     SQL example
     *     * `SELECT * FROM nfttracker_endpoints.get_nft_instances_by_trx('abc123...');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/nfts/by-trx/abc123...'`
     */
    get: operations['nfttracker_endpoints.get_nft_instances_by_trx']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/trx/{trx_id}/results': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Transaction results
     * @description Returns the results of NFT operations in a given transaction,
     *     including both successes and failures with error messages.
     *
     *     SQL example
     *     * `SELECT * FROM nfttracker_endpoints.get_trx_results('abc123...');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/trx/abc123.../results'`
     */
    get: operations['nfttracker_endpoints.get_trx_results']
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
    'nfttracker_endpoints.nft_type': {
      /** @description id of NFT type */
      id?: number
      /** @description account name that registered NFT type */
      creator?: string
      /** @description current owner of NFT type */
      owner?: string
      /** @description symbol name of registered NFT type */
      symbol?: string
      /** @description name of registered NFT type */
      name?: string
      /** @description max number of possible issued instances of this NFT type */
      max_count?: number
      /**
       * Format: date-time
       * @description the timestamp when the NFT type was registered
       */
      created_at?: string
      /**
       * Format: date-time
       * @description the timestamp when the NFT type was last modified
       */
      updated_at?: string
      /** @description list of accounts that can issue instance of this NFT type */
      authorized_issuers?: string[]
    }
    'nfttracker_endpoints.nft_instance': {
      /** @description id of NFT instance */
      id?: string
      /** @description account currently owning this instance */
      holder?: string
      /** @description extra data as JSON */
      data?: string
      /** @description extra tags associated with this instance */
      tags?: string[]
      /** @description whether this instance is soulbound (cannot be transferred to other account) */
      soulbound?: boolean
      /**
       * Format: date-time
       * @description the timestamp when this instance was created
       */
      created_at?: string
      /**
       * Format: date-time
       * @description the timestamp this instance was last modified
       */
      updated_at?: string
    }
    'nfttracker_endpoints.nft_instance_with_type': {
      /** @description id of NFT instance */
      id?: string
      /** @description account that registered the NFT type */
      creator?: string
      /** @description symbol name of the NFT type */
      symbol?: string
      /** @description account currently owning this instance */
      holder?: string
      /** @description extra data as JSON */
      data?: string
      /** @description extra tags associated with this instance */
      tags?: string[]
      /** @description whether this instance is soulbound (cannot be transferred to other account) */
      soulbound?: boolean
      /**
       * Format: date-time
       * @description the timestamp when this instance was created
       */
      created_at?: string
      /**
       * Format: date-time
       * @description the timestamp this instance was last modified
       */
      updated_at?: string
    }
    'nfttracker_endpoints.trx_result': {
      /** @description unique result ID */
      id?: number
      /** @description position of the operation within the block */
      op_pos?: number
      /** @description 0-based position of this action within the transaction's action array */
      subsequent_no?: number
      /** @description NFT action type (register, issue, transfer, etc.) */
      action?: string
      /** @description NFT symbol targeted by the operation (e.g. alice/CARD) */
      symbol?: string
      /** @description account that submitted the operation, null for malformed operations lacking active authority */
      account?: string | null
      /** @description whether the operation succeeded */
      success?: boolean
      /** @description error message if the operation failed, null on success */
      error_message?: string
      /**
       * Format: date-time
       * @description block timestamp when the operation was processed
       */
      created_at?: string
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
  'nfttracker_endpoints.get_version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description NFT Tracker version
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
  'nfttracker_endpoints.get_sync_status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last block processed by NFT Tracker and its timestamp.
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
  'nfttracker_endpoints.get_nft_types': {
    parameters: {
      query?: {
        /** @description Maximum number of types to return. The value is capped at 1000, which is also the default. */
        count?: number
        /** @description Return types with IDs greater than this value. */
        last_id?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Registered NFT types
       *
       *     * Returns `nfttracker_endpoints.nft_type`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "id": 1,
           *         "creator": "alice",
           *         "owner": "bob",
           *         "symbol": "TEST",
           *         "name": "Test symbol",
           *         "max_count": 10,
           *         "created_at": "2025-08-22T12:00:00",
           *         "updated_at": "2025-08-22T12:00:00",
           *         "authorized_issuers": [
           *           "alice",
           *           "bob"
           *         ]
           *       }
           *     ]
           */
          'application/json': components['schemas']['nfttracker_endpoints.nft_type'][]
        }
      }
    }
  }
  'nfttracker_endpoints.get_nft_instances': {
    parameters: {
      query?: {
        /** @description Only return instances held by this account */
        holder?: string
        /** @description Maximum number of instances to return. The value is capped at 1000, which is also the default */
        count?: number
        /** @description Return instances with IDs greater than this value */
        last_id?: string
      }
      header?: never
      path: {
        /** @description name of the account that created the NFT type */
        creator: string
        /** @description NFT symbol */
        symbol: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Issued NFT instances of given symbol
       *
       *     * Returns `nfttracker_endpoints.nft_instance`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "id": "123456789012345678",
           *         "holder": "alice",
           *         "data": "{\"key\": \"value\"}",
           *         "tags": [
           *           "item",
           *           "collectible"
           *         ],
           *         "soulbound": false,
           *         "created_at": "2025-08-22T12:00:00",
           *         "updated_at": "2025-08-22T12:00:00"
           *       }
           *     ]
           */
          'application/json': components['schemas']['nfttracker_endpoints.nft_instance'][]
        }
      }
      /** @description creator/symbol combination does not exist */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'nfttracker_endpoints.get_nft_instances_with_tags': {
    parameters: {
      query?: {
        /** @description Only return instances held by this account */
        holder?: string
        /** @description Maximum number of instances to return. The value is capped at 1000, which is also the default. */
        count?: number
        /** @description Return instances with IDs greater than this value. */
        last_id?: string
      }
      header?: never
      path: {
        /** @description name of the account that created the NFT type */
        creator: string
        /** @description NFT symbol */
        symbol: string
        /**
         * @description Only return instances with tags matching pattern.
         *     Pattern is a pipe-separated list of comma-separated tags.
         *     Example: `a,b|x,y|z` will match instances with tags 'a' and 'b', 'x' and 'y', or 'z'.
         */
        tags: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Issued NFT instances of given symbol
       *
       *     * Returns `nfttracker_endpoints.nft_instance`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "id": "123456789012345678",
           *         "holder": "alice",
           *         "data": "{\"key\": \"value\"}",
           *         "tags": [
           *           "item",
           *           "collectible"
           *         ],
           *         "soulbound": false,
           *         "created_at": "2025-08-22T12:00:00",
           *         "updated_at": "2025-08-22T12:00:00"
           *       }
           *     ]
           */
          'application/json': components['schemas']['nfttracker_endpoints.nft_instance'][]
        }
      }
      /** @description creator/symbol combination does not exist */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'nfttracker_endpoints.get_nft_instances_by_trx': {
    parameters: {
      query?: {
        /** @description Maximum number of instances to return. The value is capped at 1000, which is also the default. */
        count?: number
        /** @description Return instances with IDs greater than this value. */
        last_id?: string
      }
      header?: never
      path: {
        /** @description hex-encoded transaction hash */
        trx_id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description NFT instances created by the given transaction
       *
       *     * Returns `nfttracker_endpoints.nft_instance_with_type`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "id": "123456789012345678",
           *         "creator": "alice",
           *         "symbol": "TEST",
           *         "holder": "bob",
           *         "data": "{\"key\": \"value\"}",
           *         "tags": [
           *           "item",
           *           "collectible"
           *         ],
           *         "soulbound": false,
           *         "created_at": "2025-08-22T12:00:00",
           *         "updated_at": "2025-08-22T12:00:00"
           *       }
           *     ]
           */
          'application/json': components['schemas']['nfttracker_endpoints.nft_instance_with_type'][]
        }
      }
    }
  }
  'nfttracker_endpoints.get_trx_results': {
    parameters: {
      query?: {
        /** @description Maximum number of results to return. The value is capped at 1000, which is also the default. */
        count?: number
        /** @description Return results with IDs greater than this value. */
        last_id?: number
      }
      header?: never
      path: {
        /** @description hex-encoded transaction hash (40 characters) */
        trx_id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Operation results for the given transaction
       *
       *     * Returns `nfttracker_endpoints.trx_result`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       {
           *         "id": 1,
           *         "op_pos": 0,
           *         "subsequent_no": 0,
           *         "action": "register",
           *         "symbol": "alice/CARD",
           *         "account": "alice",
           *         "success": true,
           *         "error_message": null,
           *         "created_at": "2025-08-22T12:00:00"
           *       }
           *     ]
           */
          'application/json': components['schemas']['nfttracker_endpoints.trx_result'][]
        }
      }
    }
  }
}
