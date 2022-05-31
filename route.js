const path = require('path');
const express = require('express');
const router = express.Router();
const db = require ('./db/database');

var session;





router.get('/signup', (req, res, next) => {
    res.render('signup', { loggedin: false });
    
});
router.post('/signup', (req, res, next) => {
    db.CreateNewUser(req.body.username, req.body.email, req.body.password, req, res);
    res.redirect('/signin');
});
    

router.get('/signin', (req, res, next) => {
    res.render('signin', { loggedin: false });
    
    });

router.post('/signin', db.passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/signin"
}));


router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


router.get('/dashboard', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', { userid: req.user.username, loggedin: true });
    }
    else{
        res.redirect('/signin');
    }
});

router.get('/profile', (req, res, next) => {
    
    if (req.isAuthenticated()) {
        res.render('profile', { userid: req.user.username, loggedin: true });
    }
    else{
        res.redirect('/signin');
    }
});

router.get('/listings', (req, res, next) => {
    if (req.isAuthenticated()) { 
        db.Listing.find({}, (err, listings) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render('listings', { listings: listings, userid: req.user.username, loggedin: true });
            }
        });
    }
    else{
        res.redirect('/signin');
    }
});

router.get('/listings/new', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('new', { userid: req.user.username, loggedin: true });
    }
    else{
        res.redirect('/signin');
    }
});

router.post('/listings/new', (req, res, next) => {
    if (req.isAuthenticated()) {
        db.CreateNewListing(req.body.title, req.body.description, req.body.price, req.body.images, req.user.id);
        res.redirect('/listings');
    }
    else{
        res.redirect('/signin');
    }
});

    
module.exports = router;

