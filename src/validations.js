const objectNoEx = require("mongo-registry").objectNoEx
const v = require("express-validator/check")
const check = v.check
const searchTypes = ["trunk", "game", "info"]

const optionnalPageSize = [
    (req, res, next) => {
        if (!req.params.ps) {
            req.params.ps = 10
        }
        next()
    },
    check("ps").isInt({
        min: 1,
        max: 30
    }).withMessage(`must be an integer between 1 and 30 (default to ${10})`).toInt()
]
const number = chain => chain.exists().custom(v => !isNaN(Number.parseFloat(v))).withMessage("must be a valid number").customSanitizer(Number.parseFloat)
const validADate = check("adate").optional().isISO8601()
const validOptionalQ = check('q').optional().exists().isLength({min: 1, max: 30})
const mongoId = chain => chain.exists().isMongoId().withMessage("invalid mongo id").customSanitizer(objectNoEx)
const optionalMongoId = field => mongoId(check(field).optional())
const validMongoId = field => mongoId(check(field))
const validOptionalOid = validMongoId("oid").optional()
const optionnalAfterIdx = optionalMongoId("aidx")
const optionalValidQ = check('q').optional().exists()
const optionnalCat = optionalMongoId("cat")
const optionnalIid = optionalMongoId("iid")
const optionnalFid = optionalMongoId("fid")
const optionnalType = check("t").exists().isIn(searchTypes).optional()
const optionnalBqt = field => number(check(field)).optional()

module.exports = {optionnalPageSize, optionnalBqt, validADate, optionnalCat, optionnalType, mongoId, optionalMongoId, validMongoId, validOptionalQ, validOptionalOid, optionnalAfterIdx, optionnalFid, optionnalIid, optionalValidQ}