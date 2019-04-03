const db = require("mongo-registry")
const SEARCH_IDX = "bfSearchIdx"
const ENV = require("./env")

module.exports = [
    {
        version: "1.0.4",
        log: "search full text index v1",
        script: () => db.col(ENV.DB_COLLECTION).createIndex(
            {"$**": "text"},
            {name: SEARCH_IDX, weights: {name: 100, path: 50}}
        )
    }
]