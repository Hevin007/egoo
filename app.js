var express = require('express');
var path = require('path')
var mongoose = require('mongoose')
var port = process.env.PORT || 4000;
var app = express();
var bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var dbUrl = 'mongodb://localhost/egoo'
var logger = require('morgan')
var WorkSheet = require('./app/models/workSheet')

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl)

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({ extended: true }))  
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cookieSession({
	name: 'session',
	keys: ['key1','key2']
}))
app.use(express.static(path.join(__dirname,'public')))

app.locals.moment = require('moment')

app.listen(port);

console.log('egoo started on port '+port);
//require('./config/routes')(app)

app.get("/history",function(req,res) {
	res.render('history',{title: '咨询历史'})
})

app.get("/workSheet",function(req,res) {
	var phone1 = req.query.phone
	if(!phone1) {
		phone1=''
	}
	var tenantid = req.query.tenantid
	if(!tenantid) {
		tenantid='admin'
	}
	var agentid = req.query.agentid
	if(!agentid) {
		agentid='admin'
	}
	var userid = req.query.userid
	if(!userid) {
		userid='admin'
	}
	var sessionid = req.query.sessionid
	if(!sessionid) {
		sessionid='admin'
	}
	res.render('workSheet',
		{
			title: '工单信息',
			workSheet: {
				tenantid: tenantid,
				agentid: agentid,
				userid: userid,
				sessionid: sessionid,
				busType: '',
				busGroup: '',
				phone1: phone1,
				clientName: '',
				address: '',
				content: ''
			}
		})
})

app.post("/workSheet/new",function(req,res) {
	var id = req.body.workSheet._id
	var workSheetObj = req.body.workSheet
	var _workSheet

	if (id !== 'undefined') {
		WorkSheet.findById(id,function(err,workSheet) {
			if(err) {
				console.log(err)
			}

			_workSheet = _.extend(workSheet,workSheetObj)
			_workSheet.save(function(err,workSheet) {
				if(err) {
					console.log(err)
				}

				res.redirect('/list')
			})
		})
	}else {
		_workSheet = new WorkSheet({
			tenantid: workSheetObj.tenantid,
			agentid: workSheetObj.agentid,
			userid: workSheetObj.userid,
			sessionid: workSheetObj.sessionid,
			busType: workSheetObj.busType,
			busGroup: workSheetObj.busGroup,
			phone1: workSheetObj.phone1,
			clientName: workSheetObj.clientName,
			address: workSheetObj.address,
			content: workSheetObj.content
		})
		_workSheet.save(function (err,workSheet) {
			if(err) {
				console.log(err)
			}
			res.redirect('/list')
		})
	}
})


app.get('/list',function(req,res) {
	WorkSheet.fetch(function(err,workSheets) {
		if (err) {
			console.log(err)
		}
		res.render('list',{
			title:'工单列表页',
			workSheets: workSheets
		});
		
	})
})