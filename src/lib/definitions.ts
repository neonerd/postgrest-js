export interface PostgrestJsOrderParam {
    column: string
    isDesc: boolean
}

export interface PostgrestJsFilterParam {
    column: string
    type: string
    value: string
}