const followService = require('../services/follow.service');

class FollowController {
    async followUser(req, res) {
        try {
            const {followerId, followingId} = req.query;
            const data = await followService.followAUser(followerId, followingId);
            return res.status(201).send({message: "Followed successfully", data});
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async unfollowUser(req, res) {
        try {
            const {followerId, followingId} = req.query;
            await followService.unfollowAUser(followerId, followingId);
            return res.status(200).send({message: "Unfollowed successfully"});
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getFollowers(req, res) {
        try {
            const {userId} = req.params;
            const {page, limit} = req.query;
            const data = await followService.getFollowers(userId, parseInt(page) || 1, parseInt(limit) || 10,);
            return res.status(200).send(data);
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getFollowing(req, res) {
        try {
            const {userId} = req.params;
            const {page, limit} = req.query;
            const data = await followService.getFollowing(userId, parseInt(page) || 1, parseInt(limit) || 10,);
            return res.status(200).send(data);
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }
}

module.exports = new FollowController();