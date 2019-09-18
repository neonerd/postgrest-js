import axios from 'axios'
import {pick} from 'ramda'

import {PostgrestJsConfig} from '../../index'
import {PostgrestJsOrderParam, PostgrestJsFilterParam} from '../definitions'
import {generatePostgrestRequestHeaders} from '../util'

// ===
// === DEFINITIONS
// ===
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

// ===
// === BASIC GET METHOD
// ===

/**
 * Performs a GET request on a model in the API
 * @param model Name of the model
 * @param params Parameters of the request
 * @param config PostgrestJsConfig configuration object
 */
export function get (model: string, params: PostgrestJsGetParams, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}`

    // === TODO; Handle other stuff
    const requestParams: any = pick(['order', 'select', 'limit', 'offset'], params)

    // === TODO: Handle vertical select

    // === TODO: Handle order

    // === TODO: Handle filtering
    if (params.filters) {
        params.filters.map((f: PostgrestJsFilterParam) => {
            requestParams[f.column] = `${f.type}.${f.value}`
        })
    }

    const requestHeaders = generatePostgrestRequestHeaders(config)

    if (params.count) {
        requestHeaders['Prefer'] = 'count=exact'
    }    
    
    return axios.get(path, {
        params: requestParams,
        headers: requestHeaders
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