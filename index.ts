/**
* postgrest.js
* JavaScript client for consuming PostgREST APIs
* Author: Andrej Sykora <as@andrejsykora.com>
* Repository:  https://github.com/neonerd/postgrest-js
*/

import axios from 'axios'
import * as R from 'ramda'

/**
 * Config interface
 * Used to store settings transferable between requests, immutable
 * When user's authorization context changes, we generate a new PostgrestJsConfig
 */
export interface PostgrestJsConfig {
    endpoint: string
    authorizationToken?: string
}

export interface PostgrestJsOrderParam {
    column: string
    isDesc: boolean
}

export interface PostgrestJsFilterParam {
    column: string
    type: string
    value: string
}

export interface PostgrestJsGetParams {
    /**
     * Ordering.
     */
    order?: PostgrestJsOrderParam | string
    /**
     * Select query.
     */
    select?: any
    /**
     * Filters to be applied when getting data.
     */
    filters?: PostgrestJsFilterParam[]
    /**
     * Is this request supposed to directly retrieve only a single item from collection?
     */
    fetch?: boolean
    /**
     * Are we counting all the records?
     */
    count?: boolean
}

/**
 * Returns a valid PostgrestJsConfig object that can be used in all other functions
 * @param config Configuration parameters
 */
export function createConfig (config: PostgrestJsConfig) {
    return config
}

/**
 * Performs a GET request on a model in the API
 * @param model Name of the model
 * @param params Parameters of the request
 * @param config PostgrestJsConfig configuration object
 */
export function get (model: string, params: PostgrestJsGetParams, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}`

    // === TODO; Handle other stuff
    const requestParams = R.pick(['order', 'select', 'limit', 'offset'], params)

    // === TODO: Handle vertical select

    // === TODO: Handle order

    // === TODO: Handle filtering
    if (params.filters) {
        params.filters.map((f: PostgrestJsFilterParam) => {
            requestParams[f.column] = `${f.type}.${f.value}`
        })
    }

    const headers = {
        'X-Requested-With': 'PostgREST-JS',
        'Authorization': config.authorizationToken ? `Bearer ${config.authorizationToken}` : false,
        'Content-Type': 'application/json'
    }

    if (params.count) {
        headers['Prefer'] = 'count=exact'
    }    
    
    return axios.get(path, {
        params: requestParams,
        headers
    })
    .then(res => {
        if (params.fetch) {
            return res.data[0] ? res.data[0] : undefined
        }

        return {
            items: res.data,
            pagination: {
                total: res.headers['content-range'] ? res.headers['content-range'].split('/')[1] : undefined
            }
        }
    })
}

export function create (model: string, payload: any, config: PostgrestJsConfig, upsert: boolean = false) {
    const path = `${config.endpoint}/${model}`
    const requestHeaders = {
        'X-Requested-With': 'PostgREST-JS',
        'Authorization': `Bearer ${config.authorizationToken}`,
        'Content-Type': 'application/json'
    }

    // If we are upserting, we need to attach a special header
    if (upsert) {
        requestHeaders['Prefer'] = 'resolution=merge-duplicates'
    }

    return axios.post(path, payload, {
        headers: requestHeaders
    })
    .then(res => {
        return {
            item: res.data,
            headers: res.headers
        }
    })
}

export function createAndFetch (model: string, payload: any, config: PostgrestJsConfig, upsert: boolean = false) {
    const requestHeaders = {
        'X-Requested-With': 'PostgREST-JS',
        'Authorization': `Bearer ${config.authorizationToken}`,
        'Content-Type': 'application/json'
    }

    return create(model, payload, config, upsert)
        .then(res => {
            const path = `${config.endpoint}${res.headers.location}`
            return axios.get(path, {
                headers: requestHeaders
            })
        })
        .then(res => {
            return res.data[0]
        })
}

export function update (model: string, id: any, payload: any, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}?id=eq.${id}`

    return axios.patch(path, payload, {
        headers: {
            'X-Requested-With': 'PostgREST-JS',
            'Authorization': `Bearer ${config.authorizationToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        return {
            item: res.data
        }
    })
}

export function removeById (model: string, id: any, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}?id=eq.${id}`

    return axios.delete(path, {
        headers: {
            'X-Requested-With': 'PostgREST-JS',
            'Authorization': `Bearer ${config.authorizationToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        return {
            item: res.data
        }
    })
}

export function remove (model: string, filters: PostgrestJsFilterParam[], config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}`

    const requestParams = {}
    filters.map((f: PostgrestJsFilterParam) => {
        requestParams[f.column] = `${f.type}.${f.value}`
    })

    return axios.delete(path, {
        params: requestParams,
        headers: {
            'X-Requested-With': 'PostgREST-JS',
            'Authorization': `Bearer ${config.authorizationToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        return {
            item: res.data
        }
    })
}

export function rpc (name: string, payload: any, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/rpc/${name}`
    const requestHeaders = {
        'X-Requested-With': 'PostgREST-JS',
        'Authorization': `Bearer ${config.authorizationToken}`,
        'Content-Type': 'application/json'
    }

    return axios.post(path, payload, {
        headers: requestHeaders
    })
    .then(res => {
        return {
            response: res.data,
            headers: res.headers
        }
    })
}