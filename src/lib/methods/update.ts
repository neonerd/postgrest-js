import axios from 'axios'

import {PostgrestJsConfig} from '../../index'
import {PostgrestJsFilterGroup, PostgrestJsFilterParam} from '../definitions'
import { generatePostgrestRequestHeaders, generatePostgrestFilterProperties } from '../util'

/**
 * Updates a model filtered by passed filters
 * @param model Model to update
 * @param filters An array of filter params or operations
 * @param payload Object with values to be updated
 * @param config Configuration object
 */
export function update (model: string, filters: Array<PostgrestJsFilterParam | PostgrestJsFilterGroup>, payload: any, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}`

    const requestParams: any = {}
    
    // Process filters
    const filterMap = generatePostgrestFilterProperties(filters)
    Object.keys(filterMap).map(key => {
        requestParams[key] = filterMap[key]
    })

    return axios.patch(path, payload, {
        params: requestParams,
        headers: generatePostgrestRequestHeaders(config)        
    })
    .then(res => {
        return {
            item: res.data
        }
    })
}

/**
 * Updates a model filtering by specified column value
 * @param model Model to update
 * @param column Column to filter the update by
 * @param columnValue Column value to filter the update by
 * @param payload Object with values to be updated
 * @param config Configuration object
 */
export function updateByColumn (model: string, column: any, columnValue: any, payload: any, config: PostgrestJsConfig) {
    return update(model, [
        {
            column: column,
            type: 'eq',
            value: columnValue
        }
    ], payload, config)
}

/**
 * Updates a model by id column
 * @param model Model to update
 * @param id Id of the row to update
 * @param payload Object with values to be updated
 * @param config Configuration object
 */
export function updateById (model: string, id: any, payload: any, config: PostgrestJsConfig) {
    return updateByColumn(model, 'id', id, payload, config)
}