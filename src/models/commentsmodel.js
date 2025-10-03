'use strict';
const {
  Model,
    DataTypes,
} = require('sequelize');
module.exports = (sequelize) => {
  class CommentsModel extends Model {
    static associate(models) {
      CommentsModel.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      CommentsModel.belongsTo(models.posts, {
        foreignKey: 'postId',
        as: 'posts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  CommentsModel.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    },
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comments',
  });
  return CommentsModel;
};