const ENV = require("./env")
const registry = require("mongo-registry")
const startExpress = require("express-blueforest")
const dbRegistry = require("./dbRegistry")

const errorMapper = err => {
    if (err.code === 'bf404') {
        err.status = 404
        err.body = {errorCode: 4, message: "Introuvable."}
    }
}

module.exports = registry.dbInit(ENV, dbRegistry)
    .then(startExpress.default(ENV, errorMapper))
    .catch(e => console.error("BOOT ERROR\n",e))
