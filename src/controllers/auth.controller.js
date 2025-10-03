const authServices = require('../services/auth.service');

class AuthController {
    async register(req, res) {
        try {
            const data = await authServices.registerUser(req.body);
            res.status(201).send(data);
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            res.status(error.status || 500).json({message: error.message});
        }
    }

    async login(req, res) {
        try {
            const data = await authServices.loginUser(req.body);
            res.status(201).send(data);
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            res.status(error.status || 500).json({message: error.message});
        }
    }
}

module.exports = new AuthController();