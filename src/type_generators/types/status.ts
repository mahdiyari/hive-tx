export interface paths {
  '/status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get status of all APIs
     * @description Returns the health status of all configured HAF API services
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
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              apps?: {
                /** @description API service name */
                name: string
                /** @description URL path for the API */
                url_path: string
                /** @description Version of the application */
                version: string
                /**
                 * @description Health status of the service
                 * @enum {string}
                 */
                status: 'healthy' | 'unhealthy' | 'unknown'
              }[]
            }
          }
        }
        /** @description Server error */
        500: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              error?: string
            }
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
  '/status/{app}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get status of specific API
     * @description Returns the health status of a specific HAF API service
     */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          /** @description API name (e.g., hivemind, hafah) */
          app: string
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              /** @description API service name */
              name: string
              /** @description URL path for the API */
              url_path: string
              /** @description Version of the application */
              version: string
              /**
               * @description Health status of the service
               * @enum {string}
               */
              status: 'healthy' | 'unhealthy' | 'unknown'
            }
          }
        }
        /** @description API not found */
        404: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              error?: string
            }
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
  schemas: never
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export type operations = Record<string, never>
