const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');

const router = express.Router();

router.get('/posts', (req, res, next) => {
    if(req.query.searchQuery) {
        const regex = new RegExp(escapeRegex(req.query.searchQuery), 'gi');
        Post.find({title: regex}).then(posts => {
            if(posts.length > 0) {
                res.status(200).json({
                    posts: posts
                });
            }
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - unable to search for posts.',
                posts: null
            });
        });
    }
});

router.get('/users', (req, res, next) => {
    if(req.query.searchQuery) {
        const regex = new RegExp(escapeRegex(req.query.searchQuery), 'gi');
        User.find({username: regex}).then(users => {
            if(users.length > 0) {
                res.status(200).json({
                    users: users
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: 'Server error - unable to search for users.',
                users: null
            });
        });
    }
})

let escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;