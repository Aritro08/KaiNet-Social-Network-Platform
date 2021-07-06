const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bio: {type: String},
    profileImage: {type: String},
    sentRequests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    recvRequests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    friendList: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    sentChatRequests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    recvChatRequests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    chatList: [{type: mongoose.Schema.Types.ObjectId, ref: "Chatroom"}],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);