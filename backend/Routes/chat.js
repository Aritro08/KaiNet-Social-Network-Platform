const express = require('express');
const Chatroom = require('../models/chatroom');
const User = require('../models/user');

const router = express.Router();

router.post('/create-room', (req, res, next) => {
    const chatroom = new Chatroom({
        name: req.body.name,
        admin: req.body.admin,
        users: [req.body.admin],
        messages: []
    });
    chatroom.save().then(resData => {
        User.findByIdAndUpdate(req.body.admin, {
            $push: {'chatList': resData._id}
        }).then(() => {
            res.status(200).json({
                message: 'Chatroom created.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Chatroom could not be created.'
        });
    });
});

router.get('/chatlist/:id', (req, res, next) => {
    User.findById(req.params.id).then(user => {
        Chatroom.find({_id: { $in: user.chatList }}).then(chatlist => {
            if(chatlist) {
                res.status(200).json({
                    chatlist: chatlist,
                    message: 'Chatlist found.'
                });
            } else {
                console.log('No chatlist');
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Chatlist not found.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'User not found.'
        });
    });
});

router.get('/chatroom/:id', (req, res, next) => {
    Chatroom.findById(req.params.id).then(chatroom => {
        User.find({_id: { $in : chatroom.users }}).then(users => {
            if(chatroom && users) {
                res.status(200).json({
                    users: users,
                    chatroom: chatroom,
                    message: 'Chatroom found.'
                });
            } else {
                console.log('Chatroom not found.');
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(200).json({
            message: 'Chatroom could not be found.'
        });
    });
});

router.put('/add-to-room', (req, res, next) => {
    Chatroom.findByIdAndUpdate(req.body.roomId, {
        $push: {'users': req.body.memberId}
    }).then(() => {
        User.findByIdAndUpdate(req.body.memberId, {
            $push: {'chatList': req.body.roomId}
        }).then(() => {
            res.status(200).json({
                message: 'Member added to room.'
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Member could not be found.'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Room could not be found.'
        });
    });
})

module.exports = router;