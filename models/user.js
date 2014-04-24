'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    nconf = require('nconf'),
    bcrypt = require('bcrypt');

var UserModel = function() {
    
    var UserSchema = mongoose.Schema({
        email: {type: String, required: true, unique: true}, //Ensure emails are unique and require them.
        password: {type: String, required: true},
        phone: String,
        username: String,
        name: String,
        role: {type: String, default: 'user'},
        created: {type: Date, default: new Date()},
        verified: {type: Boolean, default: false},
        private: {type: Boolean, select: false},
        friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
        events: [{type: Schema.Types.ObjectId, ref: 'Event'}]
    });

    UserSchema.pre('save', function (next) {
        var user = this;

        //If the password has not been modified in this save operation, leave it alone (So we don't double hash it)
        if (!user.isModified('password')) {
            next();
            return;
        }

        //Retrieve the desired difficulty from the configuration. (Default = 8)
        var DIFFICULTY = (nconf.get('bcrypt') && nconf.get('bcrypt').difficulty) || 8;

        //Encrypt it using bCrypt. Using the Sync method instead of Async to keep the code simple.
        var hashedPwd = bcrypt.hashSync(user.password, DIFFICULTY);

        //Replace the plaintext pw with the Hash+Salted pw;
        user.password = hashedPwd;

        //Continue with the save operation
        next();
    });

    UserSchema.methods.passwordMatches = function (plainText) {
        var user = this
        return bcrypt.compareSync(plainText, user.password)
    }
    
    UserSchema.methods.toJSON = function() {
        var obj = this.toObject()
        delete obj.password
        return obj
    }
  
    return mongoose.model('User', UserSchema);
};

module.exports = new UserModel();