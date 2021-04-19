const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String},
    image: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    username: {type: String, required: true},
    upvotes: {
        up_count: {type: Number}, 
        up_users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
    downvotes: {
        down_count: {type: Number}, 
        down_users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
    postDate: {type: Date, required: true},
    commentCount: {type: Number, required: true}
});

module.exports = mongoose.model('Post', postSchema);