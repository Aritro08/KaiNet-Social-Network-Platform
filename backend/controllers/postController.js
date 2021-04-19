const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getAllPosts = (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({
            posts: posts
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Posts could not be fetched.'
        });
    });
}

exports.getPostByPostId = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        res.status(200).json({
            post: post
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Post could not if fetched.'
        });
    });
}

exports.getPostByUserId = (req, res, next) => {
    Post.find({userId: req.params.id}).then(posts => {
        res.status(200).json({
            posts: posts
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Posts could not if fetched.'
        });
    });
}

exports.addNewPost = (req, res, next) => {
    let imagePath = null;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url +'/images/posts/' + req.file.filename;
    }
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        image: imagePath,
        userId: req.body.userId,
        username: req.body.username,
        upvotes: {
            up_count: 0,
            up_users: []
        },
        downvotes: {
            down_count: 0,
            down_users: []
        },
        postDate: Date.now(),
        commentCount: 0
    });
    post.save().then(resData => {
        res.status(200).json({
            id: resData._id,
            message: 'Post added'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Post could not be added.'
        });
    });
}

exports.editPost = (req, res, next) => {
    let imagePath = req.body.image;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url +'/images/posts/' + req.file.filename;
    }
    Post.findByIdAndUpdate(req.params.id, {
        $set: {'title': req.body.title, 'content': req.body.content, 'image': imagePath}
    }).then(resData => {
        res.status(200).json({
            message: 'Post updated.'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Post could not be updated.'
        });
    });
}

exports.deletePost = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id).then(resData => {
        Comment.deleteMany({postId: req.params.id}).then(resCommentData => {
            res.status(200).json({
                message: 'Post deleted.'
            });
        }).catch(err => {
            res.status(500).json({
                message: 'Post deleted but comments could not be deleted.'
            });
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Post could not be deleted.'
        });
    });
}

exports.upvotePost = (req, res, next) => {
    if(req.body.type === 'toggleOn') {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'upvotes.up_count': req.body.count},
            $push: {'upvotes.up_users': req.body.userId}
        }).then(resData => {
            res.status(200).json({
                message: 'Post upvoted'
            });
        });
    } else {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'upvotes.up_count': req.body.count},
            $pull: {'upvotes.up_users': req.body.userId}
        }).then(resData => {
            res.status(200).json({
                message: 'Removed upvote'
            });
        });
    }
}

exports.downvotePost = (req, res, next) => {
    if(req.body.type === 'toggleOn') {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'downvotes.down_count': req.body.count},
            $push: {'downvotes.down_users': req.body.userId}
        }).then(resData => {
            res.status(200).json({
                message: 'Post downvoted'
            });
        });
    } else {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'downvotes.down_count': req.body.count},
            $pull: {'downvotes.down_users': req.body.userId}
        }).then(resData => {
            res.status(200).json({
                message: 'Removed downvote'
            });
        });
    }
}