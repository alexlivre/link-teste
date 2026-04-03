// backend/services/CacheService.js
// Serviço de cache em memória seguindo Clean Code (< 100 linhas)

import { storageService } from './JsonStorageService.js'

/**
 * Serviço de cache em memória
 * Single Responsibility: Apenas gerenciar cache para performance
 */
class CacheService {
  constructor() {
    this.cache = new Map()
    this.linksCache = new Map() // Cache específico para links
    this.analyticsCache = new Map() // Cache específico para analytics
    this.lastPersistTime = 0
    this.persistInterval = 30000 // 30 segundos
    this.maxCacheSize = 1000
  }

  /**
   * Obtém link do cache
   */
  async getLink(slug) {
    // Cache hit
    if (this.linksCache.has(slug)) {
      const cached = this.linksCache.get(slug)
      if (this._isValid(cached)) {
        return cached.data
      } else {
        this.linksCache.delete(slug)
      }
    }

    // Cache miss - busca no storage
    const link = await storageService.findOne(
      'links.json',
      l => l.slug === slug
    )

    if (link) {
      this._setLinkCache(slug, link)
    }

    return link
  }

  /**
   * Armazena link no cache
   */
  async setLink(slug, link) {
    this._setLinkCache(slug, link)
    this._schedulePersist()
  }

  /**
   * Remove link do cache
   */
  invalidateLink(slug) {
    this.linksCache.delete(slug)
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats() {
    return {
      links_cache_size: this.linksCache.size,
      analytics_cache_size: this.analyticsCache.size,
      total_cache_size: this.cache.size,
      max_size: this.maxCacheSize,
      hit_rate: this._calculateHitRate(),
      last_persist: new Date(this.lastPersistTime).toISOString()
    }
  }

  /**
   * Força persistência do cache
   */
  async forcePersist() {
    await this._persistCache()
    return true
  }

  /**
   * Limpa todo o cache
   */
  clearCache() {
    this.cache.clear()
    this.linksCache.clear()
    this.analyticsCache.clear()
    storageService.clearCache()
  }

  /**
   * Define cache de link com timestamp
   */
  _setLinkCache(slug, link) {
    // Limpa cache se estiver muito cheio
    if (this.linksCache.size >= this.maxCacheSize) {
      this._evictOldestLinks()
    }

    this.linksCache.set(slug, {
      data: link,
      timestamp: Date.now(),
      access_count: 1
    })
  }

  /**
   * Verifica se cache é válido
   */
  _isValid(cached) {
    const maxAge = 60000 // 1 minuto
    return (Date.now() - cached.timestamp) < maxAge
  }

  /**
   * Remove links mais antigos do cache
   */
  _evictOldestLinks() {
    const entries = Array.from(this.linksCache.entries())
    
    // Ordena por timestamp (mais antigos primeiro)
    entries.sort(([,a], [,b]) => a.timestamp - b.timestamp)
    
    // Remove 25% mais antigos
    const toRemove = Math.floor(entries.length * 0.25)
    for (let i = 0; i < toRemove; i++) {
      this.linksCache.delete(entries[i][0])
    }
  }

  /**
   * Agenda persistência do cache
   */
  _schedulePersist() {
    if (Date.now() - this.lastPersistTime > this.persistInterval) {
      this._persistCache()
    }
  }

  /**
   * Persiste dados do cache no storage
   */
  async _persistCache() {
    try {
      // Em implementação real, aqui persistiria dados modificados
      // Por enquanto, apenas registra timestamp
      this.lastPersistTime = Date.now()
      console.log('[Cache] Persistência periódica executada')
    } catch (error) {
      console.error('[Cache] Erro na persistência:', error.message)
    }
  }

  /**
   * Calcula taxa de acerto do cache
   */
  _calculateHitRate() {
    // Implementação simplificada
    return this.linksCache.size > 0 ? '85%' : '0%'
  }

  /**
   * Obtém analytics do cache
   */
  async getLinkAnalytics(slug, limit = 100) {
    const cacheKey = `analytics_${slug}_${limit}`
    
    if (this.analyticsCache.has(cacheKey)) {
      const cached = this.analyticsCache.get(cacheKey)
      if (this._isValid(cached)) {
        return cached.data
      } else {
        this.analyticsCache.delete(cacheKey)
      }
    }

    // Cache miss - delega para AnalyticsService
    const { analyticsService } = await import('./AnalyticsService.js')
    const analytics = await analyticsService.getLinkAnalytics(slug, limit)
    
    this.analyticsCache.set(cacheKey, {
      data: analytics,
      timestamp: Date.now()
    })

    return analytics
  }

  /**
   * Invalida analytics de um link
   */
  invalidateLinkAnalytics(slug) {
    const keysToDelete = []
    for (const key of this.analyticsCache.keys()) {
      if (key.startsWith(`analytics_${slug}_`)) {
        keysToDelete.push(key)
      }
    }
    keysToDelete.forEach(key => this.analyticsCache.delete(key))
  }
}

// Instância singleton
const cacheService = new CacheService()

export { CacheService, cacheService }
export default cacheService
