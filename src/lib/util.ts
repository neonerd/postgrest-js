import { PostgrestJsConfig } from ".."

export function isString (v: any): v is string {
    return typeof v === 'string' || v instanceof String
}

export function isArray (v:any): v is Array<any> {
    return Array.isArray(v)
}

export function generatePostgrestRequestHeaders (config: PostgrestJsConfig): { [s: string]: string; } {
    const headers: { [s: string]: string; } = {}

    headers['X-Requested-With'] = 'PostgREST-JS'
    headers['Content-Type'] = 'application/json'

    // Optional parameters
    if (config.authorizationToken) {
        headers['Authorization'] = `Bearer ${config.authorizationToken}`
    }

    return headers
}