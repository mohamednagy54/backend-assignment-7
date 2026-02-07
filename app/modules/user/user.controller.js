const { Router } = require('express')
const {
  createUser,
  updateUser,
  getUserByEmail,
  getUserById,
} = require('./user.service.js')

const router = Router()

router.post('/signup', createUser)
router.put('/:id', updateUser)
router.get('/by-email', getUserByEmail)
router.get('/:id', getUserById)

module.exports = { userRouter: router }
