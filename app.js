/*
 * Bachelor of Software Engineering
 * Media Design School
 * Auckland
 * New Zealand
 * 
 * (c) 2022 Media Design School
 * 
 * File Name: app.js
 * Description: 
 * Author: Nerys Thamm
 * Mail: nerysthamm@gmail.com
 */

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route');
const db = require ('./db/database');
const app = express();
const methodOverride = require('method-override');
const sessions = require('express-session');


//Setup override
app.use(methodOverride('_method'));

//Setup passport sessions
app.use(sessions({
    secret: 'secret',
    saveUninitialized: false,
    cookie: { maxAge: 120000 },
    resave: false
    }));
app.use(db.passport.initialize());
app.use(db.passport.session());

//Setup authentification
db.passport.use(new db.LocalStrategy(db.User.authenticate()));
db.passport.serializeUser(db.User.serializeUser());
db.passport.deserializeUser(db.User.deserializeUser());

//Setup view engine, body parser, and routing
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', route);
app.use((req, res, next) => { res.redirect('/dashboard') });

//Create server and have it listen on port 3000
const server = http.createServer(app);
server.listen(3000, ()=>{console.log('Server is running on port 3000');});

