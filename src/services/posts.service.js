const Joi = require("joi");
const db = require("../models");
const PostsModel = db.posts;
const userServices = require("./users.service");
const followService = require('./follow.service');

class PostsService {
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

    checkParam(params) {
        const param = Joi.string().required();
        const { error } = param.validate(params);
        if (error) {
            const paramError = new Error(error.details[0].message);
            paramError.status = 400;
            throw paramError;
        }
        return param;
    }

    checkBody(body) {
        const bodySchema = Joi.object({
            title: Joi.string().required(),
            slug: Joi.string().required(),
            content: Joi.string().required(),
            excerpt: Joi.string().optional(),
            status: Joi.valid("archived", "published", "draft").required(),
            category: Joi.string().required(),
            tags: Joi.string().required(),
        });

        const { error } = bodySchema.validate(body);
        if (error) {
            const bodyError = new Error(error.details[0].message);
            bodyError.status = 400;
            throw bodyError;
        }
        return bodySchema;
    }

    checkBodyForUpdate(body) {
        const bodySchema = Joi.object({
            title: Joi.string().optional(),
            slug: Joi.string().optional(),
            content: Joi.string().optional(),
            excerpt: Joi.string().optional(),
            status: Joi.valid("archived", "published", "draft").optional(),
            category: Joi.string().optional(),
            tags: Joi.string().optional(),
        });

        const { error } = bodySchema.validate(body);
        if (error) {
            const bodyError = new Error(error.details[0].message);
            bodyError.status = 400;
            throw bodyError;
        }
        return bodySchema;
    }

    async checkSlugExist(slug) {
        const slugExists = await PostsModel.findOne({ where: { slug: slug } });
        if (slugExists) {
            const error = new Error("Slug already exists");
            error.status = 400;
            throw error;
        }
        return slugExists;
    }

    async getPostById(postId) {
        this.checkIdParam(postId);
        const post = await PostsModel.findByPk(postId, {
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
        });
        if (!post) {
            const error = new Error("Post not found");
            error.status = 404;
            throw error;
        }
        return post;
    }

    async getPostByTitle(title) {
        this.checkParam(title);
        const post = await PostsModel.findOne({
            where: {
                title: title, status: {
                    [db.Sequelize.Op.notIn]: ['draft', 'archived']
                }
            },
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
        });
        if (!post) {
            const error = new Error("Post not found");
            error.status = 404;
            throw error;
        }
        return post;
    }

    async getPostsByCategory(category, page = 1, limit = 10) {
        this.checkParam(category);

        const offset = (page - 1) * limit;

        const { count, rows } = await PostsModel.findAndCountAll({
            where: {
                category: { [db.Sequelize.Op.like]: `%${category}%` }, status: {
                    [db.Sequelize.Op.notIn]: ['draft', 'archived']
                }
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
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

    async getPostsByTag(tag, page = 1, limit = 10) {
        this.checkParam(tag);
        const offset = (page - 1) * limit;
        const { count, rows } = await PostsModel.findAndCountAll({
            where: {
                tags: { [db.Sequelize.Op.like]: `%${tag}%` },
                status: {
                    [db.Sequelize.Op.notIn]: ['draft', 'archived']
                }
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
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

    async getPostsByAuthorId(authorId, page = 1, limit = 10) {
        this.checkIdParam(authorId);
        await userServices.getUsersById(authorId);
        const offset = (page - 1) * limit;
        const { count, rows } = await PostsModel.findAndCountAll({
            where: {
                authorId: authorId,
                status: {
                    [db.Sequelize.Op.notIn]: ["draft", "archived"],
                },
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
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

    async getAllPosts(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { count, rows } = await PostsModel.findAndCountAll({
            where: {
                status: {
                    [db.Sequelize.Op.notIn]: ["draft", "archived"],
                },
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
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

    async getDraftPosts(authorId, page = 1, limit = 10) {
        this.checkIdParam(authorId);
        await userServices.getUsersById(authorId);
        const offset = (page - 1) * limit;
        const { count, rows } = await PostsModel.findAndCountAll({
            where: { authorId: authorId, status: "draft" },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
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

    async getArchivedPosts(authorId, page = 1, limit = 10) {
        this.checkIdParam(authorId);
        await userServices.getUsersById(authorId);
        const offset = (page - 1) * limit;
        const { count, rows } = await PostsModel.findAndCountAll({
            where: { authorId: authorId, status: "archived" },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
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

    async createPost(authorId, body) {
        this.checkIdParam(authorId);
        this.checkBody(body);
        await userServices.getUsersById(authorId);
        await this.checkSlugExist(body.slug);
        await userServices.checkUserRole(authorId, ["author", "admin"]);

        return await PostsModel.create({
            authorId: authorId,
            title: body.title,
            slug: body.slug,
            content: body.content,
            excerpt: body.excerpt,
            status: body.status,
            category: body.category,
            tags: body.tags,
        });
    }

    async getUserFollowingsPosts(userId, page = 1, limit = 10) {
        this.checkIdParam(userId);
        await userServices.getUsersById(userId);
        const offset = (page - 1) * limit;

        const followingData = await followService.getFollowing(userId, page, limit);

        const followingUserIds = followingData.data.map(follow => follow.followingUser.id);

        if (followingUserIds.length === 0) {
            return {
                data: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                },
            };
        }

        const { count, rows } = await PostsModel.findAndCountAll({
            where: {
                authorId: {
                    [db.Sequelize.Op.in]: followingUserIds
                },
                status: {
                    [db.Sequelize.Op.notIn]: ["draft", "archived"],
                },
            },
            limit: parseInt(limit),
            offset: offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: "users",
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
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

    async updatePost(postId, userId, body) {
        this.checkIdParam(postId);
        this.checkBodyForUpdate(body);
        await this.getPostById(postId);
        await userServices.checkUserRole(userId, ["author", "editor", "admin"]);
        if (body.slug != null) {
            await this.checkSlugExist(body.slug);
        }
        return PostsModel.update(
            {
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.excerpt,
                status: body.status,
                category: body.category,
                tags: body.tags,
            },
            {
                where: { id: postId },
            }
        );
    }

    async deletePost(postId, userId) {
        this.checkIdParam(postId);
        const post = await this.getPostById(postId);
        await userServices.checkUserRole(userId, ["author", "admin"]);
        await post.destroy();
        return post;
    }
}

module.exports = new PostsService();
