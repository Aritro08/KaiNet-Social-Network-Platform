const express = require('express');
const chatController = require('../controllers/chatController');

const checkAuth = require('../Middleware/check-auth');

const router = express.Router();

router.post('/create-room', checkAuth, chatController.createChatroom);

router.get('/chatlist/:id', checkAuth, chatController.getUserChatlist);

router.get('/chatroom/:id', checkAuth, chatController.getChatroomData);

router.put('/add-to-room', checkAuth, chatController.addUserToRoom);

router.put('/leave-room', checkAuth, chatController.leaveRoom);

router.put('/store-message/:id', checkAuth, chatController.storeMessages);

module.exports = router;