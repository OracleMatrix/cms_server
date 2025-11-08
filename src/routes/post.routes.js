const router = require('express').Router();
const postsController = require('../controllers/posts.controller');

router.get('/posts/:postId/',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get post by ID'
    postsController.getPostById);

router.get('/posts/all/posts',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get all posts'
    postsController.getAllPosts);

router.get('/posts/by/title/',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get post by Title'
    postsController.getPostByTitle);

router.get('/posts/:authorId/author',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get all of the posts of a user by author ID'
    postsController.getPostByAuthorId)

router.get('/posts/get/by/category',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get all of the posts with a category'
    postsController.getPostsByCategory);

router.get('/posts/get/by/tag',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get all of the posts with a tag'
    postsController.getPostsByTag);

router.get('/posts/:authorId/drafts',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get all draft posts of an author by author ID'
    postsController.getDraftPosts);

router.get('/posts/:authorId/archived',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get all archived posts of an author by author ID'
    postsController.getArchivedPosts);

router.post('/posts/:authorId/create/',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Create new post'
    /* #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
                title: "title",
                slug: "/my-first-post",
                content: "content",
                excerpt: "excerpt",
                status: "published",
                category: "category",
                tags: "tag"
           }
    }*/
    postsController.createPost);

router.get('/posts/user/followingBy/:userId',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Get users followings posts'
    postsController.getUserFollowingsPosts,
);

router.put('/posts/:postId/:userId/update/',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Update a post by ID'
    /* #swagger.parameters['body'] = {
           in: 'body',
           required: false,
           schema: {
                title: "title",
                slug: "/my-first-post",
                content: "content",
                excerpt: "excerpt",
                status: "published",
                category: "category",
                tags: "tag"
           }
    }*/
    postsController.updatePost);

router.delete('/posts/:postId/:userId/delete',
    // #swagger.tags = ['Posts']
    // #swagger.summary = 'Delete a post by ID'
    postsController.deletePost);

module.exports = router;