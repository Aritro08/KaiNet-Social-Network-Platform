const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/user');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg'
}

const profileImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error("Invalid mime type.");
        if(isValid) {
            err = null;
        }
        cb(err, './backend/images/users');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '.' + ext);
    }
});

router.post('/login', (req, res, next) => {
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
        const token = jwt.sign({username: fetchedUser.username, id: fetchedUser._id}, 'qwerty', {expiresIn: '1h'});
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            username: fetchedUser.username
        });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message: 'Login failed.'
        });
    });
});

router.post('/sign-up', (req, res, next) => {
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
            friendList: []
        });
        user.save().then(resData => {
            const token = jwt.sign({username: resData.username, id: resData._id}, 'qwerty', {expiresIn: '1h'});
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: resData._id,
                username: resData.username
            });
        })
    }).catch(err => {
        return res.status(500).json({
            message: 'User already exists'
        });
    });
});

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id).exec().then(user => {
        if(user) {
            res.status(200).json({
                user: user
            });
        } else {
            res.status(404).json({
                message: 'User not found.'
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'User could not be fetched.'
        });
    }); 
});

router.put('/:id', multer({storage: profileImgStorage}).single('image'), (req, res, next) => {
    let profileImage = req.body.image;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        profileImage = url + '/images/users/' + req.file.filename;
    }
    User.findByIdAndUpdate(req.params.id, {
        $set: {
            'username': req.body.username,
            'email': req.body.email,
            'bio': req.body.bio,
            'profileImage': profileImage
        }
    }).exec().then(resData => {
        res.status(200).json({
            message: 'User data updated'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Update failed'
        });
    });
});

router.get('/friends/:id', (req, res, next) => {
    User.findById(req.params.id).then(user => {
        User.find({ _id: { $in: user.friendList }}).then(friends => {
            if(friends) {
                res.status(200).json({
                    friends: friends
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(200).json({
                message: 'User friends could not be fetched'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(200).json({
            message: 'User could not be fetched'
        });
    });
});

router.get('/friend-requests/:id', (req, res, next) => {
    User.findById(req.params.id).then(user => {
        User.find({ _id: { $in: user.recvRequests }}).then(requests => {
            if(requests) {
                res.status(200).json({
                    requests: requests
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(200).json({
                message: 'User friend requests could not be fetched'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(200).json({
            message: 'User could not be fetched'
        });
    });
})

router.put('/friend/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $push: {'sentRequests': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $push: {'recvRequests': req.params.id}
        }).then(finData => {
            res.status(200).json({
                message: 'Friend req sent.'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Reciever not found.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Sender not found.'
        });
    });
});

router.put('/accept-friend/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $push: {'friendList': req.body.id},
        $pull: {'sentRequests': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $push: {'friendList': req.params.id},
            $pull: {'recvRequests': req.params.id}
        }).then(finData => {
            res.status(200).json({
                message: 'Friend req accepted.'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Reciever not found.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Sender not found.'
        });
    });
});

router.put('/reject-friend/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id,  {
        $pull: {'sentRequests': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $pull: {'recvRequests': req.params.id}
        }).then(finData => {
            res.status(200).json({
                message: 'Friend req rejected'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Reciever not found.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Sender not found.'
        });
    });
});

router.delete('/delete-friend/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $pull: {'friendList': req.body.id}
    }).then(resData => {
        User.findByIdAndUpdate(req.body.id, {
            $pull: {'friendList': req.params.id}
        }).then(finData => {
            res.status(200).json({
                message: 'Friend deleted.'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Reciever not found.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Sender not found.'
        });
    });
});

module.exports = router;