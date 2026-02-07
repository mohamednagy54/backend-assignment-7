const { Router } = require('express')
const {
  createPost,
  deletePost,
  getAllPostsWithDetails,
  getPostsWithCommentCount,
} = require('./post.service.js')

const router = Router()

router.post('/', createPost)
router.delete('/:postId', deletePost)
router.get('/details', getAllPostsWithDetails)
router.get('/comment-count', getPostsWithCommentCount)

module.exports = { postRouter: router }
