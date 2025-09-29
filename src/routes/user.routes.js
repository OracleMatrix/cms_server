const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/users/:userId/',
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get user by ID'
    userController.getUserById
);

router.get('/users/',
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get user by email'
    userController.getUsersByEmail
);

router.get('/users/getAll/users/',
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get all users'
    userController.getAllUsers
);

router.delete('/users/:userId/delete',
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete a user by ID'
    userController.deletedUser
);

router.put('/users/:userId/update',
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update user with ID'
    /* #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               userName: "example",
               email: "example@gmail.com"
           }
    }*/
    userController.updateUser
);
router.patch('/users/:userId/update/password',
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update user password with ID'
    /* #swagger.parameters['body'] = {
           in: 'body',
           required: true,
           schema: {
               oldPassword: "12345678",
               newPassword: "123456789"
           }
    }*/
    userController.updatePassword
);

module.exports = router;