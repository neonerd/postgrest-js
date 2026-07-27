export interface PostgrestJsOrderParam {
    column: string
    isDesc?: boolean
}

export interface PostgrestJsFilterParam {
    column: string
    type: string
    value: string
}

export interface PostgrestJsFilterGroup {
    operation: 'and' | 'or'
    params: PostgrestJsFilterParam[]
}

/**
 * Type of count PostgREST should perform when returning the Content-Range header.
 * See https://docs.postgrest.org/en/latest/references/api/pagination_count.html
 */
export type PostgrestJsCountParam = 'exact' | 'planned' | 'estimated'

export interface PostgrestJsSelectParam {
    identifier: string
    children: string[] | PostgrestJsSelectParam[]
    alias?: string    
}