const express = require('express');
const postController = require('../controllers/post.controllers');
const checkAuthMiddle = require('../middleware/check.auth');

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/create', checkAuthMiddle.checkAuth, postController.createPost);
router.put('/update', checkAuthMiddle.checkAuth, postController.updatePost);
router.delete('/:id', checkAuthMiddle.checkAuth, postController.deletePost);

module.exports = router;