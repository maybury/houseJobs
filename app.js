var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
var routes = require('./routes/index');
var users = require('./routes/users');
var manage = require('./routes/manage')
var app = express();
var Util = require('./public/javascripts/util.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/manage',manage)
app.use('/users', users);
mongodb_connection_string = 'mongodb://system:pass1@ds051990.mongolab.com:51990/housejobs';

mongoose.connect(mongodb_connection_string);
var db = mongoose.connection;
db.on('error', app.use(function(req,res,next){
    var err = new Error('Databse Connection Error');
    err.status = 500;
    res.render('error',{
        message: "Check DB Connection",
        error:err
    });
}));
db.once('open', function callback(){
    console.log('database connection confirmed');
    Util.RestoreReminderEvents();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/*By the way, here's the account info because fuck security:

GMAIL: ZPHouseJobs@gmail.com
password:TheSuperIsMe

MONGOLAB: ZPSuper
password: iamsuper1

Heroku: ZPHouseJobs@gmail.com

*/
module.exports = app;
