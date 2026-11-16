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
    'https://api.c0ff33a.uk',
    'https://api.syncad.com'
  ],

  /**
   * Array Hive API node endpoints that support REST APIs -
   * **Note**: Without the trailing /
   */
  restNodes: [
    'https://rpc.mahdiyari.info',
    'https://api.syncad.com',
    'https://api.hive.blog',
    'https://api.openhive.network',
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
  retry: 8
}
