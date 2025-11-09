const likesServices = require('../services/likes.service');

class LikesController {
    async likePost(req, res, next) {
        try {
            const like = await likesServices.likePost(req.body);
            res.status(201).json(like);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async unlikePost(req, res, next) {
        try {
            const unlike = await likesServices.unlikePost(req.body);
            res.status(200).json(unlike);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }

    async getLikesByPostId(req, res, next) {
        try {
            const postId = req.params.postId;
            const { page, limit } = req.query;
            const likes = await likesServices.getLikesByPostId(postId,
                parseInt(page) || 1,
                parseInt(limit) || 10,
            );
            res.status(200).json(likes);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    }
}
module.exports = new LikesController();