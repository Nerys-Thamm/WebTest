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
        db.CreateNewListing(req.body.title, req.body.description, req.body.price, req.body.image, req.user.id);
        res.redirect('/listings');
    }
    else{
        res.redirect('/signin');
    }
});

router.get('/listings/:id', (req, res, next) => {
    if (req.isAuthenticated()) {
        db.Listing.findOne({id: req.params.id}, (err, listing) => {
            if (err) {
                console.log(err);
            }
            else {
                db.Comment.find({listingid: req.params.id}, (err, comments) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.render('listing', { listing: listing, comments: comments, userid: req.user.username, loggedin: true, ismine: req.user.id === listing.userid });
                    }
                });
            }
        });
    }
    else{
        res.redirect('/signin');
    }
});

router.post('listings/:id/addcomment', (req, res, next) => {
    if (req.isAuthenticated()) {
        db.CreateNewComment(req.params.id, req.user.id, req.body.comment);
        res.redirect('/listings/' + req.params.id);
    }
    else{
        res.redirect('/signin');
    }
});

    
module.exports = router;

