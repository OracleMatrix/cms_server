const Joi = require('joi');
const db = require('../models');
const LikesModel = db.likes;
const postsService = require('./posts.service');
const usersService = require('./users.service');

class LikesService {
    checkParamId(param) {
        const schema = Joi.number().integer().required();
        const { error } = schema.validate(param);
        if (error) {
            const errorMessage = new Error(error.details[0].message);
            errorMessage.status = 400;
            throw errorMessage;
        }
    }

    checkParamQuery(param) {
        const query = Joi.string().required();
        const { error } = query.validate(param);
        if (error) {
            const errorMessage = new Error(error.details[0].message);
            errorMessage.status = 400;
            throw errorMessage;
        }
    }

    checkBody(body) {
        const schema = Joi.object({
            userId: Joi.number().integer().required(),
            postId: Joi.number().integer().required(),
        });
        const { error } = schema.validate(body);
        if (error) {
            const errorMessage = new Error(error.details[0].message);
            errorMessage.status = 400;
            throw errorMessage;
        }
    }

    async likePost(body) {
        this.checkBody(body);
        const { userId, postId } = body;
        await usersService.getUsersById(userId);
        await postsService.getPostById(postId);

        const existingLike = await LikesModel.findOne({ where: { userId, postId } });
        if (existingLike) {
            const errorMessage = new Error('User has already liked this post');
            errorMessage.status = 400;
            throw errorMessage;
        }

        const like = await LikesModel.create({ userId, postId });
        return like;
    }

    async unlikePost(body) {
        this.checkBody(body);
        const { userId, postId } = body;
        await usersService.getUsersById(userId);
        await postsService.getPostById(postId);

        const existingLike = await LikesModel.findOne({ where: { userId, postId } });
        if (!existingLike) {
            const errorMessage = new Error('Like not found for this user and post');
            errorMessage.status = 404;
            throw errorMessage;
        }

        await LikesModel.destroy({ where: { userId, postId } });
        return { message: 'Post unliked successfully' };
    }

    async getLikesByPostId(postId, page = 1, limit = 10) {
        this.checkParamId(postId);
        await postsService.getPostById(postId);
        const offset = (page - 1) * limit;

        const { count, rows } = await LikesModel.findAndCountAll({
            where: { postId },
            offset,
            limit,
            order: [["createdAt", "DESC"]],
            include: [{
                model: db.users,
                as: "users",
                attributes: { exclude: ["passwordHash"] },
            }]
        });
        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPage: Math.ceil(count / limit),
            }
        };
    }


}

module.exports = new LikesService();