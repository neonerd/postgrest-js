import axios from 'axios'
import {pick} from 'ramda'
import * as qs from 'qs'

import {PostgrestJsConfig} from '../../index'
import {PostgrestJsOrderParam, PostgrestJsFilterParam, PostgrestJsSelectParam} from '../definitions'
import {generatePostgrestRequestHeaders, isString, isArray} from '../util'

// ===
// === DEFINITIONS
// ===
export interface PostgrestJsGetParams {
    /**
     * Ordering.
     */
    order?: PostgrestJsOrderParam | PostgrestJsOrderParam[] | string | string[]
    /**
     * Vertical select query, can be either passed as raw string or an array of strings (e.g. ['*', 'foo(*)', 'bar(a,b)'])
     */
    select?: PostgrestJsSelectParam | string[] | string
    /**
     * Filters to be applied when getting data.
     * Can be passed either as a simple string or as an array of PostgrestJsFilterParam objects.
     */
    filters?: PostgrestJsFilterParam[] | string
    /**
     * Are we counting all the records?
     */
    count?: boolean
    /**
     * Pagination
     */
    limit?: number
    offset?: number
}

export interface PostgrestJsGetWithFetchParams extends PostgrestJsGetParams {
    /**
     * Is this request supposed to directly retrieve only a single item from collection?
     */
    fetch: boolean
}

export interface PostgrestJsGetResponsePagination {
    total?: number
}

export interface PostgrestJsGetResponse<T> {
    items: T[],
    pagination: PostgrestJsGetResponsePagination
}

/**
 * Typeguard function that distinguishes PostgrestJsGetWithFetchParams object
 * @param o 
 */
function isPostgrestJsGetWithFetchParams (o: any): o is PostgrestJsGetWithFetchParams {
    return o.fetch
}

/**
 * Typeguard function that distinguishes PostgrestJsSelectParam object
 * @param o 
 */
function isPostgrestJsSelectParam (o: any): o is PostgrestJsSelectParam {
    return !!o.identifier
}

/**
 * Typeguard function that distinguishes PostgrestJsOrderParam object
 * @param o 
 */
function isPostgrestJsOrderParam (o: any): o is PostgrestJsOrderParam {
    return !!o.column
}

/**
 * Transforms a PostgrestJsSelectParam into its PostgREST-readable string representation
 * @param p 
 */
function transformPostgrestJsSelectParamToString (p: PostgrestJsSelectParam | string): string {
    if (isPostgrestJsSelectParam(p)) {
        // Parse the children recursively
        const childrenStr: string[] = []
        for (const cp of p.children) {
            childrenStr.push(transformPostgrestJsSelectParamToString(cp))
        }
        // Final string
        const finalStr = [
            p.alias ? `${p.alias}:` : '',
            p.identifier,
            '(',
            childrenStr.join(','),
            ')'
        ]
        // Return
        return finalStr.join('')
    } else {
        return `${p}`
    }
}

// ===
// === MAIN GET METHOD
// ===

/**
 * Performs a GET request on a model in the API
 * @param model Name of the model
 * @param params Parameters of the request
 * @param config PostgrestJsConfig configuration object
 */
export function get <T=any> (model: string, params: PostgrestJsGetWithFetchParams, config: PostgrestJsConfig): Promise<T | undefined>;
export function get <T=any> (model: string, params: PostgrestJsGetParams, config: PostgrestJsConfig): Promise<PostgrestJsGetResponse<T>>;
export function get (model: string, params: PostgrestJsGetWithFetchParams | PostgrestJsGetParams, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}`

    // === Handle simple params that are just passed into request
    // Currently handled params: limit, offset
    const requestParams: any = pick(['limit', 'offset'], params)

    // Handle filtering
    if (params.filters) {
        if (isArray(params.filters)) {
            params.filters.map((f: PostgrestJsFilterParam) => {
                requestParams[f.column] = `${f.type}.${f.value}`
            })
        } 
        // We need to parse string param to inject it into requestParams
        else {
            const parsedFilterParam = qs.parse(params.filters)
            Object.assign(requestParams, parsedFilterParam)
        }
    }

    // Handle vertical select
    if (params.select) {
        if (isArray(params.select)) {
            const selectParams: string[] = []

            // Build the select params string by parsing each array element
            params.select.map(p => {
                if (isPostgrestJsSelectParam(p)) {
                    selectParams.push(transformPostgrestJsSelectParamToString(p))
                } else {
                    selectParams.push(p)
                }
            })

            requestParams['select'] = selectParams.join(',')
        } else {
            requestParams['select'] = params.select
        }
    }

    // Handle ordering
    if (params.order) {
        const orderStrParts = []

        if (isArray(params.order)) {
            for (const e of params.order) {
                if (isPostgrestJsOrderParam(e)) {
                    orderStrParts.push(`${e.column}.${e.isDesc ? 'desc' : 'asc'}`)
                } else {
                    orderStrParts.push(e)
                }
            }
        } else {
            if (isPostgrestJsOrderParam(params.order)) {
                orderStrParts.push(`${params.order.column}.${params.order.isDesc ? 'desc' : 'asc'}`)
            } else {
                orderStrParts.push(params.order)
            }
        }        

        requestParams['order'] = orderStrParts.join(',')
    }
    
    // === Create headers
    const requestHeaders = generatePostgrestRequestHeaders(config)

    // === Add exact count header if requested
    if (params.count) {
        requestHeaders['Prefer'] = 'count=exact'
    }    
    
    return axios.get(path, {
        params: requestParams,
        headers: requestHeaders
    })
    .then(res => {
        // If fetch was passed, return first record or undefined
        if (isPostgrestJsGetWithFetchParams(params)) {
            return (res.data[0] ? res.data[0] : undefined)
        }

        // Otherwise, return collection of items
        return {
            items: res.data,
            pagination: {
                total: res.headers['content-range'] ? res.headers['content-range'].split('/')[1] : undefined
            }
        }
    })
}

// ===
// === HELPER METHODS
// ===

/**
 * A shortcut to fetch only one row from model. Always returns either the row or undefined.
 * @param model 
 * @param property 
 * @param propertyValue 
 * @param config 
 */
export function fetch <T=any> (model: string, column: string, columnValue: string, config: PostgrestJsConfig): Promise<T | undefined> {
    return get<T>(model, {
        fetch: true,
        filters: [
            {column: column, type: 'eq', value: columnValue}
        ]
    }, config)
}

/**
 * A shortcut to fetch only one row from model by the "id" column. Always returns either the row or undefined.
 * @param model 
 * @param id 
 * @param config 
 */
export function fetchById <T=any> (model: string, id: string, config: PostgrestJsConfig): Promise<T | undefined> {
    return fetch<T>(model, 'id', id, config)
}