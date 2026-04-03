// backend/middleware/logger.js
// Middleware de logging seguindo Clean Code (< 50 linhas)

/**
 * Middleware para logging de requisições HTTP
 * Single Responsibility: Apenas registrar logs das requisições
 */
export const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log da requisição
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  
  // Intercepta o método res.end para log da resposta
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ` +
      `${res.statusCode} - ${duration}ms - ${logLevel}`
    );
    
    // Chama o método original
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

/**
 * Logger simplificado para erros
 */
export const logError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`);
  if (error && error.stack) {
    console.error(error.stack);
  }
};

/**
 * Logger simplificado para informações
 */
export const logInfo = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] INFO: ${message}`);
};
