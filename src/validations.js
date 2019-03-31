const objectNoEx = require("mongo-registry").objectNoEx
const v = require("express-validator/check")
const check = v.check
const grandeursKeys = ["PNOF", "PDF", "DALY", "CTUh", "CTUe", "Ene1", "Ene2", "Dens", "Nomb", "Volu", "Duré", "Mass", "Surf", "Long", "Pri1", "Pri2", "Tran"]


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
const validADate = check("adate").optional().isISO8601()
const validOptionalQ = check('q').optional().exists().isLength({min: 1, max: 30})
const mongoId = chain => chain.exists().isMongoId().withMessage("invalid mongo id").customSanitizer(objectNoEx)
const optionalMongoId = field => mongoId(check(field).optional())
const validMongoId = field => mongoId(check(field))
const validOptionalOid = validMongoId("oid").optional()
const optionnalAfterIdx = optionalMongoId("aidx")
const optionalValidQ = check('q').optional().exists()
const optionnalC0 = optionalMongoId("c0")
const optionnalC1 = optionalMongoId("c1")
const optionnalC2 = optionalMongoId("c2")
const optionnalC3 = optionalMongoId("c3")
const optionnalC4 = optionalMongoId("c4")
const grandeur = chain => chain.isIn(grandeursKeys).withMessage("should be Mass, Dens, Long, Tran...")
const optionalValidG = grandeur(check("g").optional())

module.exports = {optionnalPageSize, validADate, mongoId, optionalMongoId, validMongoId,validOptionalQ, validOptionalOid, optionnalAfterIdx, optionalValidQ, optionalValidG, optionnalC0, optionnalC1, optionnalC2, optionnalC3, optionnalC4}