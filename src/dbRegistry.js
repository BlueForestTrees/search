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
    },
    {
        version: "1.0.5",
        log: "oid idx",
        script: () => db.col(ENV.DB_COLLECTION).createIndex(
            {oid: 1},
        )
    },
    {
        version: "1.0.5",
        log: "date idx",
        script: () => db.col(ENV.DB_COLLECTION).createIndex(
            {date: 1},
        )
    },
    {
        version: "1.0.5",
        log: "cat idx",
        script: () => db.col(ENV.DB_COLLECTION).createIndex(
            {cat: 1},
        )
    },
    {
        version: "1.0.6",
        log: "searchType idx",
        script: () => db.col(ENV.DB_COLLECTION).createIndex({searchType: 1})
    },
    {
        version: "1.0.6",
        log: "impact.impactId idx",
        script: () => db.col(ENV.DB_COLLECTION).createIndex({"impact.impactId": 1})
    },
    {
        version: "1.0.6",
        log: "facet.facetId idx",
        script: () => db.col(ENV.DB_COLLECTION).createIndex({"facet.facetId": 1})
    },
]