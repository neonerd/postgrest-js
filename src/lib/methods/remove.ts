import axios from 'axios'

import {PostgrestJsConfig} from '../../index'
import {PostgrestJsFilterParam} from '../definitions'
import {generatePostgrestRequestHeaders} from '../util'

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

    const requestParams: any = {}
    filters.map((f: PostgrestJsFilterParam) => {
        requestParams[f.column] = `${f.type}.${f.value}`
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