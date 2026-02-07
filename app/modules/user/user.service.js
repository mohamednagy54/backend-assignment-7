const { User } = require('../../db/models/user.model')

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // check if user exist
    const user = await isUserExist({ email })

    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'User already exist' })

    // create user
    const newUser = await User.build({ name, email, password })
    await newUser.save()

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    })
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message })
    }
    return res.status(500).json({ success: false, message: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const { id } = req.params

    const [user, created] = await User.upsert(
      { id, name, email, password },
      { validate: false },
    )

    return res.status(200).json({
      success: true,
      message: 'User created or updated successfully',
      data: user,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query

    const user = await isUserExist({ email })

    if (!user)
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })

    return res.status(200).json({
      success: true,
      message: 'User found successfully',
      data: {
        email: user.email,
        name: user.name,
        id: user.id,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await isUserExist({ id })

    if (!user)
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })

    return res.status(200).json({
      success: true,
      message: 'User found successfully',
      data: {
        email: user.email,
        name: user.name,
        id: user.id,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

const isUserExist = async (condition) => {
  const user = await User.findOne({ where: condition })
  return user
}

module.exports = {
  createUser,
  updateUser,
  getUserByEmail,
  getUserById,
  isUserExist,
}
