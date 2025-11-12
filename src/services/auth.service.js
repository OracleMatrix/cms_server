const Joi = require('joi');
const _ = require('lodash');
const db = require('../models');
const UsersModel = db.users;
const jwt = require('jsonwebtoken');

class AuthService {
    async registerUser(data) {
        const bodySchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(255).required(),
            role: Joi.string().valid('author', 'editor', 'admin', 'user').required(),
        });
        const { error } = bodySchema.validate(data);
        if (error) {
            const errorMessage = new Error(error.details[0].message);
            errorMessage.status = 400;
            throw errorMessage;
        }
        const { email, password, role } = data;

        const userExists = await UsersModel.findOne({ where: { email: email } });
        if (userExists) {
            const userExistsError = new Error("User already exists");
            userExistsError.status = 400;
            throw userExistsError;
        }

        const user = await UsersModel.create({
            email: email,
            passwordHash: password,
            role: role,
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return { user: _.pick(user, ['id', 'userName', 'email', 'role', 'createdAt', 'updatedAt']), token: token };
    }

    async loginUser(data) {
        const bodySchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(255).required(),
        });
        const { error } = bodySchema.validate(data);
        if (error) {
            const errorMessage = new Error(error.details[0].message);
            errorMessage.status = 400;
            throw errorMessage;
        }
        const { email, password } = data;
        const user = await UsersModel.findOne({ where: { email: email } });
        if (!user) {
            const userExistsError = new Error("User not found");
            userExistsError.status = 404;
            throw userExistsError;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const errorMessage = new Error("Invalid credentials");
            errorMessage.status = 400;
            throw errorMessage;
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return { user: _.pick(user, ['id', 'userName', 'email', 'role', 'createdAt', 'updatedAt']), token: token };
    }
}

module.exports = new AuthService();