// backend/routes/admin.js
// Rotas administrativas seguindo Clean Code (< 100 linhas)

import { Router } from 'express'
import { AdminController } from '../controllers/AdminController.js'
import { adminAuthMiddleware } from '../middleware/adminAuth.js'

const router = Router()
const adminController = new AdminController()

/**
 * Middleware de autenticação admin para todas as rotas
 */
router.use(adminAuthMiddleware)

/**
 * GET /api/admin/metrics
 * Retorna métricas do dashboard
 */
router.get('/metrics', adminController.getMetrics)

/**
 * GET /api/admin/links
 * Lista todos os links com paginação e filtros
 */
router.get('/links', adminController.getLinks)

/**
 * DELETE /api/admin/links/:id
 * Exclui um link específico
 */
router.delete('/links/:id', adminController.deleteLink)

/**
 * POST /api/admin/links/:id/reset
 * Reseta contadores de um link
 */
router.post('/links/:id/reset', adminController.resetLinkCounters)

/**
 * GET /api/admin/folder/:hash
 * Busca pasta por hash
 */
router.get('/folder/:hash', adminController.getFolderByHash)

/**
 * POST /api/admin/folder/:hash/ban
 * Banir pasta (desativa todos os links)
 */
router.post('/folder/:hash/ban', adminController.banFolder)

/**
 * GET /api/admin/analytics
 * Lista analytics detalhados com filtros
 */
router.get('/analytics', adminController.getAnalytics)

/**
 * DELETE /api/admin/analytics
 * Limpa analytics antigos
 */
router.delete('/analytics', adminController.clearAnalytics)

/**
 * POST /api/admin/reset-all
 * Reseta todos os contadores
 */
router.post('/reset-all', adminController.resetAllCounters)

/**
 * GET /api/admin/export
 * Exporta todos os dados
 */
router.get('/export', adminController.exportData)

/**
 * GET /api/admin/system
 * Informações do sistema
 */
router.get('/system', adminController.getSystemInfo)

/**
 * POST /api/admin/ip/ban
 * Banir IP
 */
router.post('/ip/ban', adminController.banIP)

/**
 * POST /api/admin/ip/unban
 * Desbanir IP
 */
router.post('/ip/unban', adminController.unbanIP)

/**
 * GET /api/admin/ip/banned
 * Lista IPs banidos
 */
router.get('/ip/banned', adminController.getBannedIPs)

/**
 * GET /api/admin/users
 * Lista usuários
 */
router.get('/users', adminController.getUsers)

/**
 * POST /api/admin/users/:id/ban
 * Banir usuário
 */
router.post('/users/:id/ban', adminController.banUser)

/**
 * POST /api/admin/users/:id/unban
 * Desbanir usuário
 */
router.post('/users/:id/unban', adminController.unbanUser)

/**
 * POST /api/admin/users/:id/promote
 * Promover usuário
 */
router.post('/users/:id/promote', adminController.promoteUser)

/**
 * GET /api/admin/logs
 * Lista logs
 */
router.get('/logs', adminController.getLogs)

/**
 * POST /api/admin/maintenance
 * Toggle modo manutenção
 */
router.post('/maintenance', adminController.toggleMaintenance)

/**
 * GET /api/admin/maintenance
 * Status modo manutenção
 */
router.get('/maintenance', adminController.getMaintenanceStatus)

/**
 * POST /api/admin/cache/clear
 * Limpar cache
 */
router.post('/cache/clear', adminController.clearCache)

/**
 * POST /api/admin/cache/rebuild
 * Rebuild cache
 */
router.post('/cache/rebuild', adminController.rebuildCache)

/**
 * POST /api/admin/broadcast
 * Enviar broadcast
 */
router.post('/broadcast', adminController.broadcast)

/**
 * GET /api/admin/broadcast
 * Lista broadcasts
 */
router.get('/broadcast', adminController.getBroadcasts)

/**
 * POST /api/admin/rate-limit
 * Configurar rate limiting
 */
router.post('/rate-limit', adminController.configureRateLimit)

/**
 * GET /api/admin/rate-limit
 * Status rate limiting
 */
router.get('/rate-limit', adminController.getRateLimitConfig)

/**
 * GET /api/admin/health
 * Health check
 */
router.get('/health', adminController.healthCheck)

/**
 * DELETE /api/admin/links/bulk
 * Excluir múltiplos links
 */
router.delete('/links/bulk', adminController.bulkDeleteLinks)

/**
 * POST /api/admin/links/bulk-toggle
 * Toggle múltiplos links
 */
router.post('/links/bulk-toggle', adminController.bulkToggleLinks)

export default router
