import axios, { AxiosResponseHeaders } from 'axios'

import {PostgrestJsConfig} from '../../index'
import {generatePostgrestRequestHeaders} from '../util'

interface CreateReturn {
    item: any
    headers: AxiosResponseHeaders
}
export function create (model: string, payload: any, config: PostgrestJsConfig, upsert: boolean = false): Promise<CreateReturn> {
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
            headers: res.headers as AxiosResponseHeaders
        }
    })
}

export function createAndFetch (model: string, payload: any, config: PostgrestJsConfig, upsert: boolean = false) {
    const requestHeaders = generatePostgrestRequestHeaders(config)
    const path = `${config.endpoint}/${model}`

    requestHeaders['Prefer'] = 'return=representation'

    return axios.post(path, payload, {
        headers: requestHeaders
    })
    .then(res => {
        return res.data[0]
    })
}