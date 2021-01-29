const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Post = require('./post.model');
const { Schema } = mongoose;
const { model } = mongoose;


const UserSchema = new Schema({
    userid: { type: String, index: true, unique: true, required: true },
    useremail: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    followercnt: { type: Number, min: 0, default: 0 },
    followers: [String],
    followingcnt: { type: Number, min: 0, default: 0 },
    followings: [String],
    watched: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

UserSchema.pre('save', { document: true }, async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        console.log(err);
        return next(err);
    }
})

module.exports = model('User', UserSchema);