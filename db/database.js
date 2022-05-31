var mongoose = require('mongoose');

mongoose.set('newUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost/db_app');

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const CommentSchema = new mongoose.Schema({
    id: String,
    listingid: String,
    userid: String,
    comment: String,
    timestamp: Date,
    user: String
});

const Comment = mongoose.model('comment', CommentSchema);

const ListingSchema = new mongoose.Schema({
    id: String,
    userid: String,
    title: String,
    description: String,
    price: Number,
    images: [String],
    timestamp: Date,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}]
});

const Listing = mongoose.model('listing', ListingSchema);

const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    listings: [{type: mongoose.Schema.Types.ObjectId, ref: 'listing'}]
});

const User = mongoose.model('User', UserSchema);


function CreateNewUser(name, email, password) {
    let user = new User({
        id: email,
        name: name,
        email: email,
        password: password
    });
    user.save((err) => {
        if (err) {
            console.error(err);
        }
    });
}


