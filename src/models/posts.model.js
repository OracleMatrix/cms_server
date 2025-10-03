const {Model, DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    class PostsModel extends Model {
        static associate(models) {
            PostsModel.belongsTo(models.users, {
                foreignKey: 'authorId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            PostsModel.hasMany(models.comments, {
                foreignKey: 'postId',
                as: 'comments',
            });
        }
    }

    PostsModel.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            excerpt: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                }
            },
            status: {
                type: DataTypes.ENUM('archived', 'published', 'draft'),
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tags: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'posts',
            underscored: true,
        }
    );
    return PostsModel;
};
