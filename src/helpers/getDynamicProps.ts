import { config } from '../config.js'
import { callRPC } from './call.js'

/** Get dynamic props with a cache to speed up back to back transaction creations */
export const getDynamicGlobalProperties = async (cachePeriod = 2000) => {
  return callRPC('condenser_api.get_dynamic_global_properties', [], config.timeout, config.retry, {
    cacheTtl: cachePeriod
  })
}
