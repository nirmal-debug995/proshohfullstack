import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import Product from './productModel.js'
import User from './userModel.js'

const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
})

// ===============================
// RELATIONSHIPS
// ===============================

// Product → Reviews (1 to many)
Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' })
Review.belongsTo(Product, { foreignKey: 'productId' })

// User → Reviews (1 to many)
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' })
Review.belongsTo(User, { foreignKey: 'userId' })

export default Review
