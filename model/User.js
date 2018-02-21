var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    password: {type: String, required: [true, "can't be blank"]},

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.getJSONData = function() {
    return {
        id: this._id,
        username: this.username,
        password: this.password
    }
};

mongoose.model('User', UserSchema);
