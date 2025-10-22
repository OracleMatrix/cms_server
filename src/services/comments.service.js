const db = require('../models');
const CommentsModel = db.comments;
const userServices = require('./users.service');
const postServices = require('./posts.service');
const Joi = require("joi");

class CommentsService {
    checkIdParam(params) {
        const param = Joi.number().required();
        const { error } = param.validate(params);
        if (error) {
            const paramError = new Error(error.details[0].message);
            paramError.status = 400;
            throw paramError;
        }
        return param;
    }

    // checkParam(params) {
    //     const param = Joi.string().required();
    //     const {error} = param.validate(params);
    //     if (error) {
    //         const paramError = new Error(error.details[0].message);
    //         paramError.status = 400;
    //         throw paramError;
    //     }
    //     return param;
    // }

    checkBody(body) {
        const bodySchema = Joi.object({
            content: Joi.string().required(),
        });

        const { error } = bodySchema.validate(body);
        if (error) {
            const bodyError = new Error(error.details[0].message);
            bodyError.status = 400;
            throw bodyError;
        }
        return bodySchema;
    }

    async getCommentById(commentId) {
        this.checkIdParam(commentId);
        const comment = await CommentsModel.findByPk(commentId, {
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: { exclude: ['passwordHash'] }
                },
                {
                    model: db.posts,
                    as: 'posts',
                }
            ]
        });
        if (!comment) {
            const error = new Error('Comment not found');
            error.status = 404;
            throw error;
        }
        return comment;
    }

    async getCommentsByUserId(userId, page = 1, limit = 10) {
        this.checkIdParam(userId);
        await userServices.getUsersById(userId);
        const offset = (page - 1) * limit;
        const { count, rows } = await CommentsModel.findAndCountAll({
            where: { userId: userId },
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: { exclude: ['passwordHash'] }
                },
                {
                    model: db.posts,
                    as: 'posts',
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });
        return {
            data: rows,
            pagination: {
                total: count,
                limit: limit,
                page: page,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    async getAllComments(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { count, rows } = await CommentsModel.findAndCountAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        return {
            data: rows,
            pagination: {
                total: count,
                limit: limit,
                page: page,
                totalPages: Math.ceil(count / limit),
            }
        }
    }

    async getCommentsByPostId(postId, page = 1, limit = 10) {
        this.checkIdParam(postId);
        await postServices.getPostById(postId);
        const offset = (page - 1) * limit;
        const { count, rows } = await CommentsModel.findAndCountAll({
            where: { postId: postId },
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: { exclude: ['passwordHash'] }
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });
        return {
            data: rows,
            pagination: {
                total: count,
                limit: limit,
                page: page,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    async createComment(userId, postId, data) {
        this.checkIdParam(userId);
        this.checkIdParam(postId);
        this.checkBody(data);
        await userServices.getUsersById(userId);
        await postServices.getPostById(postId);

        return CommentsModel.create({
            userId: userId,
            postId: postId,
            content: data.content,
        });
    }

    async deleteComment(commentId) {
        this.checkIdParam(commentId);
        await this.getCommentById(commentId);
        return await CommentsModel.destroy({ where: { id: commentId } });
    }
}

module.exports = new CommentsService();