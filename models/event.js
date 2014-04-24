'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventModel = function() {
    
    var EventSchema = mongoose.Schema({
        name: {type: String, required: true}, //Ensure emails are unique and require them.
        description: {type: String, required: true},
        category: {type: String, required: true},
        created: {type: Date, default: new Date()},
        startsOn: {type: Date, required: true},
        endsOn: {type: Date, required: true},
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        privacy: String
    });

    EventSchema.pre('save', function (next) {
        
    });

    EventSchema.methods.passwordMatches = function (plainText) {
        
    };
  
    return mongoose.model('Event', EventSchema);
};

module.exports = new EventModel();