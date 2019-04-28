/**
* postgrest.js
* JavaScript client for consuming PostgREST APIs
* Author: Andrej Sykora <as@andrejsykora.com>
* Repository:  https://github.com/neonerd/postgrest-js
*/
/**
 * Config interface
 * Used to store settings transferable between requests, immutable
 * When user's authorization context changes, we generate a new PostgrestJsConfig
 */
export interface PostgrestJsConfig {
    endpoint: string;
    authorizationToken?: string;
}
export interface PostgrestJsOrderParam {
    column: string;
    isDesc: boolean;
}
export interface PostgrestJsFilterParam {
    column: string;
    type: string;
    value: string;
}
export interface PostgrestJsGetParams {
    /**
     * Ordering.
     */
    order?: PostgrestJsOrderParam | string;
    /**
     * Select query.
     */
    select?: any;
    /**
     * Filters to be applied when getting data.
     */
    filters?: PostgrestJsFilterParam[];
    /**
     * Is this request supposed to directly retrieve only a single item from collection?
     */
    fetch?: boolean;
}
/**
 * Returns a valid PostgrestJsConfig object that can be used in all other functions
 * @param config Configuration parameters
 */
export declare function createConfig(config: PostgrestJsConfig): PostgrestJsConfig;
/**
 * Performs a GET request on a model in the API
 * @param model Name of the model
 * @param params Parameters of the request
 * @param config PostgrestJsConfig configuration object
 */
export declare function get(model: string, params: PostgrestJsGetParams, config: PostgrestJsConfig): Promise<any>;
export declare function create(model: string, payload: any, config: PostgrestJsConfig, upsert?: boolean): Promise<{
    item: any;
    headers: any;
}>;
export declare function createAndFetch(model: string, payload: any, config: PostgrestJsConfig, upsert?: boolean): Promise<any>;
export declare function update(model: string, id: any, payload: any, config: PostgrestJsConfig): Promise<{
    item: any;
}>;
export declare function removeById(model: string, id: any, config: PostgrestJsConfig): Promise<{
    item: any;
}>;
export declare function remove(model: string, filters: PostgrestJsFilterParam[], config: PostgrestJsConfig): Promise<{
    item: any;
}>;
export declare function rpc(name: string, payload: any, config: PostgrestJsConfig): Promise<{
    response: any;
    headers: any;
}>;
