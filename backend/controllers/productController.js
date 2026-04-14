import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

// ===============================
// @desc    Fetch all products
// @route   GET /api/products
// ===============================
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll()
  res.json(products)
})

// ===============================
// @desc    Fetch single product
// ===============================
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// ===============================
// @desc    Delete product
// ===============================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  await product.destroy()

  res.json({ message: 'Product removed' })
})

// ===============================
// @desc    Create product
// ===============================
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    name: 'Sample name',
    price: 0,
    userId: req.user.id,   // ✅ important change
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  res.status(201).json(product)
})

// ===============================
// @desc    Update product
// ===============================
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  await product.update({
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  })

  res.json(product)
})

// ===============================
// @desc    Create new review
// ===============================
const createProductReview = asyncHandler(async (req, res) => {
  // ⚠️ Will implement after review controller setup
  res.status(501).json({ message: 'Review system coming next step' })
})

// ===============================
// @desc    Get top rated products
// ===============================
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    order: [['rating', 'DESC']],
    limit: 3,
  })

  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
