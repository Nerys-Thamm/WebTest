const path = require('path');
const express = require('express');
const router = express.Router();
const db = require ('./db/database');

var session;





router.get('/signup', (req, res, next) => {
    res.render('signup');
    
});
router.post('/signup', (req, res, next) => {
    db.createUser(new db.User(req.body.username, req.body.email, req.body.password, time, time));
    res.redirect('/signin');
});
    

router.get('/signin', (req, res, next) => {
    res.render('signin');
    
    });

router.post('/signin', (req, res, next) => {
    db.passport.authenticate(req.body.email, req.body.password);
    res.redirect('/dashboard');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/signin');
});

router.get('/dashboard', (req, res, next) => {
    session = req.session;
    if(session.userid)
    {
        res.render('dashboard', {userid: session.userid});
    }
    else{
        res.redirect('/signin');
    }
});

router.get('/profile', (req, res, next) => {
    session = req.session;
    if(session.userid)
    {
        res.render('profile', {userid: session.userid});
    }
    else{
        res.redirect('/signin');
    }
});


    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    
module.exports = {router, db};
