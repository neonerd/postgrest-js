/**
* postgrest.js
* JavaScript client for consuming PostgREST APIs
* Author: Andrej Sykora <as@andrejsykora.com>
* Repository:  https://github.com/neonerd/postgrest-js
*/

/**
 * Config interface
 * Used to store settings transferable between requests, immutable
 * When user's authorization context changes, we generate a new PostgrestJsConfig
 */
export interface PostgrestJsConfig {
    endpoint: string
    authorizationToken?: string
}

/**
 * Returns a valid PostgrestJsConfig object that can be used in all other functions
 * @param config Configuration parameters
 */
export function createConfig (config: PostgrestJsConfig) {
    return config
}

import { get } from './lib/methods/get'
import { create, createAndFetch } from './lib/methods/create'
import { update } from './lib/methods/update'
import { remove, removeById } from './lib/methods/remove'
import { rpc } from './lib/methods/rpc'

export default {
    get,
    create,
    createAndFetch,
    update,
    remove,
    removeById,
    rpc
}

