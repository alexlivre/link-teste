// backend/middleware/adminAuth.js
// Middleware de autenticação admin seguindo Clean Code (< 50 linhas)

/**
 * Middleware para autenticação de rotas admin
 * Single Responsibility: Apenas validar token admin
 */
export const adminAuthMiddleware = (req, res, next) => {
  // Em ambiente de desenvolvimento, permitir acesso sem autenticação
  // ou quando não há variável NODE_ENV definida
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  
  if (isDev) {
    req.admin = {
      username: 'admin',
      role: 'admin'
    }
    return next()
  }

  // Verificar header de autorização
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de autenticação não fornecido' 
    })
  }

  try {
    // Validar token mock (mesma lógica do frontend)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    const now = Date.now() / 1000

    if (payload.exp > now && payload.username === 'admin') {
      req.admin = {
        username: payload.username,
        role: 'admin'
      }
      next()
    } else {
      res.status(401).json({ 
        error: 'Token inválido ou expirado' 
      })
    }
  } catch {
    res.status(401).json({ 
      error: 'Token mal formatado' 
    })
  }
}
