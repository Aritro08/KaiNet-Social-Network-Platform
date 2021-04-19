const express = require('express');
const commentController = require('../../controllers/commentController');

const router = express.Router();

router.post('/:id', commentController.addComment);

router.get('/:id', commentController.getComments);

router.put('/:id', commentController.editComment);

router.delete('/:id', commentController.deleteComment);

module.exports = router