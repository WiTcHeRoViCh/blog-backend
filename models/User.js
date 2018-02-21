import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    password: {type: String, required: [true, "can't be blank"]},

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});


export default mongoose.model('User', UserSchema);
