const { get } = require("mongoose");
var Post = require("../models/post.model/");

/*
GET /posts/:id
글 하나의 정보를 받음
*/

function getPost(req, res, next) {
    var postID = req.params.id;
    Post.findOne({ _id: postID }, (err, resp) => {
        if (err) return res.status(500).json({ error: err });
        if (!resp) return res.status(404).json({ error: "post not found" });
        res.status(200).send(resp)
    })
}

/*
POST /posts
새 글 추가하기
TODO: 계정 인증 추가하기
*/

function makePost(req, res, next) {
    var post = new Post();

    post.title = req.body.title;
    // post.owner = getcurUser()
    post.description = req.body.description;
    post.tags = req.body.tags;
    post.photos = req.body.photos;

    post.save((err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ error: undefined });
    })
}

module.exports.getPost = getPost;
module.exports.makePost = makePost;
