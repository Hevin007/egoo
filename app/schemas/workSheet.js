var mongoose =require('mongoose')

var WorkSheetSchema = new mongoose.Schema({
	tenantid: {
		type: String,
		default: 'admin'
	},
	agentid: {
		type: String,
		default: 'admin'
	},
	userid: {
		type: String,
		default: 'admin'
	},
	sessionid: {
		type: String,
		default: 'admin'
	},
	busType: String,
	busGroup: String,
	phone1: String,
	clientName: String,
	address: String,
	content: String,
	recordurl: String,
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

WorkSheetSchema.pre('save',function(next) {
	if(this.isNew) {
		this.meta.createdAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}
	next()
})

WorkSheetSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort({'meta.updateAt':-1})
			.exec(cb)
	},
	findById: function(id,cb) {
		return this
			.findOne({_id:id})
			.exec(cb)

	}
}

module.exports = WorkSheetSchema

