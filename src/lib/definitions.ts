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

export interface PostgrestJsSelectParam {
    identifier: string
    children: string[] | PostgrestJsSelectParam[]
    alias?: string    
}