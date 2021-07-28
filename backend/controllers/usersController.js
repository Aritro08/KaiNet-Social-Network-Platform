const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.login = (req, res, next) => {
    let fetchedUser;
    User.findOne({username: req.body.username}).then(user => {
        if(!user) {
            return res.status(401).json({
              message: 'User not found.'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(resData => {
        if(!resData) {
            return res.status(401).json({
              message: 'Invalid Credentials.'
            });
        }
        const token = jwt.sign({username: fetchedUser.username, id: fetchedUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            username: fetchedUser.username
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - login failed.'
        });
    });
}
exports.signUp = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    let profileImage = url + '/images/users/default-avatar.jpg';
    bcrypt.hash(req.body.password, 12).then(hash => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            bio: null,
            profileImage: profileImage,
            sentRequests: [],
            recvRequests: [],
            friendList: [],
            sentChatRequests: [],
            recvChatrequests: [],
            chatList: []
        });
        user.save().then(resData => {
            const token = jwt.sign({username: resData.username, id: resData._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: resData._id,
                username: resData.username
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'User already exists.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - sign up failed.'
        });
    });
}

exports.getUserProfile = (req, res, next) => {
    User.findById(req.params.id).exec().then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        } 
        res.status(200).json({
            user: user
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - user not found.'
        });
    }); 
}

exports.editUserProfile = (req, res, next) => {
    authoriseUserId(req);
    let profileImage = req.body.image;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        profileImage = url + '/images/users/' + req.file.filename;
    }
    User.findByIdAndUpdate(req.params.id, {
        $set: {
            'email': req.body.email,
            'bio': req.body.bio,
            'profileImage': profileImage
        }
    }).exec().then(resData => {
        res.status(200).json({
            message: 'profile updated'
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - update failed.'
        });
    });
}

exports.getUserFriends =  (req, res, next) => {
    authoriseUserId(req);
    User.findById(req.params.id).then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }
        User.find({ _id: { $in: user.friendList }}).then(friends => {
            if(friends) {
                res.status(200).json({
                    friends: friends
                });
            }
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - user\'s friendlist not found.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - user not found.'
        });
    });
}

exports.getUserFriendRequests = (req, res, next) => {
    authoriseUserId(req);
    User.findById(req.params.id).then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }
        User.find({ _id: { $in: user.recvRequests }}).then(requests => {
            if(requests) {
                res.status(200).json({
                    requests: requests
                });
            }
        }).catch(err => {
            return res.status(500).json({
                message: ' Server error - user\'s friend requests not found.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - user not found.'
        });
    });
}

exports.sendFriendRequest = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $push: {'sentRequests': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $push: {'recvRequests': req.params.id}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - request could not be sent.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - request could not be sent.'
        });
    });
}

exports.acceptFriendRequest = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $push: {'friendList': req.body.id},
        $pull: {'sentRequests': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $push: {'friendList': req.params.id},
            $pull: {'recvRequests': req.params.id}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - request could not be accepted.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - request could not be accepted.'
        });
    });
}

exports.rejectFriendRequest = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id,  {
        $pull: {'sentRequests': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $pull: {'recvRequests': req.params.id}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - request could not be rejected.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - request could not be rejected.'
        });
    });
}

exports.deleteFriendRequest = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $pull: {'friendList': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $pull: {'friendList': req.params.id}
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - request could not be deleted.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - request could not be deleted.'
        });
    });
}

// exports.deleteUserAccount = (req, res, next) => {
    
// }

const authoriseUserId = (req) => {
    if(req.params.id !== req.userData.id) {
        return res.status(401).json({
            message: 'Not authorised to perform task.'
        });
    }
}