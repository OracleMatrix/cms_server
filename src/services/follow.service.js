const Joi = require("joi");
const db = require("../models");
const FollowModel = db.follow;
const userServices = require("./users.service");

class FollowService {
    checkParamId(param) {
        const schema = Joi.number().integer().required();

        const {error} = schema.validate(param);
        if (error) {
            const paramError = new Error(error.details[0].message);
            paramError.status = 400;
            throw paramError;
        }
        return schema;
    }

    checkQueryId(query) {
        const schema = Joi.number().integer().required();

        const {error} = schema.validate(query);
        if (error) {
            const queryError = new Error(error.details[0].message);
            queryError.status = 400;
            throw queryError;
        }
        return schema;
    }

    checkBody(body) {
        const schema = Joi.object({
            followerId: Joi.number().integer().required(),
            followingId: Joi.number().integer().required(),
        });

        const {error} = schema.validate(body);
        if (error) {
            const paramError = new Error(error.details[0].message);
            paramError.status = 400;
            throw paramError;
        }
        return schema;
    }

    async checkIfFollowing(followerId, followingId) {
        this.checkQueryId(followerId);
        this.checkQueryId(followingId);
        await userServices.getUsersById(followerId);
        await userServices.getUsersById(followingId);

        return await FollowModel.findOne({
            where: {
                followerId: followerId,
                followingId: followingId,
            }
        });
    }

    checkSelfFollow(followerId, followingId) {
        if (followerId === followingId) {
            const error = new Error('You cannot follow yourself');
            error.status = 400;
            throw error;
        }
    }

    async followAUser(followerId, followingId) {
        this.checkQueryId(followerId);
        this.checkQueryId(followingId);
        this.checkSelfFollow(followerId, followingId);
        const isFollowing = await this.checkIfFollowing(followerId, followingId);
        if (isFollowing) {
            const error = new Error('Already following each other');
            error.status = 400;
            throw error;
        }

        return await FollowModel.create({
            followerId: followerId,
            followingId: followingId,
        });
    }

    async unfollowAUser(followerId, followingId) {
        this.checkQueryId(followerId);
        this.checkQueryId(followingId);
        const isFollowing = await this.checkIfFollowing(followerId, followingId);
        if (!isFollowing) {
            const error = new Error('You are not following each other');
            error.status = 400;
            throw error;
        }
        return await FollowModel.destroy({
            where: {
                followerId: followerId,
                followingId: followingId,
            }
        });
    }

    async getFollowers(userId, page = 1, limit = 10) {
        this.checkParamId(userId);
        await userServices.getUsersById(userId);
        const offset = (page - 1) * limit;

        const {count, rows} = await FollowModel.findAndCountAll({
                where: {
                    followingId: userId,
                },
                include: [{
                    model: db.users,
                    as: 'followerUser',
                    attributes: {exclude: ['passwordHash']}
                }],
                limit: parseInt(limit),
                offset: offset,
                order: [['createdAt', 'DESC']]
            },
        );

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    async getFollowing(userId, page = 1, limit = 10) {
        this.checkParamId(userId);
        await userServices.getUsersById(userId);
        const offset = (page - 1) * limit;

        const {count, rows} = await FollowModel.findAndCountAll({
            where: {
                followerId: userId, // Users that this user follows
            },
            include: [{
                model: db.users,
                as: 'followingUser',
                attributes: {exclude: ['passwordHash']}
            }],
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
}

module.exports = new FollowService();