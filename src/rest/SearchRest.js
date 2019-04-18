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
const searchMixinImpact = {projection: {...searchMixin.projection, "impact.$.impactId": 1}}
const searchMixinFacet = {projection: {...searchMixin.projection, "facet.$.facetId": 1}}
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
    v.optionnalBqt("ibqt"),
    v.optionnalBqt("fbqt"),
    run(({oid, q, aidx, adate, ps, cat, iid, fid, t, ibqt, fbqt}) => {
        let mixin = searchMixin
        const filter = {}

        if (oid !== undefined) filter.oid = oid
        if (q !== undefined) filter.$text = {$search: q}
        if (adate !== undefined) filter.date = {$lt: new Date(adate)}
        if (oid !== undefined) filter.oid = oid
        if (cat !== undefined) filter.cats = cat
        if (aidx !== undefined) filter._id = {$lt: aidx}
        if (iid !== undefined) {
            filter["impact.impactId"] = iid
            if (ibqt !== undefined && ibqt !== null) {
                mixin = searchMixinImpact
            }
        }
        if (fid !== undefined) {
            filter["facet.facetId"] = fid
            if (fbqt !== undefined && fbqt !== null) {
                mixin = searchMixinFacet
            }
        }
        if (t !== undefined) filter.searchType = t

        return col(ENV.DB_COLLECTION)
            .find(filter, mixin)
            .sort({date: -1})
            .limit(ps)
            .toArray()
            .then(trunks => trunks.map(t => {
                //on retourne un trunk pour 1 bqt de l'impact
                if (mixin === searchMixinImpact) {
                    t.quantity.bqt /= t.impact[0].bqt
                    delete t.impact
                    return t
                //on retourne un trunk pour 1 bqt du facet
                } else if (mixin === searchMixinFacet) {
                    t.quantity.bqt /= t.facet[0].bqt
                    delete t.facet
                    return t
                } else {
                    return t
                }
            }))
    }),
)

module.exports = router