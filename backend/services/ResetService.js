// backend/services/ResetService.js
// Serviço de reset automático de contadores seguindo Clean Code (< 80 linhas)

import { quotaService } from './QuotaService.js'
import { storageService } from './JsonStorageService.js'

/**
 * Serviço de reset automático de contadores
 * Single Responsibility: Apenas gerenciar resets automáticos de cotas
 */
class ResetService {
  constructor() {
    this.quotaService = quotaService
    this.storage = storageService
    this.resetInterval = null
    this.checkIntervalMs = 60000 // Verifica a cada minuto
  }

  /**
   * Inicia serviço de reset automático
   */
  start() {
    if (this.resetInterval) {
      this.stop()
    }

    console.log('[ResetService] Iniciando serviço de reset automático')
    
    // Verifica imediatamente ao iniciar
    this.checkAndResetAll()
    
    // Configura verificação periódica
    this.resetInterval = setInterval(() => {
      this.checkAndResetAll()
    }, this.checkIntervalMs)
  }

  /**
   * Para serviço de reset automático
   */
  stop() {
    if (this.resetInterval) {
      clearInterval(this.resetInterval)
      this.resetInterval = null
      console.log('[ResetService] Serviço de reset automático parado')
    }
  }

  /**
   * Verifica e reseta todos os contadores se necessário
   */
  async checkAndResetAll() {
    try {
      const links = await this.storage.read('links.json')
      const now = new Date()
      let resetCount = 0

      for (const link of links) {
        const needsReset = this.checkIfNeedsReset(link, now)
        
        if (needsReset.daily || needsReset.weekly || needsReset.monthly) {
          await this.resetLinkCounters(link.id, needsReset, now)
          resetCount++
        }
      }

      if (resetCount > 0) {
        console.log(`[ResetService] ${resetCount} links resetados em ${new Date().toISOString()}`)
      }

    } catch (error) {
      console.error('[ResetService] Erro ao verificar resets:', error.message)
    }
  }

  /**
   * Verifica se link precisa de reset
   */
  checkIfNeedsReset(link, now = new Date()) {
    const needsReset = {
      daily: false,
      weekly: false,
      monthly: false
    }

    // Reset diário (00:00 UTC)
    if (link.last_reset_day) {
      const lastReset = new Date(link.last_reset_day)
      if (this.shouldResetDaily(lastReset, now)) {
        needsReset.daily = true
      }
    }

    // Reset semanal (7 dias após último reset)
    if (link.last_reset_week) {
      const lastReset = new Date(link.last_reset_week)
      if (this.shouldResetWeekly(lastReset, now)) {
        needsReset.weekly = true
      }
    }

    // Reset mensal (30 dias após último reset)
    if (link.last_reset_month) {
      const lastReset = new Date(link.last_reset_month)
      if (this.shouldResetMonthly(lastReset, now)) {
        needsReset.monthly = true
      }
    }

    return needsReset
  }

  /**
   * Reseta contadores de um link específico
   */
  async resetLinkCounters(linkId, needsReset, now = new Date()) {
    const updates = {}
    
    if (needsReset.daily) {
      updates.daily = 0
      updates.last_reset_day = now.toISOString()
    }
    
    if (needsReset.weekly) {
      updates.weekly = 0
      updates.last_reset_week = now.toISOString()
    }
    
    if (needsReset.monthly) {
      updates.monthly = 0
      updates.last_reset_month = now.toISOString()
    }

    await this.storage.updateById('links.json', linkId, updates)
  }

  /**
   * Força reset manual de todos os contadores de um link
   */
  async forceResetLink(linkId) {
    const now = new Date()
    const updates = {
      daily: 0,
      weekly: 0,
      monthly: 0,
      last_reset_day: now.toISOString(),
      last_reset_week: now.toISOString(),
      last_reset_month: now.toISOString()
    }

    await this.storage.updateById('links.json', linkId, updates)
    console.log(`[ResetService] Link ${linkId} resetado manualmente`)
  }

  /**
   * Força reset manual de todos os links
   */
  async forceResetAll() {
    try {
      const links = await this.storage.read('links.json')
      const now = new Date()

      for (const link of links) {
        await this.forceResetLink(link.id)
      }

      console.log(`[ResetService] Todos os ${links.length} links resetados manualmente`)
    } catch (error) {
      console.error('[ResetService] Erro ao resetar todos os links:', error.message)
    }
  }

  /**
   * Verifica se deve resetar contador diário
   */
  shouldResetDaily(lastReset, now) {
    return lastReset.getUTCDay() !== now.getUTCDay() ||
           lastReset.getUTCMonth() !== now.getUTCMonth() ||
           lastReset.getUTCFullYear() !== now.getUTCFullYear()
  }

  /**
   * Verifica se deve resetar contador semanal
   */
  shouldResetWeekly(lastReset, now) {
    const daysDiff = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24))
    return daysDiff >= 7
  }

  /**
   * Verifica se deve resetar contador mensal
   */
  shouldResetMonthly(lastReset, now) {
    const daysDiff = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24))
    return daysDiff >= 30
  }

  /**
   * Obtém status do serviço
   */
  getStatus() {
    return {
      running: !!this.resetInterval,
      checkInterval: this.checkIntervalMs,
      nextCheck: this.resetInterval ? new Date(Date.now() + this.checkIntervalMs).toISOString() : null
    }
  }
}

// Instância singleton
const resetService = new ResetService()

export { ResetService, resetService }
export default resetService
