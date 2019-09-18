import axios from 'axios'

import {PostgrestJsConfig} from '../../index'
import {generatePostgrestRequestHeaders} from '../util'

export function create (model: string, payload: any, config: PostgrestJsConfig, upsert: boolean = false) {
    const path = `${config.endpoint}/${model}`
    const requestHeaders = generatePostgrestRequestHeaders(config)

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
    const requestHeaders = generatePostgrestRequestHeaders(config)

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