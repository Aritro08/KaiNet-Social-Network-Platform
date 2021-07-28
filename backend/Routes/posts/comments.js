const express = require('express');
const commentController = require('../../controllers/commentController');
const checkAuth = require('../../Middleware/check-auth');

const router = express.Router();

router.post('/:id', checkAuth, commentController.addComment);

router.get('/:id', commentController.getComments);

router.put('/:id', checkAuth, commentController.editComment);

router.delete('/:id', checkAuth, commentController.deleteComment);

module.exports = router