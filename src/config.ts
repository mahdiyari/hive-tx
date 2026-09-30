/** Optional node probes. Empty disables healthchecks. */
export type HealthService = 'hived' | 'hivemind' | 'hafah'

/**
 * Configuration object for customizing hive-tx library behavior.
 * Modify these values to change the default node endpoints, timeout, and other settings.
 */
export const config = {
  /**
   * Array of Hive API node endpoints for load balancing and failover.
   * @default Array of multiple Hive API endpoints
   */
  nodes: [
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://api.openhive.network',
    'https://rpc.mahdiyari.info',
    'https://techcoderx.com',
    'https://hiveapi.actifit.io',
    'https://api.c0ff33a.uk'
  ],

  /**
   * Array Hive API node endpoints that support REST APIs
   * Note: Without the trailing /
   */
  restNodes: [
    'https://api.hive.blog',
    'https://rpc.mahdiyari.info',
    'https://techcoderx.com',
    'https://hiveapi.actifit.io',
    'https://api.c0ff33a.uk'
  ],

  /**
   * The Hive blockchain chain ID for transaction signing and verification.
   * @default Mainnet chain ID
   */
  chain_id: 'beeab0de00000000000000000000000000000000000000000000000000000000',

  /**
   * Address prefix used for public key formatting (STM for mainnet).
   * @default 'STM'
   */
  address_prefix: 'STM',

  /**
   * Timeout in milliseconds for individual API calls.
   * @default 10000
   */
  timeout: 10_000,

  /**
   * Number of retry attempts for failed API calls before throwing an error.
   * @default 8
   */
  retry: 8,

  /**
   * Services to probe before a node is selected.
   * Empty disables healthchecks, which is the default.
   * `hived` requires a recent head block.
   * `hivemind` requires `condenser_api.get_follow_count`.
   * `hafah` requires `condenser_api.get_account_history`.
   * @default []
   */
  healthchecks: [] as HealthService[],

  /**
   * How long a health result is reused, in milliseconds.
   * Also the background recheck period after healthchecks are enabled.
   * `0` checks on each call and does not start a timer.
   * @default 30000
   */
  healthcheckInterval: 30_000,

  /**
   * Maximum head-block age for the hived check, in milliseconds.
   * A node further ahead or behind than this fails the hived check.
   * @default 30000
   */
  healthcheckMaxLag: 30_000,

  /**
   * TTL for the local read cache, in milliseconds.
   * `0` disables caching in `callRPC`.
   * Transaction creation still passes its own TTL for dynamic global properties.
   * @default 2000
   */
  cacheTtl: 2_000,

  /**
   * JSON-RPC methods served from the local cache when `cacheTtl` is positive.
   * Add method names to cache other read-only calls.
   */
  cacheMethods: [
    'condenser_api.get_dynamic_global_properties',
    'database_api.get_dynamic_global_properties'
  ] as string[]
}
