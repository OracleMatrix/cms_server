const authController = require('../controllers/auth.controller');
const router = require('express').Router();


router.post('/auth/register',
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Register new user'
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                email: "example@gmail.com",
                password: "12345678",
                role: "admin"
            }
    } */
    authController.register);

router.post('/auth/login',
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Login user'
    /* #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                email: "example@gmail.com",
                password: "12345678"
            }
    } */
    authController.login);

module.exports = router;