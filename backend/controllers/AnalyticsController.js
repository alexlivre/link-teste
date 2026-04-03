// backend/controllers/AnalyticsController.js
// Controller de analytics seguindo Clean Code (< 80 linhas)

import { analyticsService } from '../services/AnalyticsService.js'
import { quotaService } from '../services/QuotaService.js'
import { cacheService } from '../services/CacheService.js'

/**
 * Controller de analytics
 * Single Responsibility: Apenas gerenciar endpoints de analytics
 */
class AnalyticsController {
  constructor() {
    this.analyticsService = analyticsService
    this.quotaService = quotaService
    this.cacheService = cacheService
  }

  /**
   * Obtém estatísticas gerais
   */
  async getGeneralStats(req, res, next) {
    try {
      const stats = await this.analyticsService.getGeneralStats()
      
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Obtém analytics de um link específico
   */
  async getLinkAnalytics(req, res, next) {
    try {
      const { slug } = req.params
      const { limit = 100 } = req.query

      const analytics = await this.cacheService.getLinkAnalytics(slug, parseInt(limit))
      
      res.json({
        success: true,
        data: analytics,
        slug,
        count: analytics.length,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Obtém status de cotas de um link
   */
  async getLinkQuotaStatus(req, res, next) {
    try {
      const { slug } = req.params

      const status = await this.quotaService.getQuotaStatus(slug)
      
      if (!status) {
        return res.status(404).json({
          success: false,
          error: 'Link not found',
          slug
        })
      }

      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Obtém status do cache
   */
  async getCacheStatus(req, res, next) {
    try {
      const stats = this.cacheService.getStats()
      
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Força persistência do cache
   */
  async forceCachePersist(req, res, next) {
    try {
      await this.cacheService.forcePersist()
      
      res.json({
        success: true,
        message: 'Cache persistido com sucesso',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Obtém dashboard completo
   */
  async getDashboard(req, res, next) {
    try {
      const [generalStats, cacheStats] = await Promise.all([
        this.analyticsService.getGeneralStats(),
        Promise.resolve(this.cacheService.getStats())
      ])

      res.json({
        success: true,
        data: {
          general: generalStats,
          cache: cacheStats
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      next(error)
    }
  }
}

// Instância singleton
const analyticsController = new AnalyticsController()

export { AnalyticsController, analyticsController }
export default analyticsController
