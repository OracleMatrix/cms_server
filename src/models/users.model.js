const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize) => {
    class UsersModel extends Model {
        static associate(models) {
            UsersModel.hasMany(models.posts, {
                foreignKey: 'authorId',
                as: 'posts',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            UsersModel.hasMany(models.comments, {
                foreignKey: 'userId',
                as: 'comments',
            });
            UsersModel.hasMany(models.likes, {
                foreignKey: 'userId',
                as: 'likes',
            });
        }

        async comparePassword(password) {
            return await bcrypt.compare(password, this.passwordHash);
        }
    }

    UsersModel.init(
        {
            userName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                }
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [8, 255]
                }
            },
            role: {
                type: DataTypes.ENUM('admin', 'author', 'editor'),
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'users',
            underscored: true,
            hooks: {
                beforeCreate: async (user) => {
                    user.passwordHash = await bcrypt.hash(user.passwordHash, 10)
                },
                beforeUpdate: async (user) => {
                    if (user.changed('passwordHash')) {
                        user.passwordHash = await bcrypt.hash(user.passwordHash, 10)
                    }
                }
            }
        }
    );
    return UsersModel;
};
