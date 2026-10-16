const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const imageRoutes = require('./routes/images');
const commentRoutes = require('./routes/comments');

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); //to make the folder public accessible, function in express
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/image', imageRoutes);
app.use('/comment', commentRoutes);
module.exports = app;