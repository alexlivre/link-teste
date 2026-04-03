// backend/routes/analytics.js
// Rotas de analytics seguindo Clean Code (< 30 linhas)

import { Router } from 'express'
import analyticsController from '../controllers/AnalyticsController.js'

const router = Router()

// GET /api/analytics/dashboard - Dashboard completo
router.get('/dashboard', (req, res, next) => analyticsController.getDashboard(req, res, next))

// GET /api/analytics/stats - Estatísticas gerais
router.get('/stats', (req, res, next) => analyticsController.getGeneralStats(req, res, next))

// GET /api/analytics/links/:slug - Analytics de link específico
router.get('/links/:slug', (req, res, next) => analyticsController.getLinkAnalytics(req, res, next))

// GET /api/analytics/links/:slug/quota - Status de cotas
router.get('/links/:slug/quota', (req, res, next) => analyticsController.getLinkQuotaStatus(req, res, next))

// GET /api/analytics/cache - Status do cache
router.get('/cache', (req, res, next) => analyticsController.getCacheStatus(req, res, next))

// POST /api/analytics/cache/persist - Forçar persistência
router.post('/cache/persist', (req, res, next) => analyticsController.forceCachePersist(req, res, next))

export default router
