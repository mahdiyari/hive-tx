export interface paths {
  '/posts/search': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Full semantic search results in a single call
     * @description Returns an ordered list of posts most similar to a given query.
     *     The first **N** results (default 10, max 50) are returned as full
     *     bridge-post JSON objects; the remaining results (up to **posts_limit**,
     *     default 100, max 1000) are stub entries containing only *author* and
     *     *permlink*.  Paging is now done entirely on the client side.
     */
    get: operations['hivesense_endpoints.posts_search']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/posts/{author}/{permlink}/similar': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Full semantic search results for similar posts in a single call
     * @description Performs semantic similarity search to find posts that are contextually
     *     similar to a specified Hive post. Returns an ordered list of posts most
     *     similar to the given post.
     *
     *     The first **N** results (default 10, max 50) are returned as full
     *     bridge-post JSON objects; the remaining results (up to **posts_limit**,
     *     default 100, max 1000) are stub entries containing only *author* and
     *     *permlink*. Paging is done entirely on the client side.
     *
     *     Key features:
     *     - Semantic analysis considers post content and context
     *     - Results are ordered by similarity (most similar first)
     *     - Optional content filtering through observer blacklists
     *     - Configurable body length truncation for preview purposes
     *     - Split response: full data for top results, stubs for remainder
     *
     *     The similarity analysis takes into account:
     *     - Post content and context
     *     - Semantic relationships between posts
     *     - Topic relevance and contextual meaning
     *
     *     SQL example:
     *     SELECT * FROM hivesense_endpoints.posts_similar('bue-witness', 'bue-witness-post', 20, 100, 10);
     *
     *     REST call example:
     *     GET 'https://rpc.mahdiyari.info//hivesense-api/posts/bue-witness/my-blog-post/similar?truncate=20&limit=100&full_posts=10'
     */
    get: operations['hivesense_endpoints.posts_similar']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/authors/search': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * List of Hive accounts thematically aligned with a given pattern, ranked by the semantic similarity of their posts.
     * @description This endpoint returns a JSON array of author names ranked by their thematic alignment
     *     with a given text pattern. The ranking is based on the semantic similarity of their
     *     posts to the input pattern, with higher-ranked posts contributing more to the author’s score.
     *     Each authors score is computed as the sum of 1 / sqrt(r), where r is the rank of each post
     *     associated with the author. Authors with more frequent and higher-ranked posts receive higher scores.
     *     The result is a sorted list of author names, from most to least thematically aligned.
     */
    get: operations['hivesense_endpoints.authors_search']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/posts/by-ids': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Fetch full post details for multiple posts by their IDs
     * @description Retrieves complete post information for a batch of posts identified by
     *     their author/permlink pairs. This endpoint is designed to work with the
     *     new paging model where search results return mostly stub entries, and
     *     clients fetch full details as needed for display.
     *
     *     Key features:
     *     - Accepts up to 50 post identifiers in a single request
     *     - Returns posts in the same order as requested
     *     - Supports body truncation for preview mode
     *     - Respects observer mute lists and blacklists
     *     - Returns null for non-existent posts while preserving order
     *
     *     This endpoint is typically used after calling /posts/search or
     *     /posts/{author}/{permlink}/similar, which return full data for only
     *     the first N posts. When the user scrolls or pages through results,
     *     the client calls this endpoint with the next batch of author/permlink
     *     pairs to get their full details.
     *
     *     Example workflow:
     *     1. Call /posts/search with result_limit=1000, full_posts=10
     *     2. Display first 10 posts immediately (already have full data)
     *     3. When user scrolls to post 11, call this endpoint with posts 11-20
     *     4. Continue fetching batches as user scrolls
     */
    post: operations['hivesense_endpoints.posts_by_ids']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/posts/by-ids-query': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Fetch full post details for multiple posts (GET variant)
     * @description GET variant of /posts/by-ids that accepts post identifiers as query
     *     parameters. Limited to fetching fewer posts due to URL length constraints.
     *
     *     For larger batches, use the POST /posts/by-ids endpoint instead.
     *
     *     The posts parameter should be a URL-encoded JSON array.
     *
     *     Example:
     *     GET /posts/by-ids-query?posts=[{"author":"user1","permlink":"post1"}]&truncate=500
     */
    get: operations['hivesense_endpoints.posts_by_ids_query']
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
     * Get HiveSense's version
     * @description Get the git commit hash of the deployed HiveSense version.
     *     Returns `unspecified` when the image was built without a git hash.
     *
     *     SQL example
     *     * `SELECT hivesense_endpoints.get_hivesense_version();`
     *
     *     REST call example
     *     * `GET '/hivesense-api/version'`
     */
    get: operations['hivesense_endpoints.get_hivesense_version']
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
     * Get HiveSense's sync status
     * @description Get the last block whose embeddings HiveSense has applied, as an object
     *     containing both the block number and its timestamp (UTC). This is the
     *     uniform HAF-app sync/health endpoint: the timestamp lets a consumer
     *     compute staleness with a single call (`age = now() - last_block_time`)
     *     without needing a separate head-block reference.
     *
     *     HiveSense syncs embeddings out of band from a remote embedding API, so
     *     this value may lag chain head during catch-up.
     *
     *     SQL example
     *     * `SELECT hivesense_endpoints.get_hivesense_sync_status();`
     *
     *     REST call example
     *     * `GET '/hivesense-api/sync-status'`
     */
    get: operations['hivesense_endpoints.get_hivesense_sync_status']
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
    embeddingupdate: {
      sync_seq?: number
      op?: string
      author?: string
      permlink?: string
      number_of_tokens?: number
      last_vectors_block?: number
      embeddings?: number[][]
    }
    syncsettings: {
      /** Format: uuid */
      sync_uuid?: string
      llm?: string
      embedding_dimensionality?: number
      document_prefix?: string
      query_prefix?: string
      tokens_per_chunk?: number
      overlap_amount?: number
      min_token_threshold?: number
      max_embeddings_per_post?: number
      skipped_op_count?: number
    }
    syncchain: {
      /** Format: uuid */
      sync_uuid?: string
      base_url?: string | null
      llm?: string
      embedding_dimensionality?: number
      document_prefix?: string
      query_prefix?: string
      tokens_per_chunk?: number
      overlap_amount?: number
      min_token_threshold?: number
      max_embeddings_per_post?: number
      skipped_op_count?: number
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
  'hivesense_endpoints.posts_search': {
    parameters: {
      query: {
        /** @description Search query text for semantic similarity, e.g. `"vector databases"` */
        q: string
        /** @description Body truncation length (0 = full content, >0 = truncate to N chars) */
        truncate?: number
        /** @description Total number of posts (full + stub) to return */
        result_limit?: number
        /** @description How many of the top results should include full post data */
        full_posts?: number
        /** @description Hive account whose mute lists etc. will be respected */
        observer?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description JSON array of result objects */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example {} */
          'application/json': string
        }
      }
    }
  }
  'hivesense_endpoints.posts_similar': {
    parameters: {
      query?: {
        /**
         * @description Controls the length of returned post bodies in the results. When set to 0,
         *     returns complete post content. Any other positive value will truncate the
         *     post body to that many characters. Useful for generating previews or
         *     reducing response size. Maximum value is 65535 characters.
         * @example 20
         */
        truncate?: number
        /**
         * @description Total number of posts (full + stub) to return. Must be between
         *     1 and 1000. The posts are returned in order of similarity, with the most
         *     similar posts first. Setting a lower limit can improve response times
         *     and reduce data transfer.
         * @example 100
         */
        result_limit?: number
        /**
         * @description How many of the top results should include full post data. Any
         *     remaining posts (up to result_limit) will be stub entries with only
         *     author & permlink. Set this to the size of your first page of results.
         * @example 10
         */
        full_posts?: number
        /**
         * @description Optional Hive account name with blacklists that will be used to filter the
         *     results. When provided, any posts from authors in the observer
         *     blacklist will be excluded from the results. Leave empty to disable
         *     blacklist filtering. Useful for content moderation and personalization.
         * @example hive.blog
         */
        observer?: string
      }
      header?: never
      path: {
        /**
         * @description The Hive username of the post author. This is the account name that
         *     created the original post for which you want to find similar content.
         *     Must be a valid Hive account name.
         * @example bue-witness
         */
        author: string
        /**
         * @description The unique permlink identifier of the post. This is the URL-friendly
         *     version of the post title that appears in the post URL on Hive.
         *     Together with the author name, it uniquely identifies the post.
         * @example my-blog-post
         */
        permlink: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful response with JSON that contains a list of similar posts */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example {} */
          'application/json': string
        }
      }
    }
  }
  'hivesense_endpoints.authors_search': {
    parameters: {
      query: {
        /**
         * @description Topic or theme to search for. Authors whose posts are semantically related to this topic will be returned.
         * @example Make witness node secure against hackers attack and emergency situations
         */
        topic: string
        /**
         * @description Maximum number of authors to return (1-100).
         * @example 10
         */
        result_limit?: number
        /** @description Observer (hive account name) whose settings (such as muted lists) are used to filter out excluded posts from the search results */
        observer?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description * Returns  JSON with a sorted list of Hive accounts */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /**
           * @example [
           *       "dele-puppy",
           *       "nextgencrypto",
           *       "xeroc",
           *       "steemed",
           *       "tuck-fheman",
           *       "dantheman",
           *       "salvation",
           *       "pharesim",
           *       "masteryoda",
           *       "ihashfury"
           *     ]
           */
          'application/json': string
        }
      }
    }
  }
  'hivesense_endpoints.posts_by_ids': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': {
          /**
           * @description Array of post identifiers. Each item must have both 'author'
           *     and 'permlink' fields. Maximum 50 posts per request.
           * @example [
           *       {
           *         "author": "bue-witness",
           *         "permlink": "my-first-post"
           *       },
           *       {
           *         "author": "another-user",
           *         "permlink": "interesting-topic"
           *       }
           *     ]
           */
          posts: {
            /** @description The Hive username of the post author */
            author: string
            /** @description The unique permlink identifier of the post */
            permlink: string
          }[]
          /**
           * @description Body truncation length. 0 returns full content, positive values
           *     truncate to N characters. Useful for preview mode.
           * @default 0
           */
          truncate?: number
          /**
           * @description Optional Hive account whose mute lists and blacklists will be
           *     applied to filter results. Leave empty to disable filtering.
           * @default
           */
          observer?: string
        }
      }
    }
    responses: {
      /**
       * @description JSON array of post objects in the same order as requested.
       *     Non-existent posts are returned as null to preserve array indices.
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example {} */
          'application/json': string
        }
      }
      /** @description Invalid request (e.g., too many posts, invalid format) */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'hivesense_endpoints.posts_by_ids_query': {
    parameters: {
      query: {
        /**
         * @description URL-encoded JSON array of post identifiers. Each object must have
         *     'author' and 'permlink' fields. Maximum 10 posts for GET requests.
         * @example [{"author":"bue-witness","permlink":"my-post"}]
         */
        posts: string
        /** @description Body truncation length (0 = full content) */
        truncate?: number
        /** @description Optional Hive account for filtering */
        observer?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description JSON array of post objects */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example {} */
          'application/json': string
        }
      }
    }
  }
  'hivesense_endpoints.get_hivesense_version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description HiveSense version (git commit hash)
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
  'hivesense_endpoints.get_hivesense_sync_status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last block synced by HiveSense together with its timestamp.
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
            /** @description highest block number whose embeddings HiveSense has applied */
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
