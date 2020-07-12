import {createConfig} from '../index'
import {generatePostgrestRequestHeaders} from './util'

test('generatePostgrestRequestHeaders should use passed authorization token', () => {
    const config = createConfig({
        endpoint: 'localhost:3000',
        authorizationToken: 'test'
    })

    const headers = generatePostgrestRequestHeaders(config)
    expect(headers['Authorization']).toBe('Bearer test')
})