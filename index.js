'use strict';


var kraken = require('kraken-js'),
    auth = require('./lib/auth'),
    db = require('./lib/database'),
    passport = require('passport'),
    express = require('express'),
    flash = require('connect-flash'),
    lusca = require('lusca'),
    app = {};

app.configure = function configure(nconf, next) {
    //Tell passport to use our newly created local strategy for authentication
    passport.use(auth.localStrategy());

    //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(null, user);
        });
    });
    //Configure the database
    db.config(nconf.get('databaseConfig'));
    next(null);
};

app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};

app.requestBeforeRoute = function requestBeforeRoute(server) {
    server.use(express.methodOverride());
    server.use(express.bodyParser());
    server.use(passport.initialize());  //Use Passport for authentication
    server.use(passport.session());     //Persist the user in the session
    server.use(flash());                //Use flash for saving/retrieving error messages for the user
    server.use(auth.injectUser);        //Inject the authenticated user into the response context
};

app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};

if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err.stack);
        }
    });
}

module.exports = app;
