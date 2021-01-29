const mongoose = require('mongoose');
const Post = require('./post.model');
const { Schema } = mongoose;
const { model } = mongoose;

const CommentSchema = new Schema({
    post_id: { type: Schema.Types.ObjectId, ref: 'Post' },
    owner: { type: String, required: true },
    posttime: { type: Date, default: Date.now },
    modifytime: { type: Date, default: Date.now },
    content: { type: String, required: true },
});

CommentSchema.pre('updateOne', { document: true }, async function (next) {
    try {
        this.modifytime = Date.now;
        return next();
    } catch (err) {
        console.log(err);
        return next(err);
    }
})

module.exports = model('Comment', CommentSchema);