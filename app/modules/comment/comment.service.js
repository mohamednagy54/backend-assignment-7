const { Comment } = require('../../db/models/comment.model')
const { User } = require('../../db/models/user.model')
const { Post } = require('../../db/models/post.model')
const { Op } = require('sequelize')

const createBulkComments = async (req, res) => {
  try {
    const commentsData = req.body 
    const comments = await Comment.bulkCreate(commentsData)


    
    return res.status(201).json({
      success: true,
      message: 'Comments created successfully',
      data: comments,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { userId, content } = req.body

    const comment = await Comment.findByPk(commentId)

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' })
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this comment',
      })
    }

    comment.content = content
    await comment.save()

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body

    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content },
    })

    return res.status(200).json({
      success: true,
      message: created
        ? 'Comment created successfully'
        : 'Comment found successfully',
      data: comment,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// URL: GET /comments/search?word=the
const searchComments = async (req, res) => {
  try {
    const { word } = req.query

    const { count, rows } = await Comment.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: { count, comments: rows },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params

    const comments = await Comment.findAll({
      where: { postId },
      limit: 3,
      order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
      success: true,
      message: 'Newest comments retrieved successfully',
      data: comments,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const getCommentDetails = async (req, res) => {
  try {
    const { id } = req.params

    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title'],
        },
      ],
    })

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Comment details retrieved successfully',
      data: comment,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createBulkComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails,
}
