/*
 * Bachelor of Software Engineering
 * Media Design School
 * Auckland
 * New Zealand
 * 
 * (c) 2022 Media Design School
 * 
 * File Name: database.js
 * Description: 
 * Author: Nerys Thamm
 * Mail: nerysthamm@gmail.com
 */

var mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {v1: uuid } = require('uuid');
var passportLocalMongoose = require('passport-local-mongoose');

//Connect to database
mongoose.connect('mongodb://localhost/db_app');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

//Schema for Listing
const ListingSchema = new mongoose.Schema({
    id: {type: String, unique: true}, //Listing ID is a unique identifier for each listing
    userid: String, //User ID of the author
    author: String, //Username of the author
    title: String, //Title of the listing
    description: String, //Description of the listing
    price: Number, //Price of the listing
    images: [String], //Array of image URLs
    timestamp: Date, //Timestamp of when the listing was created
});
const Listing = mongoose.model('listing', ListingSchema);

//Schema for User
const UserSchema = new mongoose.Schema({
    id: {type: String, unique: true}, //User ID is a unique identifier for each user
    username: String, //Username of the user
    email: {type: String, unique: true}, //Email of the user
    listings: [{type: mongoose.Schema.Types.ObjectId, ref: 'listing'}] //Array of listing IDs
});
UserSchema.plugin(passportLocalMongoose); //Add passport functionality to the User model
const User = mongoose.model('User', UserSchema);

// CreateNewUser
//-----------------------------------------------------------
// Creates a new user with the given username, email, and password
//
// Parameters:
// name - The username of the new user
// email - The email of the new user
// password - The password of the new user
// req - The request object
// res - The response object
//
// Returns:
// Nothing
//
//-----------------------------------------------------------
function CreateNewUser(name, email, password, req, res) {
    User.register(new User({  //create a new user
        id: uuid(), //generate a unique id
        username: name,
        email: email,
    }), password, (err, user) => { //register the new user
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, () => { //authenticate the new user
                res.redirect('/dashboard');
            });
        }
    });
}

// CreateNewListing
//-----------------------------------------------------------
// Creates a new listing with the given title, description, price, and images
//
// Parameters:
// title - The title of the new listing
// description - The description of the new listing
// price - The price of the new listing
// images - The images of the new listing
// userid - The userid of the author of the new listing
// username - The username of the author of the new listing
//
// Returns:
// Nothing
//
//-----------------------------------------------------------
function CreateNewListing(title, description, price, images, userid, username) {
    let listing = new Listing({ //create a new listing
        id: uuid(), //generate a unique id
        userid: userid,
        author:username,
        title: title,
        description: description,
        price: price,
        images: images.split(','), //split the images into an array
        timestamp: new Date() //set the timestamp to the current time
    });
    listing.save((err) => {
        if (err) {
            console.error(err);
        }
    });
}

// Exports
module.exports = { CreateNewUser, 
    CreateNewListing,  
    User, 
    Listing, 
    Comment,
    mongoose,
    passport,
    LocalStrategy };




