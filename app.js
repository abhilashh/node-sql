const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

app.use(bodyParser.json());
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
module.exports = app;