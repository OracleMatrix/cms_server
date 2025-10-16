const Joi = require('joi');
const db = require('../models');
const PostsModel = db.posts;
const userServices = require('./users.service');

class PostsService {
    checkIdParam(params) {
        const param = Joi.number().required();
        const {error} = param.validate(params);
        if (error) {
            const paramError = new Error(error.details[0].message);
            paramError.status = 400;
            throw paramError;
        }
        return param;
    }

    checkParam(params) {
        const param = Joi.string().required();
        const {error} = param.validate(params);
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
            status: Joi.valid('archived', 'published', 'draft').required(),
            category: Joi.string().required(),
            tags: Joi.string().required(),
        });

        const {error} = bodySchema.validate(body);
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
            status: Joi.valid('archived', 'published', 'draft').optional(),
            category: Joi.string().optional(),
            tags: Joi.string().optional(),
        });

        const {error} = bodySchema.validate(body);
        if (error) {
            const bodyError = new Error(error.details[0].message);
            bodyError.status = 400;
            throw bodyError;
        }
        return bodySchema;
    }

    async checkSlugExist(slug) {
        const slugExists = await PostsModel.findOne({where: {slug: slug}});
        if (slugExists) {
            const error = new Error('Slug already exists');
            error.status = 400;
            throw error;
        }
        return slugExists;
    }


    async getPostById(postId) {
        this.checkIdParam(postId);
        const post = await PostsModel.findByPk(postId, {
            include: [{
                model: db.users,
                as: 'users',
                attributes: {exclude: ['passwordHash']}
            }]
        });
        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }
        return post;
    }

    async getPostByTitle(title) {
        this.checkParam(title);
        const post = await PostsModel.findOne({
            where: {title: title},
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: {exclude: ['passwordHash']},
                }
            ]
        });
        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }
        return post;
    }

    async getPostsByCategory(category, page = 1, limit = 10) {
        this.checkParam(category);

        const offset = (page - 1) * limit;

        const {count, rows} = await PostsModel.findAndCountAll({
            where: {category: category},
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: {exclude: ['passwordHash']},
                }
            ]
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        };
    }


    async getPostsByTag(tag, page = 1, limit = 10) {
        this.checkParam(tag);
        const offset = (page - 1) * limit;
        const {count, rows} = await PostsModel.findAndCountAll({
            where: {
                tags: tag,
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: {exclude: ['passwordHash']},
                }
            ]
        });
        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        }
    }

    async getPostsByAuthorId(authorId, page = 1, limit = 10) {
        this.checkIdParam(authorId);
        await userServices.getUsersById(authorId);
        const offset = (page - 1) * limit;
        const {count, rows} = await PostsModel.findAndCountAll({
            where: {authorId: authorId},
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: {exclude: ['passwordHash']}
                },
            ]
        });
        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        }
    }

    async getAllPosts(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const {count, rows} = await PostsModel.findAndCountAll({
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: db.users,
                    as: 'users',
                    attributes: {exclude: ['passwordHash']}
                }
            ]
        });
        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        }
    }

    async createPost(authorId, body) {
        await this.checkIdParam(authorId);
        await this.checkBody(body);
        await userServices.getUsersById(authorId);
        await this.checkSlugExist(body.slug);

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

    async updatePost(postId, body) {
        await this.checkIdParam(postId);
        await this.checkBodyForUpdate(body);
        await this.getPostById(postId);
        await this.checkSlugExist(body.slug);

        return PostsModel.update({
            title: body.title,
            slug: body.slug,
            content: body.content,
            excerpt: body.excerpt,
            status: body.status,
            category: body.category,
            tags: body.tags,
        }, {
            where: {id: postId},
        });
    }

    async deletePost(postId) {
        await this.checkIdParam(postId);
        const post = await this.getPostById(postId);
        await post.destroy();
        return post;
    }
}

module.exports = new PostsService();