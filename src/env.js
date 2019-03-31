const version = require('./../package.json').version
const debug = require('debug')('api:search')

const ENV = {
    NAME: process.env.NAME || "search-api",
    PORT: process.env.PORT || 80,

    REST_PATH: process.env.REST_PATH || "src/rest",

    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    DB_NAME: process.env.DB_NAME || "BlueForestTreesDB",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: process.env.DB_PORT || 27017,
    DB_USER: process.env.DB_USER || "doudou",
    DB_PWD: process.env.DB_PWD || "masta",
    DB_COLLECTION: process.env.DB_COLLECTION || "search",

    NODE_ENV: process.env.NODE_ENV || null,
    VERSION: version
}

if (debug.enabled) {
    debug({ENV})
} else {
    console.log(JSON.stringify(ENV))
}

module.exports = ENV