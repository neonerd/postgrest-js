import { PostgrestJsConfig } from ".."

export function generatePostgrestRequestHeaders (config: PostgrestJsConfig): { [s: string]: string; } {
    const headers: { [s: string]: string; } = {}

    headers['X-Requested-With'] = 'PostgREST-JS'
    headers['Content-Type'] = 'application/json'

    headers['Authorization'] = `Bearer ${config.authorizationToken}`

    return headers
}