const path = require('path');
const express = require('express');
const router = express.Router();
const db = require ('./db/database');

var session;





router.get('/signup', (req, res, next) => {
    res.render('signup');
    
});
router.post('/signup', (req, res, next) => {
    db.createUser(req.body.username, req.body.email, req.body.password, time, time);
    res.redirect('/signin');
});
    

router.get('/signin', (req, res, next) => {
    res.render('signin');
    
    });

router.post('/signin', (req, res, next) => {
    let db = new sqlite3.Database(path.join(__dirname, '/db/database.db'));
    db.get('SELECT password FROM users WHERE username = ?', [req.body.username], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        if (row) {
            if(row.password == req.body.password){
                session = req.session;
                session.userid = req.body.username;
                console.log(req.session);
                res.redirect('/dashboard');
            }
            else{
                res.send('Wrong password');
            }
        }
        else {
            res.redirect('/signup');
        }
    });
    db.close();
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
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
    module.exports = router;
    

