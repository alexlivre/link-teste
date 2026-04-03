// backend/server.js
// Servidor Express principal seguindo Clean Code (< 100 linhas)

import express from 'express'
import cors from 'cors'
import { config } from './config/database.js'
import { logger } from './middleware/logger.js'
import { errorHandler } from './middleware/errorHandler.js'
import resetService from './services/ResetService.js'

// Importação de rotas
import linksRouter from './routes/links.js'
import foldersRouter from './routes/folders.js'
import analyticsRouter from './routes/analytics.js'
import adminRouter from './routes/admin.js'
import redirectHandler from './middleware/redirectMiddleware.js'

/**
 * Função principal para criar e configurar servidor Express
 * Single Responsibility: Apenas configura e inicia o servidor
 */
const createServer = () => {
  const app = express()
  const PORT = process.env.PORT || 3001

  // Middlewares essenciais
  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
  }))
  
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(logger)

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    })
  })

  // Redirecionamento de links (deve vir antes das rotas de API)
  app.get('/:slug', redirectHandler)

  // API Routes
  app.use('/api/links', linksRouter)
  app.use('/api/folder', foldersRouter)
  app.use('/api/analytics', analyticsRouter)
  app.use('/api/admin', adminRouter)

  // Error handling (deve ser o último middleware)
  app.use(errorHandler)

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    })
  })

  return { app, PORT }
}

/**
 * Função para iniciar servidor
 */
const startServer = async () => {
  try {
    // Inicializar configuração do banco de dados
    await config.initialize()
    
    const { app, PORT } = createServer()
    
    // Iniciar serviço de reset automático
    resetService.start()
    
    app.listen(PORT, () => {
      console.log(`🚀 INKPAGE Mock Server running on port ${PORT}`)
      console.log(`📍 Health check: http://localhost:${PORT}/health`)
      console.log(`🔗 API Base: http://localhost:${PORT}/api`)
      console.log(`📊 Analytics: http://localhost:${PORT}/api/analytics/dashboard`)
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

// Iniciar servidor
startServer()

export { createServer, startServer }
