'use strict';


var Event = require('../models/event');


module.exports = function (app) {
    
    app.get('/events', function (req, res) {
        Event.find(null, function(err, events) {
            if(err) {
               console.log(err);
            }
            res.json(events);
        });
    });
    app.get('/events/:id', function (req, res) {
        Event.findOne({_id: req.params.id}, function(err, event) {
            if(err) {
               console.log(err);
            }
            res.json(event);
        });
    });
};
