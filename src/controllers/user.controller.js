const userServices = require('../services/users.service');

class UserController {
    async getUserById(req, res) {
        try {
            const data = await userServices.getUsersById(req.params.userId);
            return res.status(200).send(data);
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getUsersByEmail(req, res) {
        try {
            const data = await userServices.getUserByEmail(req.query.email);
            return res.status(200).send(data);
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async getAllUsers(req, res) {
        try {
            const {page, limit} = req.query;
            const data = await userServices.getAllUsers(parseInt(page) || 1, parseInt(limit) || 10);
            return res.status(200).send(data);
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async deletedUser(req, res) {
        try {
            await userServices.deleteUser(req.params.userId);
            return res.status(200).send({message: "User deleted successfully"});
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async updateUser(req, res) {
        try {
            await userServices.updateUser(req.params.userId, req.body);
            return res.status(200).send({message: "User updated successfully"});
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }

    async updatePassword(req, res) {
        try {
            await userServices.updatePassword(req.params.userId, req.body);
            return res.status(200).send({message: "Password updated successfully"});
        } catch (error) {
            console.error(`==================================\n${error}\n======================================`);
            return res.status(error.status || 500).send({message: error.message});
        }
    }
}

module.exports = new UserController();