import axios from 'axios'

import {PostgrestJsConfig} from '../../index'
import { generatePostgrestRequestHeaders } from '../util'

export function rpc (name: string, payload: any, config: PostgrestJsConfig) {
    const path = `${config.endpoint}/rpc/${name}`
    const requestHeaders = generatePostgrestRequestHeaders(config)

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