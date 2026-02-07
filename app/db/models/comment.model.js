const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../connection')
const { User } = require('./user.model')
const { Post } = require('./post.model')

class Comment extends Model {}

Comment.init(
  {
    content: { type: DataTypes.TEXT, allowNull: false },

    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'posts',
        key: 'id',
      },
      allowNull: false,
    },
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
    modelName: 'comment',
    timestamps: true,
  },
)

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',
})

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
})

Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
})

module.exports = { Comment }
