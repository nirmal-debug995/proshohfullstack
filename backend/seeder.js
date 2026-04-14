import dotenv from 'dotenv'
import colors from 'colors'

import sequelize from './config/db.js'
import users from './data/users.js'
import products from './data/products.js'

import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'

dotenv.config()

// ===============================
// IMPORT DATA (MYSQL)
// ===============================
const importData = async () => {
  try {
    console.log('🚀 Seeder started')

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    console.log('🔄 Syncing DB...')
    await sequelize.sync({ force: true })

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')

    console.log('👤 Creating users...')
    const createdUsers = await User.bulkCreate(users, { returning: true })

    console.log('📦 Creating products...')
    const adminUser = createdUsers[0]

    const sampleProducts = products.map((p) => ({
      name: p.name,
      image: p.image,
      description: p.description,
      brand: p.brand,
      category: p.category,
      price: p.price,
      countInStock: p.countInStock,
      rating: p.rating || 0,
      numReviews: p.numReviews || 0,
      userId: adminUser.id,
    }))

    await Product.bulkCreate(sampleProducts)

    console.log('✅ DONE SUCCESSFULLY')
    process.exit()

  } catch (error) {
    console.error('❌ ERROR:', error)
    process.exit(1)
  }
}

console.log('🔥 calling importData()')
importData()
