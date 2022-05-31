const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route');

const app = express();
const sessions = require('express-session');
const cookieParser = require('cookie-parser');



app.use(sessions({
    secret: 'secret',
    saveUninitialized: true,
    cookie: { maxAge: 120000 },
    resave: false
    }));
app.use(route.db.passport.initialize());
app.use(route.db.passport.session());
route.db.passport.use(new route.db.LocalStrategy(route.db.User.authenticate()));
route.db.passport.serializeUser(route.db.User.serializeUser());
route.db.passport.deserializeUser(route.db.User.deserializeUser());
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', route);
app.use((req, res, next) => { res.redirect('/dashboard') });
const server = http.createServer(app);
server.listen(3000, ()=>{console.log('Server is running on port 3000');});

