import {createConfig} from './index'

test('createConfig should return config', () => {
    const config = createConfig({
        endpoint: 'localhost:3000'
    })

    expect(config.endpoint).toBe('localhost:3000')
})