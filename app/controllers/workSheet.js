var _ = require('underscore')
var WorkSheet = require('../models/workSheet')

//连接mysql数据库读取录音url
var mysql = require('mysql')
var mysqlConfig = {
		host: '120.25.88.24',
		user: 'root',
		password: 'egoonetsql3466',
		database: 'egoo'
	}
//结束

exports.new = function(req,res) {
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
}

// post save workSheet
exports.save = function(req,res) {
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

				res.redirect('/history')
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
			res.redirect('/history')
		})
	}
	
}

// get list workSheet
exports.list = function(req,res) {
	WorkSheet.fetch(function(err,workSheets) {
		if (err) {
			console.log(err)
		}
		res.render('list',{
			title:'工单列表页',
			workSheets: workSheets
		});
		
	})
}

// ajax post recordUrl
exports.record = function(req,res) {
	var sessionid = req.params.sessionid
	//	 select recordurl where calluuid = sessionid
	var pool = mysql.createPool(mysqlConfig)
	pool.getConnection(function(err,connection) {
		if(err) {
			console.log("connect mysql database failed!")
		}else {
			var recordUrlSelectSql = 'SELECT recordurl FROM T_RECORD_INFO WHERE calluuid = ?'
			var params = [sessionid]
			connection.query(recordUrlSelectSql,params,function(err,result) {
				if(err) {
					console.log('recordurl SELECT err:'+err)
				}else {
					if(result.length>0) {
						res.json({
							recordUrl: result[0].recordurl,
							success: 1
						})
					}else{
						res.json({
							success: 0
						})
					}
				}
			})
			pool.end()
		//   回调 为异步，写在回调函数中
		}
		
	})
	
}

//get history
exports.history = function(req,res) {
	WorkSheet.fetch(function(err,workSheets) {
		if (err) {
			console.log(err)
		}
		res.render('history',{
			title:'咨询历史',
			workSheets: workSheets
		});
		
	})
}

exports.viewSheet = function(req,res) {
	var id = req.params.id
	WorkSheet.findById(id,function(err,workSheet) {
		res.render('viewSheet',{
			title:'工单详情',
			workSheet: workSheet
		});
	})
}