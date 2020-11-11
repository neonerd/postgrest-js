
import pkg from './package.json';

export default {
    input: 'build/index.js', // our source file
    output: [
        {
        file: pkg.main,
        format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'es' // the preferred format
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
    ]
};