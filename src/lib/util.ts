import { PostgrestJsConfig } from ".."
import { PostgrestJsFilterGroup, PostgrestJsFilterParam } from './definitions'

// ===
// === Typeguards
// ===
export function isString (v: any): v is string {
    return typeof v === 'string' || v instanceof String
}

export function isArray (v:any): v is Array<any> {
    return Array.isArray(v)
}

export function isPostgrestJsFilterGroup (v:any): v is PostgrestJsFilterGroup {
    return v.operation
}

// ===
// === Filters
// ===
function generatePostgrestFilterValue (filter: PostgrestJsFilterParam, namespace: boolean = false) {
    if (namespace) {
        return `${filter.column}.${filter.type}.${filter.value}`
    }

    return `${filter.type}.${filter.value}`
}

/**
 * This function processes an Array of filters (either params or and/or groups) and returns a string map
 * @param filters 
 */
export function generatePostgrestFilterProperties (filters: Array<PostgrestJsFilterParam | PostgrestJsFilterGroup>): { [s: string]: string; } {
    const props: { [s: string]: string; } = {}

    for (const f of filters) {
        // This is a group
        if (isPostgrestJsFilterGroup(f)) {
            props[f.operation] = `(${f.params.map(p => generatePostgrestFilterValue(p, true)).join(',')})`
        }
        // This is a simple parameter
        else {
            props[f.column] = generatePostgrestFilterValue(f)
        }
    }

    return props
}

// ===
// === Request Headers
// ===
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