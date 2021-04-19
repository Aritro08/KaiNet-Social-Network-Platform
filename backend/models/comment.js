const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    parentId: {type: mongoose.Schema.Types.ObjectId, default: null},
    postId: {type: mongoose.Schema.Types.ObjectId, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    username: {type: String, required: true},
    content: {type: String, required: true},
    commentDate: {type: Date, required: true}
});

module.exports = mongoose.model('Comment', commentSchema);