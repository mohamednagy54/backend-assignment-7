const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../connection')
const { User } = require('./user.model')

class Post extends Model {}

Post.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'post',
    timestamps: true,
    paranoid: true,
  },
)

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
})

module.exports = { Post }
