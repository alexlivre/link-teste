// backend/middleware/redirectMiddleware.js
// Middleware de redirecionamento 301 seguindo Clean Code (< 80 linhas)

import { cacheService } from '../services/CacheService.js'
import { quotaService } from '../services/QuotaService.js'
import { analyticsService } from '../services/AnalyticsService.js'
import { NotFoundError, QuotaExceededError } from './errorHandler.js'
import { isBot } from '../utils/botDetector.js'

/**
 * Middleware de redirecionamento
 * Single Responsibility: Apenas processar redirecionamentos de slugs
 */
class RedirectMiddleware {
  constructor() {
    this.cacheService = cacheService
    this.quotaService = quotaService
    this.analyticsService = analyticsService
  }

  /**
   * Middleware principal para redirecionamento
   */
  async handle(req, res, next) {
    try {
      const { slug } = req.params
      
      if (!slug || !/^[a-zA-Z0-9-_]+$/.test(slug)) {
        throw new NotFoundError('Invalid slug format')
      }

      // Busca link usando cache
      const link = await this.cacheService.getLink(slug)

      if (!link) {
        throw new NotFoundError(`Link with slug "${slug}" not found`)
      }

      // Detecta se é bot
      const isBotRequest = this._isBot(req)

      // Verifica cotas (bots não precisam verificar cotas)
      if (!isBotRequest) {
        await this.quotaService.checkQuota(slug)
      }

      // Registra analytics
      await this._registerAnalytics(req, link, isBotRequest)

      // Incrementa contadores
      await this.quotaService.incrementCounters(slug, isBotRequest)
      
      // Invalida cache do link após incremento
      this.cacheService.invalidateLink(slug)
      
      // Redirecionamento 301
      res.redirect(301, link.url_destination)

    } catch (error) {
      next(error)
    }
  }

  /**
   * Verifica se é bot
   */
  _isBot(req) {
    return isBot(req.headers['user-agent'] || '')
  }

  /**
   * Registra analytics
   */
  async _registerAnalytics(req, link, isBot) {
    try {
      await this.analyticsService.registerClick(link, req, isBot)
      // Invalida cache de analytics do link
      this.cacheService.invalidateLinkAnalytics(link.slug)
    } catch (error) {
      // Analytics não deve quebrar o redirecionamento
      console.error('[Analytics Error]', error.message)
    }
  }
}

// Instância singleton
const redirectMiddleware = new RedirectMiddleware()

/**
 * Middleware wrapper para Express
 */
const redirectHandler = (req, res, next) => {
  redirectMiddleware.handle(req, res, next)
}

export { RedirectMiddleware, redirectMiddleware, redirectHandler }
export default redirectHandler
