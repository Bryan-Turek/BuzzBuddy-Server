var LocalStrategy = require('passport-local').Strategy
  , User = require('../models/user');

exports.localStrategy = function () {

    return new LocalStrategy({
        usernameField: 'email'
    }, function (username, password, done) {

        //Retrieve the user from the database by login
        User.findOne({email: username}, function (err, user) {

            //If something weird happens, abort.
            if (err) {
                return done(err);
            }

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                var user = new User({
                    email: username,
                    password: password
                });
                user.save(function(err, user, success) {
                    if(err) {
                        console.log(err);
                        return done(null, false, { message: 'User could not be created' });
                    }
                    
                    if(success) {
                        return done(null, user);
                    }
                });
            }

            //Make sure that the provided password matches what's in the DB.
            if (!user.passwordMatches(password)) {
                return done(null, false, { message: 'Incorrect Password' });
            }

            //If everything passes, return the retrieved user object.
            done(null, user);

        });
    });
}

exports.isAuthenticated = function (role) {

    return function (req, res, next) {

        if (!req.isAuthenticated()) {

            //If the user is not authorized, save the location that was being accessed so we can redirect afterwards.
            req.session.goingTo = req.url;
            res.redirect('/login');
            return;
        }

        //If a role was specified, make sure that the user has it.
        if (role && req.user.role !== role) {
            res.status(401);
            res.json({error:'401', message:'User does not have permission'});
        }

        next();
    }
}

exports.injectUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}