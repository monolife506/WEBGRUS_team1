import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const UsernameSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
});

const FollowerSchema = new Schema({
    followercnt: { type: Number, min: 0, default: 0 },
    followerid: [String],
});

const FollowingSchema = new Schema({
    followingcnt: { type: Number, min: 0, default: 0 },
    followingid: [String],
});

const UserSchema = new Schema({
    username: UsernameSchema,
    userid: { type: String, index: true, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    follower: FollowerSchema,
    following: FollowingSchema,
});

module.exports = model('User', UserSchema);