var WorkSheet = require('../app/controllers/workSheet')

module.exports = function(app) {
	//get history
	app.get("/history",WorkSheet.history)
	//get historyLeft
	app.get("/historyOne",WorkSheet.historyOne)

	//get new workSheet 
	app.get("/workSheet",WorkSheet.new)
	// post save workSheet
	app.post("/workSheet/new",WorkSheet.save)
	// get list workSheet
	app.get('/list',WorkSheet.list)
	//get viewSheet
	app.get('/viewSheet/:id',WorkSheet.viewSheet)

	// ajax post recordUrl
	app.post('/record/:sessionid',WorkSheet.record)

	//admin delete workSheet
	app.delete('/admin/workSheet/list', WorkSheet.del)
}