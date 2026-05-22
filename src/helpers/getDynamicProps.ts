import { callRPC } from './call.js'

let cache: any
let cacheTime = 0

/** Get dynamic props with a cache to speedup back to back transaction creations */
export const getDynamicGlobalProperties = async (cachePeriod = 2000) => {
  const now = Date.now()
  if (now - cacheTime <= cachePeriod && cache) {
    return cache
  }
  cache = await callRPC('condenser_api.get_dynamic_global_properties', [])
  cacheTime = now
  return cache
}
