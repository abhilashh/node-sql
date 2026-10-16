const express = require('express');
const imageController = require('../controllers/image.controller');
const checkAuthMiddle = require('../middleware/check.auth');
const imageUploader = require('../helpers/image.uploader');

const router = express.Router();

router.post('/upload', checkAuthMiddle.checkAuth, imageUploader.upload.single('image'), imageController.upload);

module.exports = router;