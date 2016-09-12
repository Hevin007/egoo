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

//app.locals.moment = require('moment')

app.listen(port);

console.log('egoo started on port '+port);
//require('./config/routes')(app)

app.get("/",function(req,res) {
	res.render('history',{title: '咨询历史'})
})
