const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const usersRoutes = require('./Routes/users');
const postsRoutes = require('./Routes/posts/posts');
const searchRoutes = require('./Routes/search');
const chatRoutes = require('./Routes/chat');

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use('/images/users', express.static(path.join('backend/images/users')));
app.use('/images/posts', express.static(path.join('backend/images/posts')));

mongoose.connect('mongodb+srv://Aritro:'+ process.env.MONGO_PW +'@cluster0.wmuv0.mongodb.net/socialNetwork?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log('Connected to database.');
}).catch(() => {
  console.log('Connection failed.');
});

app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/chats', chatRoutes);

module.exports = app;