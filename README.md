# PostgREST.js

Heavy WIP, consider yourself warned.

## What is PostgREST.js?

PostgREST.js is a client library for consuming PostgREST APIs. It provides a set of functions and TypeScript interfaces to make your life easier when working with PostgREST in web browsers on Node.JS.

PostgREST.js is not an ORM, nor does it provide any specific entity mapping pattern. You have to provide types for your entities yourself.

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
