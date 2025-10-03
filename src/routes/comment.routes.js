const router = require('express').Router();
const commentController = require('../controllers/comments.controller');

router.get('/comments/:commentId',
    // #swagger.tags = ['Comments']
    // #swagger.summary = 'Get comment by ID'
    commentController.getCommentById);
router.get('/comments/all/comments',
    // #swagger.tags = ['Comments']
    // #swagger.summary = 'Get all comments'
    commentController.getAllComments);
router.get('/comments/of/user/:userId',
    // #swagger.tags = ['Comments']
    // #swagger.summary = 'Get user comments by user ID'
    commentController.getCommentByUserId);
router.post('/comment/create/:userId/:postId',
    // #swagger.tags = ['Comments']
    // #swagger.summary = 'Create new comment'
    /* #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
                content: "content"
           }
    }*/
    commentController.createComment);
router.delete('/comments/:commentId',
    // #swagger.tags = ['Comments']
    // #swagger.summary = 'Delete a comment by ID'
    commentController.deleteComment);

module.exports = router;