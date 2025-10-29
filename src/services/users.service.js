const Joi = require('joi');
const db = require('../models');
const UsersModel = db.users;

class UsersService {
    async getUsersById(userId) {
        const user = await UsersModel.findByPk(userId, { attributes: { exclude: ['passwordHash'] } });
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        return user;
    }

    async getUserByEmail(email) {
        const user = await UsersModel.findOne({ where: { email: email }, attributes: { exclude: ['passwordHash'] } });
        if (!user) {
            const error = new Error('User not found with this email');
            error.status = 404;
            throw error;
        }
        return user;
    }

    async getUserFullData(userId) {
        const user = await UsersModel.findOne({ where: { id: userId } });
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
        return user;
    }

    async getAllUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { count, rows } = await UsersModel.findAndCountAll(
            {
                limit,
                offset,
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ['passwordHash'] }
            }
        );
        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit: limit,
                totalPages: Math.ceil(count / limit),
            }
        }
    }

    async deleteUser(userId) {
        await this.getUsersById(userId);
        await UsersModel.destroy({ where: { id: userId } });
    }

    async updateUser(userId, data) {
        const paramSchema = Joi.number();

        const bodySchema = Joi.object({
            userName: Joi.string().required(),
            email: Joi.string().email().required(),
        });

        const { error: paramError } = paramSchema.validate(userId);
        if (paramError) {
            const paramValidateError = new Error(paramError.details[0].message);
            paramValidateError.status = 400;
            throw paramValidateError;
        }

        const { error: bodyError } = bodySchema.validate(data);
        if (bodyError) {
            const bodyValidateError = new Error(paramError.details[0].message);
            bodyValidateError.status = 400;
            throw bodyValidateError;
        }

        const { userName, email } = data;

        await this.getUsersById(userId);

        return UsersModel.update({ userName, email }, { where: { id: userId } });

    }

    async updatePassword(userId, data) {
        const paramSchema = Joi.number();
        const bodySchema = Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().min(8).max(255).required(),
        });

        const { error: paramError } = paramSchema.validate(userId);
        if (paramError) {
            const e = new Error(paramError.details[0].message);
            e.status = 400;
            throw e;
        }

        const { error: bodyError } = bodySchema.validate(data);
        if (bodyError) {
            const e = new Error(bodyError.details[0].message);
            e.status = 400;
            throw e;
        }

        const { oldPassword, newPassword } = data;
        const user = await this.getUserFullData(userId);

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            const e = new Error('Invalid credentials');
            e.status = 400;
            throw e;
        }

        user.passwordHash = newPassword;
        await user.save();

        return user;
    }

    async checkUserRole(userId, roles) {
        const user = await this.getUsersById(userId);

        const roleArray = Array.isArray(roles) ? roles : [roles];

        if (!roleArray.includes(user.role)) {
            const error = new Error(`${user.role.toUpperCase()} cannot perform this action, only ${roleArray.join(', ').toUpperCase()} can do`);
            error.status = 403;
            throw error;
        }
        return true;
    }
}

module.exports = new UsersService();