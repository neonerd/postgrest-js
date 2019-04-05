"use strict";
/**
* postgrest.js
* JavaScript client for consuming PostgREST APIs
* Author: Andrej Sykora <as@andrejsykora.com>
* Repository:
*/
exports.__esModule = true;
var axios_1 = require("axios");
var R = require("ramda");
function createConfig(config) {
    return config;
}
exports.createConfig = createConfig;
function get(model, params, config) {
    var path = config.endpoint + "/" + model;
    // === TODO; Handle other stuff
    var requestParams = R.pick(['order', 'select'], params);
    // === TODO: Handle vertical select
    // === TODO: Handle filtering
    if (params.filters) {
        params.filters.map(function (f) {
            requestParams[f.column] = f.type + "." + f.value;
        });
    }
    // === TODO: Handle order
    return axios_1["default"].get(path, {
        params: requestParams,
        headers: {
            'X-Requested-With': 'PostgREST-JS',
            'Authorization': config.authorizationToken ? "Bearer " + config.authorizationToken : false,
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
        if (params.fetch) {
            return res.data[0] ? res.data[0] : undefined;
        }
        return {
            items: res.data
        };
    });
}
exports.get = get;
function create(model, payload, config, upsert) {
    if (upsert === void 0) { upsert = false; }
    var path = config.endpoint + "/" + model;
    var requestHeaders = {
        'X-Requested-With': 'PostgREST-JS',
        'Authorization': "Bearer " + config.authorizationToken,
        'Content-Type': 'application/json'
    };
    // If we are upserting, we need to attach a special header
    if (upsert) {
        requestHeaders['Prefer'] = 'resolution=merge-duplicates';
    }
    return axios_1["default"].post(path, payload, {
        headers: requestHeaders
    })
        .then(function (res) {
        return {
            item: res.data,
            headers: res.headers
        };
    });
}
exports.create = create;
function createAndFetch(model, payload, config, upsert) {
    if (upsert === void 0) { upsert = false; }
    var requestHeaders = {
        'X-Requested-With': 'PostgREST-JS',
        'Authorization': "Bearer " + config.authorizationToken,
        'Content-Type': 'application/json'
    };
    return create(model, payload, config, upsert)
        .then(function (res) {
        var path = "" + config.endpoint + res.headers.location;
        return axios_1["default"].get(path, {
            headers: requestHeaders
        });
    })
        .then(function (res) {
        return res.data[0];
    });
}
exports.createAndFetch = createAndFetch;
function update(model, id, payload, config) {
    var path = config.endpoint + "/" + model + "?id=eq." + id;
    return axios_1["default"].patch(path, payload, {
        headers: {
            'X-Requested-With': 'PostgREST-JS',
            'Authorization': "Bearer " + config.authorizationToken,
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
        return {
            item: res.data
        };
    });
}
exports.update = update;
function removeById(model, id, config) {
    var path = config.endpoint + "/" + model + "?id=eq." + id;
    return axios_1["default"]["delete"](path, {
        headers: {
            'X-Requested-With': 'PostgREST-JS',
            'Authorization': "Bearer " + config.authorizationToken,
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
        return {
            item: res.data
        };
    });
}
exports.removeById = removeById;
function remove(model, filters, config) {
    var path = config.endpoint + "/" + model;
    var requestParams = {};
    filters.map(function (f) {
        requestParams[f.column] = f.type + "." + f.value;
    });
    return axios_1["default"]["delete"](path, {
        params: requestParams,
        headers: {
            'X-Requested-With': 'PostgREST-JS',
            'Authorization': "Bearer " + config.authorizationToken,
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
        return {
            item: res.data
        };
    });
}
exports.remove = remove;
function rpc(name, payload, config) {
    var path = config.endpoint + "/rpc/" + name;
    var requestHeaders = {
        'X-Requested-With': 'PostgREST-JS',
        'Authorization': "Bearer " + config.authorizationToken,
        'Content-Type': 'application/json'
    };
    return axios_1["default"].post(path, payload, {
        headers: requestHeaders
    })
        .then(function (res) {
        return {
            response: res.data,
            headers: res.headers
        };
    });
}
exports.rpc = rpc;
