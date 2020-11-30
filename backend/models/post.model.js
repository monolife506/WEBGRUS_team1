const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;

const CommentSchema = new Schema({
    index: { type: Number, min: 0, required: true, unique: true },
    owner: { type: String, required: true },
    posttime: { type: Date, default: Date.now },
    modifytime: { type: Date, default: Date.now },
    content: { type: String, required: true },
});

const PostSchema = new Schema({
    title: { type: String, required: true },
    owner: { type: String, required: true },
    description: String,
    posttime: { type: Date, default: Date.now },
    modifytime: { type: Date, default: Date.now },
    tags: [String],
    photos: [String],
    viewcnt: { type: Number, min: 0, default: 0 },
    likecnt: { type: Number, min: 0, default: 0 },
    commentcnt: { type: Number, min: 0, default: 0 },
    comments: [CommentSchema],
});

module.exports = model('Post', PostSchema);