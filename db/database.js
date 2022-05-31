var mongoose = require('mongoose');

mongoose.set('newUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost/db_app');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    created_at: Date,
    updated_at: Date
});

var User = mongoose.model('User', userSchema);

function createUser(user) {
    return new Promise((resolve, reject) => {
        User.create(user, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}


