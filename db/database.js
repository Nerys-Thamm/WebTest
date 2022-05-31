var mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {v1: uuid } = require('uuid');
var passportLocalMongoose = require('passport-local-mongoose');


mongoose.connect('mongodb://localhost/db_app');

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const CommentSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    listingid: String,
    userid: String,
    comment: String,
    timestamp: Date,
    user: String
});

const Comment = mongoose.model('comment', CommentSchema);

const ListingSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    userid: String,
    author: String,
    title: String,
    description: String,
    price: Number,
    images: [String],
    timestamp: Date,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}]
});

const Listing = mongoose.model('listing', ListingSchema);

const UserSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    username: String,
    password: String,
    email: {type: String, unique: true},
    listings: [{type: mongoose.Schema.Types.ObjectId, ref: 'listing'}]
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);


function CreateNewUser(name, email, password, req, res) {
    User.register(new User({ 
        id: uuid(),
        username: name,
        email: email,
    }), password, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.redirect('/dashboard');
            });
        }
    });
}

function CreateNewListing(title, description, price, images, userid) {
    let listing = new Listing({
        id: uuid(),
        userid: userid,
        author: User.findOne({id: userid}).username,
        title: title,
        description: description,
        price: price,
        images: images,
        timestamp: new Date()
    });
    listing.save((err) => {
        if (err) {
            console.error(err);
        }
    });
}

function CreateNewComment(listingid, userid, comment) {
    let commentObj = new Comment({
        id: uuid(),
        listingid: listingid,
        userid: userid,
        comment: comment,
        timestamp: new Date(),
        user: User.findOne({id: userid}).name
    });
    commentObj.save((err) => {
        if (err) {
            console.error(err);
        }
    });
}

module.exports = { CreateNewUser, 
    CreateNewListing, 
    CreateNewComment, 
    User, 
    Listing, 
    Comment,
    mongoose,
    passport,
    LocalStrategy };




