const express = require('express');
const postController = require('../controllers/postControllers');

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/create', postController.createPost);
router.put('/update', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;