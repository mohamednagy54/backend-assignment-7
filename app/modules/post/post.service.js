const { Post } = require('../../db/models/post.model')
const { User } = require('../../db/models/user.model')
const { Comment } = require('../../db/models/comment.model')
const { sequelize } = require('../../db/connection')

const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body

    const newPost = Post.build({ title, content, userId })
    await newPost.save()

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params
    const { userId } = req.body // Assuming userId comes from body for authorization check as per requirements

    const post = await Post.findByPk(postId)

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      })
    }

    await post.destroy()

    return res
      .status(200)
      .json({ success: true, message: 'Post deleted successfully' })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const getAllPostsWithDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'content'],
        },
      ],
    })

    return res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: posts,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const getPostsWithCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM comments WHERE comments.postId = post.id)',
            ),
            'commentCount',
          ],
        ],
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: posts,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createPost,
  deletePost,
  getAllPostsWithDetails,
  getPostsWithCommentCount,
}
