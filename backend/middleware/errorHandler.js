// backend/middleware/errorHandler.js
// Middleware de tratamento de erros seguindo Clean Code (< 80 linhas)

import { logError } from './logger.js'

/**
 * Middleware central de tratamento de erros
 * Single Responsibility: Apenas tratar erros de forma padronizada
 */
export const errorHandler = (error, req, res, _next) => {
  // Log do erro completo para debug
  logError(`Error in ${req.method} ${req.originalUrl}`, error)

  // Erros de validação (400)
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: error.message,
      details: error.details || [],
      timestamp: new Date().toISOString()
    })
  }

  // Erros de conflito (409) - slug duplicado
  if (error.name === 'ConflictError') {
    return res.status(409).json({
      error: 'Conflict',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }

  // Erros de não encontrado (404)
  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }

  // Erros de cota excedida (429)
  if (error.name === 'QuotaExceededError') {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }

  // Erros de sistema de arquivos (500)
  if (error.code === 'ENOENT' || error.code === 'EACCES') {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Storage system error',
      timestamp: new Date().toISOString()
    })
  }

  // Erros de JSON parse (400)
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON format',
      timestamp: new Date().toISOString()
    })
  }

  // Erro genérico (500)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Something went wrong',
    timestamp: new Date().toISOString()
  })
}

/**
 * Classe de erro personalizada para validações
 */
export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

/**
 * Classe de erro personalizada para conflitos
 */
export class ConflictError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConflictError'
  }
}

/**
 * Classe de erro personalizada para não encontrado
 */
export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
  }
}

/**
 * Classe de erro personalizada para cota excedida
 */
export class QuotaExceededError extends Error {
  constructor(message) {
    super(message)
    this.name = 'QuotaExceededError'
  }
}
