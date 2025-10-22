const commentsService = require('../services/comments.service');

class CommentsController {
    async getCommentById(req, res) {
        try {
            const data = await commentsService.getCommentById(req.params.commentId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async getCommentByUserId(req, res) {
        try {
            const { page, limit } = req.query;
            const data = await commentsService.getCommentsByUserId(req.params.userId, parseInt(page) || 1, parseInt(limit) || 10);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async getAllComments(req, res) {
        try {
            const { page, limit } = req.query;
            const data = await commentsService.getAllComments(parseInt(page) || 1, parseInt(limit) || 10);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async getCommentsByPostId(req, res) {
        try {
            const { page, limit } = req.query;
            const data = await commentsService.getCommentsByPostId(req.params.postId, parseInt(page) || 1, parseInt(limit) || 10);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async createComment(req, res) {
        try {
            const data = await commentsService.createComment(req.params.userId, req.params.postId, req.body);
            return res.status(201).json(data);
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }

    async deleteComment(req, res) {
        try {
            await commentsService.deleteComment(req.params.commentId);
            return res.status(200).send({ message: 'Comment has been deleted' });
        } catch (error) {
            return res.status(error.status || 500).json({ message: error.message });
        }
    }
}

module.exports = new CommentsController();