const Post = require('../models/post');
const Comment = require('../models/comment');

exports.addComment = (req, res, next) => {
    let count;
    const comment = new Comment({
        parentId: req.body.parentId,
        postId: req.params.id,
        username: req.body.userName,
        content: req.body.content,
        userId: req.body.userId,
        commentDate: Date.now()
    });
    comment.save().then(resData => {
        Post.findByIdAndUpdate(req.params.id, {
            $inc: {'commentCount': 1}
        }).then(resData => {
            count = resData.commentCount + 1;
            res.status(200).json({
                count: count
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - failed to update post.'
            })
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - failed to add comment.'
        });
    });
}

exports.getComments = (req, res, next) => {
    Comment.find({postId: req.params.id}).lean().exec().then(comments => {
        let threads = [];
        let threadComment;
        let findThreads = (threadComment, threads) => {
            threads.forEach(thread => {
                if(thread._id.toString() === threadComment.parentId.toString()) {
                    thread.children.push(threadComment);
                }
                if(thread.children.length > 0) {
                    findThreads(threadComment, thread.children);
                }
            });
        }
        comments.forEach(comment => {
            threadComment = comment;
            threadComment['children'] = [];
            threadComment['replyFormDisplay'] = false;
            let parentId = comment.parentId;
            if(!parentId) {
                threads.push(comment);
                return;
            }
            findThreads(threadComment, threads);
        });
        res.status(200).json({
            comments: threads
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - failed to load comments.'
        });
    });
}

exports.editComment = (req, res, next) => {
    Comment.findOneAndUpdate(req.params.id, {
        $set: {'content': req.body.content}
    }).then(resData => {
        if(!resData) {
            return res.status(401).json({
                message: 'Not authorised to perform task.'
            });
        }
        res.status(200).json({
            message: 'comment'
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - failed to update comment.'
        });
    });
}

exports.deleteComment = (req, res, next) => {
    let decPostCommentCount = () => {
        Post.findByIdAndUpdate(req.body.postId, {
            $inc: {'commentCount': -1}
        }).then(resData => {
            count = resData.commentCount - 1;
            res.status(200).json({
                count: count
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - failed to update post after deletion.',
                count: 0
            });
        });
    }
    Comment.findOne({_id: req.params.id, userId: req.userData.id}).then(delComment => {
        if(!delComment) {
            return res.status(401).json({
                message: 'Not Authorised to perform task.'
            });
        }
        let id = delComment._id.toString();
        Comment.find({parentId: id}).lean().exec().then(comments => {
            if(comments.length >= 1) {
                delComment.content = '[deleted]';
                delComment.save().then(resData => {
                    decPostCommentCount();
                }).catch(err => {
                    return res.status(500).json({
                        message: 'Server error - comment could not be deleted.',
                        count: 0
                    });
                });
            } else {
                delComment.delete().then(resData => {
                    decPostCommentCount();
                }).catch(err => {
                    return res.status(500).json({
                        message: 'Server error - comment could not be deleted.',
                        count: 0
                    });
                });
            }
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - comments not found.',
                count: 0
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - comment not found.',
            count: 0
        });
    });
}