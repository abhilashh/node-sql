
const models = require('../models');
const validator = require('fastest-validator');

const postSchema = {
    title: { type: 'string', min: 2, max: 100 },
    content: { type: 'string', min: 10 },
    imageUrl: { type: 'string', optional: true },
    categoryId: { type: 'number', integer: true },
};
const updatePostSchema = {
    id: { type: 'number', integer: true },
    title: { type: 'string', min: 2, max: 100, optional: true },
    content: { type: 'string', min: 10, optional: true },
    imageUrl: { type: 'string', optional: true },
    categoryId: { type: 'number', integer: true, optional: true },
};
const v = new validator();
const check = v.compile(postSchema);
const checkUpdate = v.compile(updatePostSchema);


async function getPosts(req, res) {
    try {
        const posts = await models.Post.findAll({
            attributes: { exclude: ['userId', 'categoryId'] },
            include: [
                { model: models.User, as: 'user', attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } },
                { model: models.Category, as: 'category', attributes: { exclude: ['createdAt', 'updatedAt'] } }
            ]
        });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
    }
}

async function createPost(req, res) {
    try {
        const userId = req.userData.userId || req.userData.id;
        const post = {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.imageUrl,
            categoryId: req.body.categoryId,
            userId
        };

        const validationResponse = check(post);
        if (validationResponse !== true) {
            return res.status(400).json({ error: 'Validation failed', details: validationResponse });
        }

        const category = await models.Category.findByPk(req.body.categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        console.log('Creating post:', post);
        const createdPost = await models.Post.create(post);
        return res.status(201).json(createdPost);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create post', details: error.message });
    }
}

async function getPostById(req, res) {
    try {
        const post = await models.Post.findByPk(req.params.id, {
            attributes: { exclude: ['userId', 'categoryId'] },
            include: [
                { model: models.User, as: 'user', attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } },
                { model: models.Category, as: 'category', attributes: { exclude: ['createdAt', 'updatedAt'] } },
                {
                    model: models.Comment,
                    as: 'comments',
                    attributes: { exclude: ['postId', 'userId'] },
                    include: [
                        { model: models.User, as: 'user', attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
                    ]
                }
            ]
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch post', details: error.message });
    }
}

async function updatePost(req, res) {
    try {
        const postId = req.body.id;
        const userId = req.userData.userId || req.userData.id;
        const updatedData = {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.imageUrl,
            categoryId: req.body.categoryId,
            userId,
            id: postId
        };

        const validationResponse = checkUpdate(updatedData);
        if (validationResponse !== true) {
            return res.status(400).json({ error: 'Validation failed', details: validationResponse });
        }

        // Fetch post and category in parallel
        const [post, category] = await Promise.all([
            models.Post.findByPk(postId),
            models.Category.findByPk(req.body.categoryId)
        ]);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.userId !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!category) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        await models.Post.update(updatedData, { where: { id: postId, userId } });
        return res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update post', details: error.message });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.userData.userId || req.userData.id;
        console.log(`Deleting post with ID: ${postId} for user ID: ${userId}`);

        const rowsDeleted = await models.Post.destroy({ where: { id: postId, userId } });
        if (rowsDeleted === 0) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete post', details: error.message });
    }
}

module.exports = {
    getPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost
};