const v = require("../validations")
const Router = require("express-blueforest").Router
const run = require("express-blueforest").run
const registry = require("mongo-registry")
const col = registry.col
const ENV = require("./../env")
const regexEscape = require("regex-escape")

const searchMixin = {
    projection: {
        searchType: 1, oid: 1, name: 1, date: 1, path: 1,
        g: 1, quantity: 1, cat: 1, stores: 1,
        type: 1,
        fragmentName: 1, leftName: 1,
        "fragment.name": 1, "leftSelection.name": 1, "rightSelection.name": 1, "equivSelection.name": 1
    }
}
const router = Router()

router.get("/api/search",
    v.validOptionalOid,
    v.validOptionalQ,
    v.validADate,
    v.optionnalPageSize,
    v.optionalValidQ,
    v.optionalValidG,
    v.optionnalAfterIdx,
    v.optionnalC0,
    v.optionnalC1,
    v.optionnalC2,
    v.optionnalC3,
    v.optionnalC4,
    run(({oid, g, q, aidx, adate, ps, c0, c1, c2, c3, c4}) => {

        const filter = {}

        if (oid !== undefined) filter.oid = oid
        if (q !== undefined) filter.$text = {$search:q}
        if (adate !== undefined) filter.date = {$lt: new Date(adate)}
        if (g !== undefined) filter["quantity.g"] = g
        if (oid !== undefined) filter.oid = oid
        if (c0 !== undefined) filter["cat.c0"] = c0
        if (c1 !== undefined) filter["cat.c1"] = c1
        if (c2 !== undefined) filter["cat.c2"] = c2
        if (c3 !== undefined) filter["cat.c3"] = c3
        if (c4 !== undefined) filter["cat.c4"] = c4
        if (aidx !== undefined) filter._id = {$lt: aidx}

        return col(ENV.DB_COLLECTION)
            .find(filter, searchMixin)
            .sort({date: -1})
            .limit(ps)
            .toArray()
    }),
)

module.exports = router