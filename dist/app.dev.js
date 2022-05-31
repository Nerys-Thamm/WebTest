"use strict";

var http = require('http');

var express = require('express');

var bodyParser = require('body-parser');

var route = require('./route');

var app = express();

var sessions = require('express-session');

var cookieParser = require('cookie-parser');

app.use(sessions({
  secret: 'secret',
  saveUninitialized: true,
  cookie: {
    maxAge: 120000
  },
  resave: false
}));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/', route);
app.use(function (req, res, next) {
  res.redirect('/dashboard');
});
var server = http.createServer(app);
server.listen(3000, function () {
  console.log('Server is running on port 3000');
});