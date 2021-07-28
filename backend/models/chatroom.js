const mongoose = require('mongoose');

const chatroomSchema = mongoose.Schema({
    name: {type: String, required: true},
    admin: {type: mongoose.Schema.Types.ObjectId, required: true},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    messages: [{
        message: {type: String, required: true},
        from: {type: String, required: true},
        image: {type: String, required: true},
        datetime: {type: String, required: true}
    }]
});

module.exports = mongoose.model('Chatroom', chatroomSchema);