const Chatroom = require('../models/chatroom');
const User = require('../models/user');

exports.createChatroom = (req, res, next) => {
    const chatroom = new Chatroom({
        name: req.body.name,
        admin: req.body.admin,
        users: [req.body.admin],
        messages: []
    });
    chatroom.save().then(resData => {
        User.findByIdAndUpdate(req.body.admin, {
            $push: {'chatList': resData._id}
        }).then(resData => {
            res.status(200).json({
                message: 'room created.'
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - User not found.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - Chatroom could not be created.'
        });
    });
}

exports.getUserChatlist = (req, res, next) => {
    User.findById(req.params.id).then(user => {
        Chatroom.find({_id: { $in: user.chatList }}).then(chatlist => {
            res.status(200).json({
                chatlist: chatlist
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - Chatlist not found.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - User not found.'
        });
    });
}

exports.getChatroomData = (req, res, next) => {
    Chatroom.findById(req.params.id).then(chatroom => {
        User.find({_id: { $in : chatroom.users }}).then(users => {
            res.status(200).json({
                users: users,
                chatroom: chatroom
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - User not found.'
            });
        });
    }).catch(err => {
        return res.status(200).json({
            message: 'Server error - Chatroom not found.'
        });
    });
}

exports.addUserToRoom = (req, res, next) => {
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
            return res.status(500).json({
                message: 'Server error - Member not found.'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Sever error - Room not found.'
        });
    });
}

exports.leaveRoom = (req, res, next) => {
    if(req.body.memberId !== req.userData.id) {
        return res.status(401).json({
            message: 'Not Authorised.'
        });
    }
    User.findByIdAndUpdate(req.body.memberId, {
        $pull: {'chatList': req.body.roomId}
    }).then(() => {
        Chatroom.findByIdAndUpdate(req.body.roomId, {
            $pull: {'users': req.body.memberId}
        }).exec().then(resData => {
            // delete chatroom if membercount becomes 0
            let memberCount = resData.users.length - 1;
            if(memberCount === 0) {
                Chatroom.findByIdAndDelete(req.body.roomId).catch(err => {
                    res.status(500).json({
                        message: 'Room could not be deleted.'
                    });
                });
            }
            res.status(200).json({
                message: 'User removed from room'
            });
        }).catch(err => {
            return res.status(500).json({
                message: 'Server error - Chatroom not found'
            });
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - Member not found'
        });
    });
}

exports.storeMessages = (req, res, next) => {
    Chatroom.findByIdAndUpdate(req.params.id, {
        $push: {'messages': req.body.storedMessage}
    }).then(() => {
        res.status(200).json({
            message: 'Message stored'
        });
    }).catch(err => {
        return res.status(500).json({
            message: 'Server error - Message could not be stored'
        });
    });
}