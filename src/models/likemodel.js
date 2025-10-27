'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikeModel extends Model {
    static associate(models) {
      LikeModel.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      LikeModel.belongsTo(models.posts, {
        foreignKey: 'postId',
        as: 'posts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  LikeModel.init({
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
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'likes',
  });
  return LikeModel;
};