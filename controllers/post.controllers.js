
const models = require('../models');
const validator = require('fastest-validator');

const postSchema = {
    title: { type: 'string', min: 2, max: 100 },
    content: { type: 'string', min: 10 },
    imageUrl: { type: 'string', optional: true },
    categoryId: { type: 'number', integer: true },
    userId: { type: 'number', integer: true }
};
const updatePostSchema = {
    id: { type: 'number', integer: true },
    title: { type: 'string', min: 2, max: 100, optional: true },
    content: { type: 'string', min: 10, optional: true },
    imageUrl: { type: 'string', optional: true },
    categoryId: { type: 'number', integer: true, optional: true },
    userId: { type: 'number', integer: true, }
};
const v = new validator();
const check = v.compile(postSchema);
const checkUpdate = v.compile(updatePostSchema);


function getPosts(req, res) {
    models.Post.findAll()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
        });
}

function createPost(req, res) {
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        userId: req.body.userId
    }
    const validationResponse = check(post);
    if (validationResponse !== true) {
        return res.status(400).json({ error: 'Validation failed', details: validationResponse });
    }
    console.log('Creating post:', post);
    models.Post.create(post)
        .then(createdPost => {
            res.status(201).json(createdPost);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to create post', details: error.message });
        });
}

function getPostById(req, res) {
    const postId = req.params.id;
    models.Post.findByPk(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json(post);
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to fetch post', details: error.message });
        });
}

function updatePost(req, res) {
    const postId = req.body.id;
    const userId = req.body.userId;
    const updatedData = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        userId: userId,
        id: postId
    };
    const validationResponse = checkUpdate(updatedData);
    if (validationResponse !== true) {
        return res.status(400).json({ error: 'Validation failed', details: validationResponse });
    }
    // Assuming userId is sent in the request body
    models.Post.update(updatedData, { where: { id: postId, userId: userId } })
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) {
                return res.status(404).json({ error: 'Post not found or unauthorized' });
            }
            res.status(200).json({ message: 'Post updated successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to update post', details: error.message });
        });
}

function deletePost(req, res) {
    const postId = req.params.id;
    const userId = req.query.userId;
    console.log(`Deleting post with ID: ${postId} for user ID: ${userId}`);
    models.Post.destroy({ where: { id: postId, userId: userId } })
        .then(rowsDeleted => {
            if (rowsDeleted === 0) {
                return res.status(404).json({ error: 'Post not found or unauthorized' });
            }
            res.status(200).json({ message: 'Post deleted successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to delete post', details: error.message });
        });
}

module.exports = {
    getPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost
};