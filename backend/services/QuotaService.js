// backend/services/QuotaService.js
// Serviço de gerenciamento de cotas seguindo Clean Code (< 120 linhas)

import { storageService } from './JsonStorageService.js'
import { QuotaExceededError } from '../middleware/errorHandler.js'

/**
 * Limites de cotas por período
 */
const QUOTA_LIMITS = {
  daily: 1000,
  weekly: 5000,
  monthly: 15000
}

/**
 * Serviço de gerenciamento de cotas
 * Single Responsibility: Apenas gerenciar verificações e controles de cotas
 */
class QuotaService {
  constructor() {
    this.storage = storageService
    this.limits = QUOTA_LIMITS
  }

  /**
   * Verifica se link pode receber mais acessos
   */
  async checkQuota(slug) {
    // Limpa cache para garantir dados atualizados
    this.storage.clearCache()
    
    const link = await this.storage.findOne(
      'links.json',
      l => l.slug === slug
    )

    if (!link) {
      return null // Link não existe
    }

    // Inicializa contadores se não existirem
    const quotas = this._initializeQuotas(link)
    
    // Verifica se precisa resetar contadores
    const now = new Date()
    this._checkAndResetCounters(quotas, now)
    
    // Verifica cada tipo de cota
    for (const [period, limit] of Object.entries(this.limits)) {
      if (quotas[period] >= limit) {
        throw new QuotaExceededError(
          `Link exceeded ${period} quota (${quotas[period]}/${limit})`
        )
      }
    }

    return quotas
  }

  /**
   * Incrementa contadores de um link
   */
  async incrementCounters(slug, isBot = false) {
    if (isBot) {
      return // Bots não contam nas cotas
    }

    const link = await this.storage.findOne(
      'links.json',
      l => l.slug === slug
    )

    if (!link) {
      return null
    }

    const quotas = this._initializeQuotas(link)
    const now = new Date()

    // Verifica se precisa resetar contadores
    this._checkAndResetCounters(quotas, now)

    // Incrementa contadores
    quotas.daily++
    quotas.weekly++
    quotas.monthly++
    quotas.total_clicks++

    // Atualiza timestamps
    quotas.last_access = now.toISOString()

    // Salva alterações
    await this.storage.updateById('links.json', link.id, quotas)
    
    return quotas
  }

  /**
   * Inicializa contadores de cotas
   */
  _initializeQuotas(link) {
    const now = new Date()
    
    return {
      id: link.id,
      slug: link.slug,
      url_destination: link.url_destination,
      folder_hash: link.folder_hash,
      created_at: link.created_at,
      daily: link.daily || 0,
      weekly: link.weekly || 0,
      monthly: link.monthly || 0,
      total_clicks: link.total_clicks || 0,
      last_reset_day: link.last_reset_day || now.toISOString(),
      last_reset_week: link.last_reset_week || now.toISOString(),
      last_reset_month: link.last_reset_month || now.toISOString(),
      last_access: link.last_access || now.toISOString()
    }
  }

  /**
   * Verifica e reseta contadores se necessário
   */
  _checkAndResetCounters(quotas, now) {
    const lastDay = new Date(quotas.last_reset_day)
    const lastWeek = new Date(quotas.last_reset_week)
    const lastMonth = new Date(quotas.last_reset_month)

    // Reset diário (00:00 UTC)
    if (this._shouldResetDaily(lastDay, now)) {
      quotas.daily = 0
      quotas.last_reset_day = now.toISOString()
    }

    // Reset semanal (7 dias após último reset)
    if (this._shouldResetWeekly(lastWeek, now)) {
      quotas.weekly = 0
      quotas.last_reset_week = now.toISOString()
    }

    // Reset mensal (30 dias após último reset)
    if (this._shouldResetMonthly(lastMonth, now)) {
      quotas.monthly = 0
      quotas.last_reset_month = now.toISOString()
    }
  }

  /**
   * Verifica se deve resetar contador diário
   */
  _shouldResetDaily(lastReset, now) {
    return lastReset.getUTCDay() !== now.getUTCDay() ||
           lastReset.getUTCMonth() !== now.getUTCMonth() ||
           lastReset.getUTCFullYear() !== now.getUTCFullYear()
  }

  /**
   * Verifica se deve resetar contador semanal
   */
  _shouldResetWeekly(lastReset, now) {
    const daysDiff = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24))
    return daysDiff >= 7
  }

  /**
   * Verifica se deve resetar contador mensal
   */
  _shouldResetMonthly(lastReset, now) {
    const daysDiff = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24))
    return daysDiff >= 30
  }

  /**
   * Obtém status atual das cotas de um link
   */
  async getQuotaStatus(slug) {
    const link = await this.storage.findOne(
      'links.json',
      l => l.slug === slug
    )

    if (!link) {
      return null
    }

    const quotas = this._initializeQuotas(link)
    
    return {
      slug: quotas.slug,
      daily: {
        current: quotas.daily,
        limit: this.limits.daily,
        percentage: (quotas.daily / this.limits.daily * 100).toFixed(1)
      },
      weekly: {
        current: quotas.weekly,
        limit: this.limits.weekly,
        percentage: (quotas.weekly / this.limits.weekly * 100).toFixed(1)
      },
      monthly: {
        current: quotas.monthly,
        limit: this.limits.monthly,
        percentage: (quotas.monthly / this.limits.monthly * 100).toFixed(1)
      },
      total_clicks: quotas.total_clicks,
      last_access: quotas.last_access
    }
  }
}

// Instância singleton
const quotaService = new QuotaService()

export { QuotaService, quotaService }
export default quotaService
