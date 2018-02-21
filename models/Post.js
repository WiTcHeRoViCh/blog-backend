import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const PostSchema = new mongoose.Schema({
    title: {type: String, unique: true, required: [true, "can't be blank"], index: true},
    text: {type: String, required: [true, "can't be blank"]},
    author: { type: String, required: true, index: true },
    photoURL: { type: String }
});

PostSchema.plugin(uniqueValidator, {message: 'is already taken.'});

export default mongoose.model('Post', PostSchema);
