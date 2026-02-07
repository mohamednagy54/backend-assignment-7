const { userRouter } = require('./user/user.controller.js')
const { postRouter } = require('./post/post.controller.js')
const { commentRouter } = require('./comment/comment.controller.js')

module.exports = { userRouter, postRouter, commentRouter }
