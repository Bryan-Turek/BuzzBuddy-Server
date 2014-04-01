'use strict';


var User = require('../models/user'),
    passport = require('passport');


module.exports = function (app) {

    app.get('/user/:id', function (req, res) {
        User.findById(req.params.id, function(err, user) {
            if(err) {
               console.log(err);
            }
            res.json(user);
        });
    });
    app.post('/user', function(req, res) {
        var user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            phone: req.body.phone
        });
        user.save(function(err, user, success) {
            if(err) {
                console.log(err);
                res.json(err);
            }
            
            if(success) {
                res.json(user);
            }
        });
    });
    app.post('/user/login', passport.authenticate('local'), function(req, res) {
        res.json(req.user);
    });
};
