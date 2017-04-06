var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Pruebas ECDSA

var crypto = require('crypto');
var algorithm = 'sha256';

var str = "hola que tal";
var msg = new Buffer(str, 'utf8');
hash = crypto.createHash(algorithm).update(msg).digest();

var security = require('./controllers/security.js');

// Hacia Android
// keypairSign = security.ecdsa.generateKeyPair();
// console.log(keypairSign.privateKey.buffer.toString('hex'))
// console.log(keypairSign.publicKey.buffer.toString('hex'))
//
// firma = keypairSign.privateKey.sign(hash, algorithm);
// console.log(firma.toString('hex'))
// valid = keypairSign.publicKey.verifySignature(hash, firma);
// console.log(valid)

// OK desde Android
publicSign = security.ecdsa.generarClavePublica("f12baac158ea9fe999e2026c0350dba6e1be157ce80d0436ae6b012d4cd7c7ec9bef16d170a391cf9c509b4229b01fd4bfbd76f011ef90671481ce837dcbe262");
console.log(publicSign.buffer.toString('hex'))
signature = new Buffer("3046022100A73ABDF6BA17E38E98B194FD0077E1C6B98EEEE8C76842513F8185D7869D39E0022100820B4806730908FCDBA239EC92CB154E23163420DF556E691A0EE2DBDE80465D", 'hex');
console.log(signature.toString('hex'));

valid = publicSign.verifySignature(hash, signature);
console.log(valid)

// Fin Pruebas ECDSA

// Mongo Database
mongoose.connect('mongodb://localhost/sectest');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
