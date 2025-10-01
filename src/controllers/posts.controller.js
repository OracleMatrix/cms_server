const postService = require('../services/posts.service');

class PostsController {
    async getPostById(req, res) {
        try {
            const data = await postService.getPostById(req.params.postId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getPostByTitle(req, res) {
        try {
            const data = await postService.getPostByTitle(req.query.title);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getPostByAuthorId(req, res) {
        try {
            const {authorId} = req.params;
            const {page, limit} = req.query;
            const data = await postService.getPostsByAuthorId(
                authorId,
                parseInt(page) || 1,
                parseInt(limit) || 10,
            );
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getPostsByCategory(req, res) {
        try {
            const {category, page, limit} = req.query;
            const data = await postService.getPostsByCategory(
                category,
                parseInt(page) || 1,
                parseInt(limit) || 10
            );
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }


    async getPostsByTag(req, res) {
        try {
            const {tag, page, limit} = req.query;
            const data = await postService.getPostsByTag(
                tag,
                parseInt(page) || 1,
                parseInt(limit) || 10
            );
            return res.status(200).send(data);
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getAllPosts(req, res) {
        try {
            const {page, limit} = req.query;
            const data = await postService.getAllPosts(
                parseInt(page) || 1,
                parseInt(limit) || 10,
            );
            return res.status(200).send(data);
        }  catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async createPost(req, res) {
        try {
            const data = await postService.createPost(req.params.authorId, req.body);
            return res.status(201).send({message: "Post created successfully", data});
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async updatePost(req, res) {
        try {
            await postService.updatePost(req.params.postId, req.body);
            return res.status(200).send({message: "Post updated successfully"});
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async deletePost(req, res) {
        try {
            await postService.deletePost(req.params.postId);
            return res.status(200).send({message: "Post deleted successfully"});
        } catch (error) {
            return res.status(error.status || 500).send({message: error.message});
        }
    }
}

module.exports = new PostsController();