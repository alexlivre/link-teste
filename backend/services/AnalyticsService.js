// backend/services/AnalyticsService.js
// Serviço de analytics seguindo Clean Code (< 120 linhas)

import { storageService } from './JsonStorageService.js'
import { isBot, getBotInfo } from '../utils/botDetector.js'

/**
 * Serviço de analytics
 * Single Responsibility: Apenas registrar e gerenciar analytics de cliques
 */
class AnalyticsService {
  constructor() {
    this.storage = storageService
  }

  /**
   * Registra um clique em analytics
   */
  async registerClick(link, req, isBotRequest = false) {
    const analyticsEvent = {
      id: await this.storage.getNextId('analytics.json'),
      link_id: link.id,
      slug: link.slug,
      timestamp: new Date().toISOString(),
      referer: this._getReferer(req),
      user_agent: this._getUserAgent(req),
      ip: this._getAnonymizedIP(req),
      is_bot: isBotRequest,
      bot_info: isBotRequest ? getBotInfo(req.headers['user-agent'] || '') : null,
      country: this._getCountry(req), // Futuro: geolocalização
      city: null, // Futuro: geolocalização
      device: this._getDevice(req),
      browser: this._getBrowser(req),
      os: this._getOS(req)
    }

    await this.storage.append('analytics.json', analyticsEvent)
    return analyticsEvent
  }

  /**
   * Obtém analytics de um link
   */
  async getLinkAnalytics(slug, limit = 100) {
    const events = await this.storage.find(
      'analytics.json',
      event => event.slug === slug
    )

    // Ordena por timestamp decrescente e limita
    return events
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  }

  /**
   * Obtém estatísticas gerais
   */
  async getGeneralStats() {
    const events = await this.storage.read('analytics.json')
    
    const totalClicks = events.length
    const botClicks = events.filter(e => e.is_bot).length
    const humanClicks = totalClicks - botClicks
    const uniqueLinks = new Set(events.map(e => e.slug)).size
    const todayClicks = events.filter(e => 
      this._isToday(new Date(e.timestamp))
    ).length

    // Top links
    const linkStats = {}
    events.forEach(event => {
      if (!linkStats[event.slug]) {
        linkStats[event.slug] = { clicks: 0, bots: 0 }
      }
      linkStats[event.slug].clicks++
      if (event.is_bot) linkStats[event.slug].bots++
    })

    const topLinks = Object.entries(linkStats)
      .sort(([,a], [,b]) => a.clicks - b.clicks)
      .slice(-5)
      .reverse()

    return {
      total_clicks: totalClicks,
      human_clicks: humanClicks,
      bot_clicks: botClicks,
      unique_links: uniqueLinks,
      today_clicks: todayClicks,
      top_links: topLinks.map(([slug, stats]) => ({ slug, ...stats }))
    }
  }

  /**
   * Limpa analytics antigos (30 dias)
   */
  async cleanupOldAnalytics() {
    const events = await this.storage.read('analytics.json')
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > thirtyDaysAgo
    )

    await this.storage.write('analytics.json', recentEvents)
    return events.length - recentEvents.length
  }

  /**
   * Obtém referer tratado
   */
  _getReferer(req) {
    const referer = req.headers.referer || req.headers.referrer || ''
    if (!referer) return 'direct'
    
    try {
      const url = new URL(referer)
      return url.hostname
    } catch {
      return 'invalid'
    }
  }

  /**
   * Obtém user-agent tratado
   */
  _getUserAgent(req) {
    return req.headers['user-agent'] || 'unknown'
  }

  /**
   * Obtém IP anonimizado
   */
  _getAnonymizedIP(req) {
    const ip = req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               'unknown'
    
    if (ip === 'unknown') return 'unknown'
    
    // Anonimiza último octeto para IPv4
    if (ip.includes('.')) {
      const parts = ip.split('.')
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.0`
      }
    }
    
    // Para IPv6, mantém apenas primeiro bloco
    if (ip.includes(':')) {
      const parts = ip.split(':')
      return `${parts[0]}::`
    }
    
    return 'unknown'
  }

  /**
   * Obtém país (simulação)
   */
  _getCountry(req) {
    // Futuro: implementar geolocalização real
    return 'BR' // Simulação Brasil
  }

  /**
   * Obtém tipo de dispositivo
   */
  _getDevice(req) {
    const ua = req.headers['user-agent'] || ''
    
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
      return 'mobile'
    }
    
    if (/tablet|ipad/i.test(ua)) {
      return 'tablet'
    }
    
    return 'desktop'
  }

  /**
   * Obtém browser
   */
  _getBrowser(req) {
    const ua = req.headers['user-agent'] || ''
    
    if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'chrome'
    if (/firefox/i.test(ua)) return 'firefox'
    if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'safari'
    if (/edg/i.test(ua)) return 'edge'
    if (/opera/i.test(ua)) return 'opera'
    
    return 'unknown'
  }

  /**
   * Obtém sistema operacional
   */
  _getOS(req) {
    const ua = req.headers['user-agent'] || ''
    
    if (/windows/i.test(ua)) return 'windows'
    if (/mac/i.test(ua)) return 'macos'
    if (/linux/i.test(ua)) return 'linux'
    if (/android/i.test(ua)) return 'android'
    if (/ios|iphone|ipad/i.test(ua)) return 'ios'
    
    return 'unknown'
  }

  /**
   * Verifica se data é hoje
   */
  _isToday(date) {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  /**
   * Obtém eventos de hoje
   */
  async getTodayEvents() {
    const events = await this.storage.read('analytics.json')
    return events.filter(event => this._isToday(new Date(event.timestamp)))
  }

  /**
   * Obtém todos os eventos
   */
  async getAllEvents() {
    return this.storage.read('analytics.json')
  }

  /**
   * Limpa eventos antigos
   */
  async clearOldEvents(days = 30) {
    const events = await this.storage.read('analytics.json')
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > cutoffDate
    )

    await this.storage.write('analytics.json', recentEvents)
    return events.length - recentEvents.length
  }
}

// Instância singleton
const analyticsService = new AnalyticsService()

export { AnalyticsService, analyticsService }
export default analyticsService
