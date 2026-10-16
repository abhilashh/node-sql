const express = require('express')
const commentController = require('../controllers/comment.controller');
const checkAuthMiddle = require('../middleware/check.auth');


const router = express.Router()
router.post('/create', checkAuthMiddle.checkAuth, commentController.createComment);
router.get('/', commentController.getComments);
router.get('/:postId', commentController.getComments);

module.exports = router;