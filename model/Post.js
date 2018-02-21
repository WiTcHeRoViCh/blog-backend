var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var PostSchema = new mongoose.Schema({
    title: {type: String, unique: true, required: [true, "can't be blank"], index: true},
    text: {type: String, required: [true, "can't be blank"]},
    author: { type: String, required: true, index: true }
});

PostSchema.plugin(uniqueValidator, {message: 'is already taken.'});

mongoose.model('Post', PostSchema);
