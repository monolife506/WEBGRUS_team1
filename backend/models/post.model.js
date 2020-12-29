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

const FileSchema = new Schema({
    originalname: { type: String, required: true },
    filename: { type: String, required: true },
});

const PostSchema = new Schema({
    title: { type: String, required: true },
    owner: { type: String, required: true },
    description: { type: String, default: "" },
    posttime: { type: Date, default: Date.now },
    modifytime: { type: Date, default: Date.now },
    tags: [String],
    files: [FileSchema],
    viewcnt: { type: Number, min: 0, default: 0 },
    likecnt: { type: Number, min: 0, default: 0 },
    commentcnt: { type: Number, min: 0, default: 0 },
    comments: [CommentSchema],
    isDeleted: { type: Boolean, default: false }
});

module.exports = model('Post', PostSchema);