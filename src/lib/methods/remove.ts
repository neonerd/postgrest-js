import axios from 'axios'

import {PostgrestJsConfig} from '../../index'
import {PostgrestJsFilterGroup, PostgrestJsFilterParam} from '../definitions'
import {generatePostgrestRequestHeaders, generatePostgrestFilterProperties} from '../util'

export function remove (model: string, filters: Array<PostgrestJsFilterParam | PostgrestJsFilterGroup>, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}`

    const requestParams: any = {}
    
    // Process filters
    const filterMap = generatePostgrestFilterProperties(filters)
    Object.keys(filterMap).map(key => {
        requestParams[key] = filterMap[key]
    })

    return axios.delete(path, {
        params: requestParams,
        headers: generatePostgrestRequestHeaders(config)
    })
    .then(res => {
        return {
            item: res.data
        }
    })
}

// ===
// === Helpers functions
// ===
/**
 * Removes a specific model by column value
 * @param model 
 * @param column 
 * @param columnValue 
 * @param config 
 */
export function removeByColumn (model: string, column: string, columnValue: any, config: PostgrestJsConfig) {
    return remove(model, [
        {
            column: column,
            type: 'eq',
            value: columnValue
        }
    ], config)
}

/**
 * Removes a specific model by 'id' column
 * @param model 
 * @param id 
 * @param config 
 */
export function removeById (model: string, id: any, config: PostgrestJsConfig) {
    return removeByColumn(model, 'id', id, config)
}

