const fs = require('fs');
const mongoose = require('mongoose');
const Comment = require('./comment.model');
const { Schema } = mongoose;
const { model } = mongoose;

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
    likeusers: [String],
    commentcnt: { type: Number, min: 0, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

PostSchema.pre('deleteOne', { document: true }, async function (next) {
    try {
        for (const file of this.files) {
            let dir = 'public/images/' + file.filename;
            fs.unlink(dir, (err) => { console.log(err); });
        }

        return next();
    } catch (err) {
        console.log(err);
        return next(err);
    }
})

module.exports = model('Post', PostSchema);