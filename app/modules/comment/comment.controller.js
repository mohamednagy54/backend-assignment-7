const { Router } = require('express')
const {
  createBulkComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails,
} = require('./comment.service.js')

const router = Router()

router.post('/', createBulkComments)
router.patch('/:commentId', updateComment)
router.post('/find-or-create', findOrCreateComment)
router.get('/search', searchComments)
router.get('/newest/:postId', getNewestComments)
router.get('/details/:id', getCommentDetails)

module.exports = { commentRouter: router }
