import axios from 'axios'
import {clone} from 'ramda'

jest.mock('axios')

import {createConfig} from '../../index'
import {get} from './get'

const testingData = [
    {id: 1, name: 'john'},
    {id: 2, name: 'mary'},
    {id: 3, name: 'karl'},
    {id: 4, name: 'karl'},
    {id: 5, name: 'karl'},
    {id: 6, name: 'karl'},
    {id: 7, name: 'karl'},
    {id: 8, name: 'karl'},
    {id: 9, name: 'karl'},
    {id: 10, name: 'karl'},
    {id: 11, name: 'karl'},
    {id: 12, name: 'karl'},
    {id: 13, name: 'karl'},
    {id: 14, name: 'karl'},
    {id: 15, name: 'karl'},
    {id: 16, name: 'karl'},
    {id: 17, name: 'karl'},
]

const testingResponse = {
    data: testingData,
    headers: {}
}

const postgrestConfig = createConfig({endpoint: 'localhost:3000'})

const axiosGetMockImplementation = (path: string, opts: any) => {
    if (path == 'localhost:3000/test') {
        const response: any = clone(testingResponse)

        // Select
        

        // Filtering

        // Ordering

        // Limit and Offset
        let limit = opts.params['limit'] || 10
        let offset = opts.params['offset'] || 0

        if (opts.headers['Prefer'] == 'count=exact') {
            response.headers['content-range'] = `${offset+1}-${offset+limit}/${testingData.length}`
        }

        response.data = response.data.slice(offset, offset+limit)

        return Promise.resolve(response)
    } 
    else {
        throw new Error('Axios Get Mock: Unknown endpoint!')
    }
}

test('should get data', () => { 
    //@ts-ignore
    axios.get.mockResolvedValue(testingResponse)

    return get('test', {
    }, postgrestConfig).then(res => {
        expect(res.items).toEqual(testingData)
    })
})

test('should get only one row if using fetch', () => {
    //@ts-ignore
    axios.get.mockResolvedValue(testingResponse)

    return get('test', {
        fetch: true
    }, postgrestConfig).then(res => {
        expect(res).toEqual(testingData[0])
    })
})

test('should use count-exact header when passing count', () => {
    //@ts-ignore
    axios.get.mockImplementation(axiosGetMockImplementation)

    return get('test', {
        count: true
    }, postgrestConfig).then(res => {
        expect(res.pagination.total).toEqual('17')
    })
})

test('should return only limited number of rows when using limit', () => {
    //@ts-ignore
    axios.get.mockImplementation(axiosGetMockImplementation)

    return get('test', {
        limit: 5
    }, postgrestConfig).then(res => {
        expect(res.items.length).toEqual(5)
    })
})

test('should return correcty offseted rows when using offset', () => {
    //@ts-ignore
    axios.get.mockImplementation(axiosGetMockImplementation)

    return get('test', {
        offset: 10
    }, postgrestConfig).then(res => {
        expect(res.items[0]).toEqual(testingData[10])
    })
})