const path = require('path');
const express = require('express');
const router = express.Router();
const db = require ('./db/database');

var session;





router.get('/signup', (req, res, next) => {
    res.render('signup');
    
});
router.post('/signup', (req, res, next) => {
    db.CreateNewUser(req.body.username, req.body.email, req.body.password, req, res);
    res.redirect('/signin');
});
    

router.get('/signin', (req, res, next) => {
    res.render('signin');
    
    });

router.post('/signin', db.passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/signin"
}));


router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/signin');
});

router.get('/dashboard', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', { userid: req.user.id });
    }
    else{
        res.redirect('/signin');
    }
});

router.get('/profile', (req, res, next) => {
    
    if (req.isAuthenticated()) {
        res.render('profile', {userid: req.user.id});
    }
    else{
        res.redirect('/signin');
    }
});

    
module.exports = router;

