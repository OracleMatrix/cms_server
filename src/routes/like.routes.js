const router = require('express').Router();
const likesController = require('../controllers/likes.controller');

router.post('/like',
    // #swagger.tags = ['Likes']
    // #swagger.summary = 'Like a post'
    /* #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
                userId: 1,
                postId: 1
           }
    }*/
    likesController.likePost);
router.post('/unlike',
    // #swagger.tags = ['Likes']
    // #swagger.summary = 'Unlike a post'
    /* #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
                userId: 1,
                postId: 1
           }
    }*/
    likesController.unlikePost);

router.get('/likes/of/post/:postId',
    // #swagger.tags = ['Likes']
    // #swagger.summary = 'Get likes by post ID'
    likesController.getLikesByPostId);

module.exports = router;