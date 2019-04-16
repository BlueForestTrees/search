const v = require("../validations")
const Router = require("express-blueforest").Router
const run = require("express-blueforest").run
const registry = require("mongo-registry")
const col = registry.col
const ENV = require("./../env")

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
    v.optionnalAfterIdx,
    v.optionnalCat,
    v.optionnalIid,
    v.optionnalFid,
    v.optionnalType,
    run(({oid, q, aidx, adate, ps, cat, iid, fid, t}) => {

        const filter = {}

        if (oid !== undefined) filter.oid = oid
        if (q !== undefined) filter.$text = {$search:q}
        if (adate !== undefined) filter.date = {$lt: new Date(adate)}
        if (oid !== undefined) filter.oid = oid
        if (cat !== undefined) filter.cats = cat
        if (aidx !== undefined) filter._id = {$lt: aidx}
        if (iid !== undefined) filter["impact.impactId"] = iid
        if (fid !== undefined) filter["facet.facetId"] = fid
        if (t !== undefined) filter.searchType = t

        return col(ENV.DB_COLLECTION)
            .find(filter, searchMixin)
            .sort({date: -1})
            .limit(ps)
            .toArray()
    }),
)

module.exports = router