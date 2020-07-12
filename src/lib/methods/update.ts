import axios from 'axios'

import {PostgrestJsConfig} from '../../index'
import { generatePostgrestRequestHeaders } from '../util'

// update
export function update (model: string, id: any, payload: any, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/${model}?id=eq.${id}`

    return axios.patch(path, payload, {
        headers: generatePostgrestRequestHeaders(config)        
    })
    .then(res => {
        return {
            item: res.data
        }
    })
}

// updateBy
export function updateBy (model: string, property: any, propertyValue: any, payload: any, config: PostgrestJsConfig) {
    
}

// updateById
export function updateById (model: string, id: any, payload: any, config: PostgrestJsConfig) {

}