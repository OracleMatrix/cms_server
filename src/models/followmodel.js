'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FollowModel extends Model {

    static associate(models) {
      FollowModel.belongsTo(models.users, {
        foreignKey: 'followerId',
        as: 'followerUser',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      FollowModel.belongsTo(models.users, {
        foreignKey: 'followingId',
        as: 'followingUser',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  FollowModel.init({
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    },
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'follow',
    underscored: true,
  });
  return FollowModel;
};