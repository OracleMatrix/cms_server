const router = require('express').Router();
const followController = require('../controllers/follow.controller');

// Follow a user
router.post('/follow/follow',
    // #swagger.tags = ['Follow']
    // #swagger.summary = 'Follow a user'
    followController.followUser);

// Unfollow a user
router.delete('/follow/unfollow',
    // #swagger.tags = ['Follow']
    // #swagger.summary = 'Unfollow a user'
    followController.unfollowUser);

// Get user's followers
router.get('/follow/:userId/followers',
    // #swagger.tags = ['Follow']
    // #swagger.summary = 'Get all followers of a user'
    followController.getFollowers);

// Get who user is following
router.get('/follow/:userId/following',
    // #swagger.tags = ['Follow']
    // #swagger.summary = 'Get all follow that a user is following'
    followController.getFollowing);

module.exports = router;