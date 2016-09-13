var mongoose = require('mongoose')
var WorkSheetSchema = require('../schemas/workSheet')
var WorkSheet = mongoose.model('WorkSheet',WorkSheetSchema)

module.exports = WorkSheet