var _ = require('underscore')
var mysql = require('mysql')
var WorkSheet = require('../models/workSheet')
var fs = require("fs")


exports.new = function(req,res) {


	var tenantid = req.query.tenantid
	if(!tenantid) {
		tenantid=''
	}
	var agentid = req.query.agentid
	if(!agentid) {
		agentid=''
	}
	var userid = req.query.userid
	if(!userid) {
		userid=''
	}
	var sessionid = req.query.sessionid
	if(!sessionid) {
		sessionid=''
	}
	var phone1 = userid


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

				res.redirect("/history")
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
			res.redirect("/history?userid="+workSheetObj.userid
					+"&tenantid="+workSheetObj.tenantid)
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
			workSheets: workSheets,
			path: require.main.filename
		});
		
	})
}

//list delete workSheet
exports.del = function(req,res) {
	var id= req.query.id
	if(id) {
		WorkSheet.remove({_id: id},function(err,workSheet) {
			if (err) {
				console.log(err)
			}
			else  {
				res.json({success: 1})
			}
		})
	}
}

// ajax post recordUrl
exports.record = function(req,res) {
	//读取配置文件
	var recordDBJson = ''
	try {
		var data = fs.readFileSync('./config/recordDatabase.json')
		recordDBJson = JSON.parse(data)
	}catch(err) {
		console.log(err)
	}

	var recordConfig = recordDBJson[recordDBJson.default]


	var sessionid = req.params.sessionid
	//	 select recordurl where calluuid = sessionid
	var pool = mysql.createPool(recordConfig)
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

	var tenantid = req.query.tenantid
	if(!tenantid) {
		tenantid=''
	}
	var agentid = req.query.agentid
	if(!agentid) {
		agentid=''
	}
	var sessionid = req.query.sessionid
	if(!sessionid) {
		sessionid=''
	}
	var phone1 = req.query.phone1
	if(!phone1) {
		phone1=''
	}

	var userid = req.query.userid
	var btnFlag = req.query.btnFlag
	if(!btnFlag) {
		btnFlag = 0;
	}


	if(!userid) {
		res.render('error',{
			title: "no userid",
			warning: "等待接通电话..." 
		})
	}else {
		WorkSheet
			.find({userid: userid,tenantid: tenantid})
			.limit(20)
			.sort({'meta.updateAt':-1})
			.exec(function(err,workSheets) {

				if (err) {
					console.log(err)
				}
				res.render('history',{
					title:'咨询历史',
					tenantid: tenantid,
					agentid: agentid,
					sessionid: sessionid,
					phone1: phone1,
					userid: userid,
					btnFlag: btnFlag,
					workSheets: workSheets
				});	
			})
		}
}

//get historyOne
exports.historyOne = function(req,res) {

	var tenantid = req.query.tenantid
	if(!tenantid) {
		tenantid=''
	}

	var agentid = req.query.agentid

	if(!agentid) {
		res.render('error',{
			title: "no agentid",
			warning: "请签入..." 
		})
	}else {
		WorkSheet
			.find({agentid: agentid,tenantid: tenantid})
			.limit(20)
			.sort({'meta.updateAt':-1})
			.exec(function(err,workSheets) {
				if (err) {
					console.log(err)
				}
				res.render('historyOne',{
					title:'咨询历史',
					tenantid: tenantid,
					agentid: agentid,
					workSheets: workSheets
				});
			})
	}
}


//get viewSheet
exports.viewSheet = function(req,res) {
	var id = req.params.id
	WorkSheet.findById(id,function(err,workSheet) {
		res.render('viewSheet',{
			title:'工单详情',
			workSheet: workSheet
		});
	})
}