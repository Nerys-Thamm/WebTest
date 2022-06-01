/*
 * Bachelor of Software Engineering
 * Media Design School
 * Auckland
 * New Zealand
 * 
 * (c) 2022 Media Design School
 * 
 * File Name: route.js
 * Description: 
 * Author: Nerys Thamm
 * Mail: nerysthamm@gmail.com
 */

const path = require('path');
const express = require('express');
const router = express.Router();
const db = require ('./db/database');
const { Console } = require('console');

var session;

//-----------------------------------------------------------
// signup - GET
//-----------------------------------------------------------
router.get('/signup', (req, res, next) => {
    res.render('signup', { loggedin: false });
});

//-----------------------------------------------------------
// signup - POST
//-----------------------------------------------------------
router.post('/signup', (req, res, next) => {
    db.CreateNewUser(req.body.username, req.body.email, req.body.password, req, res);
});
    
//-----------------------------------------------------------
// login - GET
//-----------------------------------------------------------
router.get('/signin', (req, res, next) => {
    res.render('signin', { loggedin: false });
});

//-----------------------------------------------------------
// login - POST
//-----------------------------------------------------------
router.post('/signin', db.passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/signin"
}));

//-----------------------------------------------------------
// logout - GET
//-----------------------------------------------------------
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

//-----------------------------------------------------------
// dashboard - GET
//-----------------------------------------------------------
router.get('/dashboard', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', { userid: req.user.username, loggedin: true });
    }
    else{
        res.redirect('/signin');
    }
});

//-----------------------------------------------------------
// profile - GET
//-----------------------------------------------------------
router.get('/profile', (req, res, next) => {
    
    if (req.isAuthenticated()) {
        res.render('profile', { userid: req.user.username, loggedin: true });
    }
    else{
        res.redirect('/signin');
    }
});

//-----------------------------------------------------------
// listings - GET : Displays all listings
//-----------------------------------------------------------
router.get('/listings', (req, res, next) => {
    if (req.isAuthenticated()) { 
        db.Listing.find({}, (err, listings) => { //find all listings
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

//-----------------------------------------------------------
// listings/new - GET : Displays the form for creating a new listing
//-----------------------------------------------------------
router.get('/listings/new', (req, res, next) => {//get the form for creating a new listing
    if (req.isAuthenticated()) {
        res.render('new', { userid: req.user.username, loggedin: true });
    }
    else{
        res.redirect('/signin');
    }
});

//-----------------------------------------------------------
// listings - POST : Creates a new listing
//-----------------------------------------------------------
router.post('/listings', (req, res, next) => {//create a new listing
    if (req.isAuthenticated()) {
        db.CreateNewListing(req.body.title, req.body.description, req.body.smalldescription, req.body.price, req.body.images, req.user.id, req.user.username);
        res.redirect('/listings');
    }
    else{
        res.redirect('/signin');
    }
});

//-----------------------------------------------------------
// listings/:id - GET : Displays the details of a listing
//-----------------------------------------------------------
router.get('/listings/:id', (req, res, next) => {//get the details of a listing
    if (req.isAuthenticated()) {
        db.Listing.findOne({id: req.params.id}, (err, listing) => {//find the listing
            if (err) {
                console.log(err);
            }
            else {
                res.render('listing', { listing: listing, userid: req.user.username, loggedin: true, ismine: req.user.id === listing.userid }); 
            }
        });
    }
    else{
        res.redirect('/signin');
    }
});

//-----------------------------------------------------------
// listings/:id - DELETE : Deletes a listing
//-----------------------------------------------------------
router.delete('/listings/:id', (req, res, next) => {//delete a listing
    if (req.isAuthenticated()) {
        // if user is author of listing, delete listing
        db.Listing.findOne({id: req.params.id}, (err, listing) => {//find the listing
            if (err) {
                console.log(err);
            }
            else {
                if (req.user.id == listing.userid) {//if user is author of listing
                    db.Listing.findOneAndRemove({id: req.params.id}, (err, listing) => {//delete the listing
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.redirect('/listings');
                        }
                    });
                }
                else {
                    res.redirect('/listings');
                }
            }
        });
    }
    else{
        res.redirect('/signin');
    }
});

//-----------------------------------------------------------
// listings/:id/edit - GET : Displays the form for editing a listing
//-----------------------------------------------------------
router.get('/listings/:id/edit', (req, res, next) => {//get the form for editing a listing
    if (req.isAuthenticated()) {
        db.Listing.findOne({id: req.params.id}, (err, listing) => {//find the listing
            if (err) {
                console.log(err);
            }
            else {
                if (req.user.id == listing.userid) {//if user is author of listing
                    res.render('edit', { listing: listing, userid: req.user.username, loggedin: true });//render the form
                }
                else {
                    res.redirect('/listings');//redirect to listings
                }
            }
        });
    }
    else{
        res.redirect('/signin');
    }
});

//-----------------------------------------------------------
// listings/:id - PUT : Updates a listing
//-----------------------------------------------------------
router.put('/listings/:id', (req, res, next) => {//update a listing
    if (req.isAuthenticated()) {
        db.Listing.findOne({id: req.params.id}, (err, listing) => {//find the listing
            if (err) {
                console.log(err);
            }
            else {
                if (req.user.id == listing.userid) {//if user is author of listing
                    db.Listing.findOneAndUpdate({id: req.params.id}, {title: req.body.title, description: req.body.description, shortdescription: req.body.shortdescription, price: req.body.price, images: req.body.images.split(",")}, (err, listing) => {//update the listing
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.redirect('/listings');
                        }
                    });
                }
                else {
                    res.redirect('/listings');
                }
            }
        });
    }
    else{
        res.redirect('/signin');
    }
});

    
module.exports = router;

