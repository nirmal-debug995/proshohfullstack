import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'   // ✅ ADDED

import sequelize from './config/db.js'

// ===============================
// Models (REGISTER ORDER MATTERS)
// ===============================
import './models/userModel.js'
import './models/productModel.js'
import './models/reviewModel.js'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

const app = express()

// ===============================
// Middleware
// ===============================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ✅ IMPORTANT: Enable CORS for frontend (FIX NETWORK ERROR)
app.use(cors({
  origin: '*',
}))

app.use(express.json())

// ===============================
// API Routes
// ===============================
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// PayPal config
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

// ===============================
// Static uploads
// ===============================
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// ===============================
// Frontend production build
// ===============================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// ===============================
// Error handlers
// ===============================
app.use(notFound)
app.use(errorHandler)

// ===============================
// 🚀 DATABASE + SERVER START
// ===============================
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL Connection has been established successfully'.green.bold)

    await sequelize.sync({ alter: true })
    console.log('Database synced'.green.bold)

    app.listen(PORT, () =>
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
      )
    )

  } catch (error) {
    console.error(`Database connection failed: ${error.message}`.red.bold)
    process.exit(1)
  }
}

startServer()
