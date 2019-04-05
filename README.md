# PostgREST.js

Heavy WIP, consider yourself warned.

## What is PostgREST.js?

PostgREST.js is a client library for consuming PostgREST APIs. It does not try to be anything else, it simply provides a set of functions and TypeScript interfaces to make your life easier when working with PostgREST on the frontend. 

There is no ORM or any kind of advanced coding pattern used.

## Installation

```
npm install --save postgrest-js
```

## Usage

TypeScript / ES6

```
import {createConfig, get} from 'postgrest-js'

const config = createConfig({
    endpoint: 'https://api.example.com',
    authorizationToken: 'example'
})

async function foo () {
    const response = await get('customer', {}, config)
    console.log(response.items)
}
foo()
```
