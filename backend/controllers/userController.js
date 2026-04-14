import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'

// ===============================
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
// ===============================
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// ===============================
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
// ===============================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ where: { email } })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user.id),
  })
})

// ===============================
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// ===============================
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id)

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// ===============================
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// ===============================
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const updatedData = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
  }

  if (req.body.password) {
    updatedData.password = await bcrypt.hash(req.body.password, 10)
  }

  await user.update(updatedData)

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user.id),
  })
})

// ===============================
// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
// ===============================
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  })

  res.json(users)
})

// ===============================
// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
// ===============================
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  await user.destroy()

  res.json({ message: 'User removed' })
})

// ===============================
// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
// ===============================
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
  })

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json(user)
})

// ===============================
// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
// ===============================
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  await user.update({
    name: req.body.name || user.name,
    email: req.body.email || user.email,
    isAdmin: req.body.isAdmin,
  })

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
