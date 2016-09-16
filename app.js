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

//连接mysql数据库读取录音url
var mysql = require('mysql')
var mysqlConfig = {
		host: '120.25.88.24',
		user: 'root',
		password: 'egoonetsql3466',
		database: 'egoo'
	}
//结束

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
		userid=''
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
	
//	 select recordurl where calluuid = sessionid
	// var mysqlConn = mysql.createConnection(mysqlConfig)
	// mysqlConn.connect();
	// var recordUrlSelectSql = 'SELECT recordurl FROM T_RECORD_INFO WHERE calluuid = ?'
	// var params = [workSheetObj.sessionid]
	// mysqlConn.query(recordUrlSelectSql,params,function(err,result) {
	// 	if(err) {
	// 		console.log('recordurl SELECT err:'+err)
	// 	}
	// 	var recordurl = result[0].recordurl

		
	// })
	// mysqlConn.end()
	
//   nodejs 为异步，写在回调函数中

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
			content: workSheetObj.content,
			recordurl: ''
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

app.post('/record/:sessionid',function(req,res) {
	var sessionid = req.params.sessionid
	//	 select recordurl where calluuid = sessionid
	var mysqlConn = mysql.createConnection(mysqlConfig)
	mysqlConn.connect();
	var recordUrlSelectSql = 'SELECT recordurl FROM T_RECORD_INFO WHERE calluuid = ?'
	var params = [sessionid]
	mysqlConn.query(recordUrlSelectSql,params,function(err,result) {
		if(err) {
			console.log('recordurl SELECT err:'+err)
		}
		if(result[0]) {
			res.json({
				recordUrl: result[0].recordurl,
				success: 1
			})
		}else{
			res.json({
				success: 0
			})
		}

	})
	mysqlConn.end()
	
//   nodejs 为异步，写在回调函数中
})