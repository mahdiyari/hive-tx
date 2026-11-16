export interface paths {
  '/openapi.json': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * OpenAPI definitions
     * @description The OpenAPI definitions of the HafSQL APIs as JSON.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description JSON */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * All accounts
     * @description Returns the list of all Hive accounts.
     */
    get: {
      parameters: {
        query?: {
          /** @description Account name used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting <br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/by-names': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Accounts by names
     * @description Returns account[s] related information.
     */
    get: {
      parameters: {
        query: {
          /** @description List of usernames separated by `,` */
          names: string
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account objects */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': unknown
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
        /** @description No items found */
        404: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['NoItemFound']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/by-creator/{username}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Accounts by creator
     * @description Search accounts by their creator.
     */
    get: {
      parameters: {
        query?: {
          /** @description Account name used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Username of the creator */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/by-recovery/{username}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Accounts by recovery
     * @description Search accounts by their recovery.
     */
    get: {
      parameters: {
        query?: {
          /** @description Account name used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Username of the recovery */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/by-key/{key}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Accounts by key
     * @description Search accounts by their public key (memo, posting, active, and owner)
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Public key */
          key: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/by-authority/{username}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Accounts by authority
     * @description Search accounts by their granted authorities
     *     (posting, active, and owner)
     */
    get: {
      parameters: {
        query?: {
          /** @description Account name used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Username of the authority */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/by-proxy/{username}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Accounts by proxy
     * @description Search accounts by their proxy.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Proxy username */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/balances/by-names': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Balances by names
     * @description Returns balances of the accounts.
     */
    get: {
      parameters: {
        query: {
          /** @description List of usernames separated by `,` */
          names: string
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of balance objects */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': unknown
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/balances/historical/{name}/{block_num}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Historical balances
     * @description Returns balances of the account at certain block_num.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Username */
          name: string
          /** @description Block number */
          block_num: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON object of balances */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': unknown
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/balances/rich-list/{symbol}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Rich list
     * @description Returns the top holders of a certain token.
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description Max number of returned items<br/>
           *     <sub>min: 1 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Token symbol */
          symbol: components['schemas']['Symbol']
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON object of balances */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': unknown
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/balances/total-balances': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Total balances
     * @description Returns the sum of account balances.<br/>
     *     Note: Pending balances such as pending convert or pending escrow are not taken into account.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON object of balances */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': unknown
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/blacklisting': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Blacklisting accounts
     * @description Returns list of accounts who have blacklisted a certain username.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/blacklisted': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Blacklisted accounts
     * @description Returns list of accounts blacklisted by a certain username.
     */
    get: {
      parameters: {
        query?: {
          /** @description Username used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/blacklists': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Blacklists followed
     * @description Returns list of blacklists followed by a certain username.
     *     Each blacklist is a Hive username.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/chain/dynamic-global-properties': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Dynamic Global Properties
     * @description Returns dynamic_global_properties optionally at a certain block number.
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description Block number to get the historical values
           *     for that block number
           */
          block_num?: number
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON object */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/chain/block/{block_num}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Block
     * @description Returns the block information
     */
    get: {
      parameters: {
        query?: {
          /** @description Set true to include transactions in the returned result */
          include_trx?: boolean
        }
        header?: never
        path: {
          /** @description Block number - 0 to get the head block */
          block_num: number
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON object */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/chain/transactions/{block_num}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Transactions
     * @description Returns the transactions included in a block
     */
    get: {
      parameters: {
        query?: {
          /** @description Set true to include operations in the returned result */
          include_ops?: boolean
        }
        header?: never
        path: {
          /** @description Block number */
          block_num: number
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Array of transaction object */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/chain/transaction/{trx_id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Find Transaction
     * @description Returns the transaction information including the operations
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Transaction id */
          trx_id: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON object */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/chain/operations/{block_num}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Operations
     * @description Returns the operations included in a block. This doesn't include transaction information (see "Get Transactions" for that).
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description By default will return in the legacy format i.e arrays and formatted assets like `1.000 HIVE`
           *     <br>Set to `false` to return in the object format and assets as nai
           */
          legacy_format?: boolean
        }
        header?: never
        path: {
          /** @description Block number */
          block_num: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Array of operations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': unknown[][]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/comments/{author}/{permlink}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Comment
     * @description Returns a post or comment by author and permlink.
     */
    get: {
      parameters: {
        query?: {
          /** @description Set true to return the post/comment body */
          include_body?: boolean
        }
        header?: never
        path: {
          /** @description The post/comment author */
          author: string
          /** @description The post/comment permlink */
          permlink: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Post/comment as JSON */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/communities/{username}/roles': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Community Roles
     * @description Returns list of roles in a community.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Community account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of roles */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/communities/{username}/subscribers': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Community Subscribers
     * @description Returns list of community subscribers.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Community account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of accounts */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/delegations/{username}/incoming': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Incoming HP Delegations
     * @description Returns list of incoming delegations to a user.
     */
    get: {
      parameters: {
        query?: {
          /** @description Timestamp used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of delegations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/delegations/{username}/outgoing': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Outgoing HP Delegations
     * @description Returns list of outgoing delegations from a user.
     */
    get: {
      parameters: {
        query?: {
          /** @description Timestamp used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of delegations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/rc-delegations/{username}/incoming': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Incoming RC Delegations
     * @description Returns list of incoming RC delegations to a user.
     */
    get: {
      parameters: {
        query?: {
          /** @description Timestamp used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of delegations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/rc-delegations/{username}/outgoing': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Outgoing RC Delegations
     * @description Returns list of outgoing RC delegations from a user.
     */
    get: {
      parameters: {
        query?: {
          /** @description Timestamp used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of delegations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/followers': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Followers
     * @description Returns list of followers of a certain username.
     */
    get: {
      parameters: {
        query?: {
          /** @description Username used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/following': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Following
     * @description Returns list of following of a certain username.
     */
    get: {
      parameters: {
        query?: {
          /** @description Username used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/follow-counts': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Follow counts
     * @description Returns number of the followers and following of an account.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON object of followers and following count */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': unknown
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market/orderbook': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Orderbook
     * @description Returns order book.
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description Number of decimal points to group orders in.
           *     - Min: 1
           *     - Max: 6
           */
          decimals?: number
          /**
           * @description Max number of items in the sell and buy orderbook.
           *     - Min: 1
           *     - Max: 200
           */
          limit?: number
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of orderbook */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market/open-orders/{username}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Open Orders
     * @description Returns open orders of a user.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Account username */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of open orders */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market/all-trade-history': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * All Trade History
     * @description Returns trade history of the market.
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description Max number of items to return - Can be negative for reverse sorting
           *     - Min: -1000
           *     - Max: 1000
           */
          limit?: number
          /** @description ID used for pagination */
          start?: number
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of open orders */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market/trade-history/{username}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Account Trade History
     * @description Returns filled orders of an account (as either side of the trade).
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description Max number of items to return - Can be negative for reverse sorting
           *     - Min: -1000
           *     - Max: 1000
           */
          limit?: number
          /** @description ID used for pagination */
          start?: number
        }
        header?: never
        path: {
          /** @description Account username */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of filled orders */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market/tickers': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Tickers
     * @description Returns basic information about the market.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of orders */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/market/charts/{bucket}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Chart Data
     * @description Returns data that can be used to draw charts in different buckets.
     */
    get: {
      parameters: {
        query?: {
          /** @description Timestamp used for pagination */
          start?: string
          /**
           * @description Max number of items to return
           *     - min: 1
           *     - Max: 1000
           */
          limit?: number
        }
        header?: never
        path: {
          /**
           * @description One of the following:
           *     - 5m
           *     - 30m
           *     - 1h
           *     - 4h
           *     - 1d
           *     - 1w
           *     - 4w
           */
          bucket: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of orders */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/muting': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Muting accounts
     * @description Returns list of accounts who have muted a certain username.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/muted': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Muted accounts
     * @description Returns list of accounts muted by a certain username.
     */
    get: {
      parameters: {
        query?: {
          /** @description Username used for pagination */
          start?: string
          /**
           * @description Max number of returned items -
           *     Can be negative for going backwards and to reverse the sorting<br/>
           *     <sub>min: -1000 | max: 1000</sub>
           */
          limit?: number
        }
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/accounts/{username}/muted-lists': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Muted lists
     * @description Returns list of mute-lists followed by a certain username.
     *     Each mute-list is a Hive username.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operations/by-range/{types}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Operations in block range
     * @description Return specified operations in a block range
     */
    get: {
      parameters: {
        query: {
          /** @description Block range - Maximum range is 1000 blocks */
          block_range: string
        }
        header?: never
        path: {
          /** @description Operation types */
          types: components['schemas']['OperationTypes']
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description JSON array of operations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operations/custom_json/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * custom_json
     * @description Search custom_json operations
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description `id` (the id used in the database for sorting not the custom_id)
           *     or `block_num` used for pagination - omit to return the latest items
           */
          start?: string
          /**
           * @description Max number of items to return - Can be negative to reverse the sorting
           *     - min: -1000
           *     - max: 1000
           *     - default 100
           */
          limit?: string
        }
        header?: never
        path: {
          /** @description ID parameter of the custom_json to find - we call this custom_id */
          id: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description JSON array of operations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/operations/transfer': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * transfer
     * @description Search transfer operations
     */
    get: {
      parameters: {
        query?: {
          /**
           * @description Memo to search -
           *     prefix with `%LIKE%:` for partial search with sql LIKE - For example to find all memos starting with `!poll` we can do
           *     `%LIKE%:!poll%` - This will search for results like `!poll test1234`
           */
          memo?: string
          /** @description Username of the sender */
          from?: string
          /** @description Destination username */
          to?: string
          /** @description `id` or `block_num` used for pagination */
          start?: string
          /**
           * @description Max number of items to return - Can be negative to reverse the sorting
           *     - min: -1000
           *     - max: 1000
           *     - default 100
           */
          limit?: string
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description JSON array of operations */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': Record<string, never>[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/proposals/{id}/approvals': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Proposal Approvals
     * @description Returns list of accounts voting for a proposal.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Proposal id */
          id: number
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description A JSON array of account names */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string[]
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/reputations/{username}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get Reputation
     * @description Return reputation of a user.
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description Account name */
          username: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Reputation string */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': string
          }
        }
        /** @description Bad request value */
        400: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': components['schemas']['BadRequest']
          }
        }
      }
    }
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
    /**
     * @example {
     *       "status": 400,
     *       "error": "Bad Request",
     *       "message": "Invalid request value"
     *     }
     */
    BadRequest: {
      status?: number
      error?: string
      message?: string
    }
    /**
     * @example {
     *       "status": 404,
     *       "error": "Not Found",
     *       "message": "No items found"
     *     }
     */
    NoItemFound: {
      status?: number
      error?: string
      message?: string
    }
    OperationTypes: (
      | 'vote'
      | 'comment'
      | 'transfer'
      | 'transfer_to_vesting'
      | 'withdraw_vesting'
      | 'limit_order_create'
      | 'limit_order_cancel'
      | 'feed_publish'
      | 'convert'
      | 'account_create'
      | 'account_update'
      | 'witness_update'
      | 'account_witness_vote'
      | 'account_witness_proxy'
      | 'pow'
      | 'custom'
      | 'witness_block_approve'
      | 'delete_comment'
      | 'custom_json'
      | 'comment_options'
      | 'set_withdraw_vesting_route'
      | 'limit_order_create2'
      | 'claim_account'
      | 'create_claimed_account'
      | 'request_account_recovery'
      | 'recover_account'
      | 'change_recovery_account'
      | 'escrow_transfer'
      | 'escrow_dispute'
      | 'escrow_release'
      | 'pow2'
      | 'escrow_approve'
      | 'transfer_to_savings'
      | 'transfer_from_savings'
      | 'cancel_transfer_from_savings'
      | 'custom_binary'
      | 'decline_voting_rights'
      | 'reset_account'
      | 'set_reset_account'
      | 'claim_reward_balance'
      | 'delegate_vesting_shares'
      | 'account_create_with_delegation'
      | 'witness_set_properties'
      | 'account_update2'
      | 'create_proposal'
      | 'update_proposal_votes'
      | 'remove_proposal'
      | 'update_proposal'
      | 'collateralized_convert'
      | 'recurrent_transfer'
      | 'fill_convert_request'
      | 'author_reward'
      | 'curation_reward'
      | 'comment_reward'
      | 'liquidity_reward'
      | 'interest'
      | 'fill_vesting_withdraw'
      | 'fill_order'
      | 'shutdown_witness'
      | 'fill_transfer_from_savings'
      | 'hardfork'
      | 'comment_payout_update'
      | 'return_vesting_delegation'
      | 'comment_benefactor_reward'
      | 'producer_reward'
      | 'clear_null_account_balance'
      | 'proposal_pay'
      | 'dhf_funding'
      | 'hardfork_hive'
      | 'hardfork_hive_restore'
      | 'delayed_voting'
      | 'consolidate_treasury_balance'
      | 'effective_comment_vote'
      | 'ineffective_delete_comment'
      | 'dhf_conversion'
      | 'expired_account_notification'
      | 'changed_recovery_account'
      | 'transfer_to_vesting_completed'
      | 'pow_reward'
      | 'vesting_shares_split'
      | 'account_created'
      | 'fill_collateralized_convert_request'
      | 'system_warning'
      | 'fill_recurrent_transfer'
      | 'failed_recurrent_transfer'
      | 'limit_order_cancelled'
      | 'producer_missed'
      | 'proposal_fee'
      | 'collateralized_convert_immediate_conversion'
      | 'escrow_approved'
      | 'escrow_rejected'
      | 'proxy_cleared'
      | 'declined_voting_rights'
    )[]
    /** @enum {string} */
    Symbol: 'hive' | 'hbd' | 'vests' | 'hive_savings' | 'hbd_savings'
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export type operations = Record<string, never>
