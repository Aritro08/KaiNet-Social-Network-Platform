const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getAllPosts = (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({
            posts: posts
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - posts not found.'
        });
    });
}

exports.getPostByPostId = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(!post) {
            return res.status(500).json({
                message: 'Post not found.'
            });
        }
        res.status(200).json({
            post: post
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - post not found.'
        });
    });
}

exports.getPostByUserId = (req, res, next) => {
    Post.find({userId: req.params.id}).then(posts => {
        res.status(200).json({
            posts: posts
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - posts not found.'
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
            id: resData._id
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - post could not be uploaded.'
        });
    });
}

exports.editPost = (req, res, next) => {
    let imagePath = req.body.image;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url +'/images/posts/' + req.file.filename;
    }
    Post.findOneAndUpdate({_id: req.params.id, userId: req.userData.id}, {
        $set: {'title': req.body.title, 'content': req.body.content, 'image': imagePath}
    }).then(resData => {
        if(!resData) {
            return res.status(401).json({
                message: 'Not authorised to perform task.'
            });
        }
        res.status(200).json({
            message: 'Post updated.'
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - unable to edit post.'
        });
    });
}

exports.deletePost = (req, res, next) => {
    Post.findOneAndDelete({_id: req.params.id, userId: req.userData.id}).then(resData => {
        if(!resData) {
            return res.status(401).json({
                message: 'Not authorised to perform task.'
            });
        }
        Comment.deleteMany({postId: req.params.id}).catch(err => {
            return res.status(500).json({
                message: 'Server error - unable to delete post comments.'
            });
        });
        res.status(200).json({
            message: 'post deleted.'
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - unable to delete post.'
        });
    });
}

exports.upvotePost = (req, res, next) => {
    if(req.body.type === 'toggleOn') {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'upvotes.up_count': req.body.count},
            $push: {'upvotes.up_users': req.body.userId}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - upvote failed.'
            });
        });
    } else {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'upvotes.up_count': req.body.count},
            $pull: {'upvotes.up_users': req.body.userId}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - failed to remove upvote.'
            });
        });
    }
}

exports.downvotePost = (req, res, next) => {
    if(req.body.type === 'toggleOn') {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'downvotes.down_count': req.body.count},
            $push: {'downvotes.down_users': req.body.userId}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - downvote failed.'
            });
        });
    } else {
        Post.findByIdAndUpdate(req.params.id, {
            $set: {'downvotes.down_count': req.body.count},
            $pull: {'downvotes.down_users': req.body.userId}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - failed to remove downvote.'
            });
        });
    }
}