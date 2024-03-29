"use strict";

var path = require('path');

var express = require('express');

var router = express.Router();

var sqlite3 = require('sqlite3').verbose();

var session;
var db = new sqlite3.Database(path.join(__dirname, '/db/database.db'), function (err) {
  if (err) {
    console.error(err.message);
  }

  console.log('Connected to the database.');
});
router.get('/signup', function (req, res, next) {
  res.render('signup');
});
router.post('/signup', function (req, res, next) {
  var db = new sqlite3.Database(path.join(__dirname, '/db/database.db'));
  db.all('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, req.body.password], function (err) {
    if (err) {
      console.error(err.message);
    }

    console.log('A row has been inserted.');
  });
  db.close();
  res.redirect('/signin');
});
router.get('/signin', function (req, res, next) {
  res.render('signin');
});
router.post('/signin', function (req, res, next) {
  var db = new sqlite3.Database(path.join(__dirname, '/db/database.db'));
  db.get('SELECT password FROM users WHERE username = ?', [req.body.username], function (err, row) {
    if (err) {
      console.error(err.message);
    }

    if (row) {
      if (row.password == req.body.password) {
        session = req.session;
        session.userid = req.body.username;
        console.log(req.session);
        res.redirect('/dashboard');
      } else {
        res.send('Wrong password');
      }
    } else {
      res.redirect('/signup');
    }
  });
  db.close();
});
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/signin');
});
router.get('/dashboard', function (req, res, next) {
  session = req.session;

  if (session.userid) {
    res.render('dashboard', {
      userid: session.userid
    });
  } else {
    res.redirect('/signin');
  }
});
router.get('/profile', function (req, res, next) {
  session = req.session;

  if (session.userid) {
    res.render('profile', {
      userid: session.userid
    });
  } else {
    res.redirect('/signin');
  }
});
db.close(function (err) {
  if (err) {
    console.error(err.message);
  }

  console.log('Close the database connection.');
});
module.exports = router;