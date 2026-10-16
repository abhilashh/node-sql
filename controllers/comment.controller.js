const models = require('../models')
const validator = require('fastest-validator');

const commentSchema = {
    content: { type: 'string', min: 1, max: 1000 },
    postId: { type: 'number', integer: true },
    userId: { type: 'number', integer: true }
};

const v = new validator();

function createComment(req, res) {
    const comment = {
        content: req.body.content,
        postId: req.body.postId,
        userId: req.userData.userId || req.userData.id
    };
    const validationResponse = v.validate(comment, commentSchema);
    if (validationResponse !== true) {
        return res.status(400).json({ error: 'Validation failed', details: validationResponse });
    }
    models.Post.findByPk(req.body.postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'No post exists' });
            }
            models.Comment.create(comment)
                .then(createdComment => {
                    res.status(201).json(createdComment);
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to create comment', details: error.message });
                });
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to find post', details: error.message });
        });
}

function getComments(req, res) {
    const postId = req.params.postId || req.params.id || req.query.postId;

    if (!postId) {
        return res.status(400).json({ message: 'No post id found' });
    }

    models.Post.findByPk(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'No post found' });
            }

            models.Comment.findAll({ where: { postId: postId } })
                .then(comments => {
                    res.status(200).json(comments);
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
                });
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to find post', details: error.message });
        });
}


module.exports = {
    createComment: createComment,
    getComments: getComments
}