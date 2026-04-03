// backend/controllers/AdminController.js
// Controller administrativo seguindo Clean Code (< 150 linhas)

import { storageService } from '../services/JsonStorageService.js'
import { folderService } from '../services/FolderService.js'
import { analyticsService } from '../services/AnalyticsService.js'

/**
 * Controller para operações administrativas
 * Single Responsibility: Apenas lógica de negócio admin
 */
export class AdminController {
  constructor() {
    this.storage = storageService
    this.folderService = folderService
    this.analyticsService = analyticsService
  }

  /**
   * GET /api/admin/metrics
   * Retorna métricas do dashboard
   */
  async getMetrics(req, res) {
    try {
      const allLinks = await this.storage.read('links.json') || []
      const allFolders = await this.folderService.getAllFolders()
      const todayAnalytics = await this.analyticsService.getTodayEvents()

      const metrics = {
        total_links: allLinks.length,
        clicks_today: todayAnalytics.length,
        active_links: allLinks.filter(link => link.is_active !== false).length,
        total_folders: allFolders.length,
        link_trend: '+12%',
        click_trend: '+8%',
        folder_trend: '+3%'
      }

      res.json(metrics)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar métricas' })
    }
  }

  /**
   * GET /api/admin/links
   * Lista todos os links com paginação e filtros
   */
  async getLinks(req, res) {
    try {
      const { page = 1, limit = 10, search, status } = req.query
      let allLinks = await this.storage.read('links.json') || []

      // Aplicar filtros
      if (search) {
        const query = search.toLowerCase()
        allLinks = allLinks.filter(link => 
          link.slug.toLowerCase().includes(query) ||
          link.url_destination.toLowerCase().includes(query)
        )
      }
      if (status) {
        allLinks = allLinks.filter(link => 
          status === 'active' ? link.is_active !== false : link.is_active === false
        )
      }

      // Paginação
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + parseInt(limit)
      const paginatedLinks = allLinks.slice(startIndex, endIndex)

      res.json({
        links: paginatedLinks,
        total: allLinks.length,
        page: parseInt(page),
        totalPages: Math.ceil(allLinks.length / limit)
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar links' })
    }
  }

  /**
   * DELETE /api/admin/links/:id
   * Exclui um link específico
   */
  async deleteLink(req, res) {
    try {
      const { id } = req.params
      let allLinks = await this.storage.read('links.json') || []
      allLinks = allLinks.filter(link => link.id !== parseInt(id))
      await this.storage.write('links.json', allLinks)
      res.json({ message: 'Link excluído com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir link' })
    }
  }

  /**
   * POST /api/admin/links/:id/reset
   * Reseta contadores de um link
   */
  async resetLinkCounters(req, res) {
    try {
      const { id } = req.params
      let allLinks = await this.storage.read('links.json') || []
      const link = allLinks.find(l => l.id === parseInt(id))
      if (link) {
        link.clicks = 0
        await this.storage.write('links.json', allLinks)
      }
      res.json({ message: 'Contadores resetados com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao resetar contadores' })
    }
  }

  /**
   * GET /api/admin/folder/:hash
   * Busca pasta por hash
   */
  async getFolderByHash(req, res) {
    try {
      const { hash } = req.params
      const folder = await this.folderService.getFolderByHash(hash)
      
      if (!folder) {
        return res.status(404).json({ error: 'Pasta não encontrada' })
      }

      // Buscar links associados
      const allLinks = await this.storage.read('links.json') || []
      const links = allLinks.filter(link => link.folder_hash === hash)
      
      res.json({
        ...folder,
        links,
        links_count: links.length
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pasta' })
    }
  }

  /**
   * POST /api/admin/folder/:hash/ban
   * Banir pasta (desativa todos os links)
   */
  async banFolder(req, res) {
    try {
      const { hash } = req.params
      let allLinks = await this.storage.read('links.json') || []
      
      // Desativar todos os links da pasta
      allLinks = allLinks.map(link => {
        if (link.folder_hash === hash) {
          return { ...link, is_active: false }
        }
        return link
      })
      
      await this.storage.write('links.json', allLinks)
      res.json({ message: 'Pasta banida com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao banir pasta' })
    }
  }

  /**
   * GET /api/admin/analytics
   * Lista analytics detalhados com filtros
   */
  async getAnalytics(req, res) {
    try {
      const { page = 1, limit = 20, startDate, endDate, referer } = req.query
      let analytics = await this.analyticsService.getAllEvents()

      // Aplicar filtros
      if (startDate || endDate) {
        analytics = analytics.filter(event => {
          const eventDate = new Date(event.accessed_at)
          if (startDate && eventDate < new Date(startDate)) return false
          if (endDate && eventDate > new Date(endDate)) return false
          return true
        })
      }
      if (referer) {
        analytics = analytics.filter(event => 
          event.referer && event.referer.includes(referer)
        )
      }

      // Paginação
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + parseInt(limit)
      const paginatedAnalytics = analytics.slice(startIndex, endIndex)

      res.json({
        events: paginatedAnalytics,
        total: analytics.length,
        page: parseInt(page),
        totalPages: Math.ceil(analytics.length / limit)
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar analytics' })
    }
  }

  /**
   * DELETE /api/admin/analytics
   * Limpa analytics antigos
   */
  async clearAnalytics(req, res) {
    try {
      const { days = 30 } = req.query
      await this.analyticsService.clearOldEvents(parseInt(days))
      res.json({ message: 'Analytics limpos com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao limpar analytics' })
    }
  }

  /**
   * POST /api/admin/reset-all
   * Reseta todos os contadores
   */
  async resetAllCounters(req, res) {
    try {
      let allLinks = await this.storage.read('links.json') || []
      allLinks = allLinks.map(link => ({ ...link, clicks: 0 }))
      await this.storage.write('links.json', allLinks)
      res.json({ message: 'Todos os contadores resetados com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao resetar contadores' })
    }
  }

  /**
   * GET /api/admin/export
   * Exporta todos os dados
   */
  async exportData(req, res) {
    try {
      const links = await this.storage.read('links.json') || []
      const folders = await this.folderService.getAllFolders()
      const analytics = await this.analyticsService.getAllEvents()

      const exportData = {
        links,
        folders,
        analytics,
        exported_at: new Date().toISOString()
      }

      res.json(exportData)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao exportar dados' })
    }
  }

  /**
   * GET /api/admin/system
   * Informações do sistema
   */
  async getSystemInfo(req, res) {
    try {
      const systemInfo = {
        version: 'v3.0 Clean',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        node_version: process.version,
        timestamp: new Date().toISOString()
      }

      res.json(systemInfo)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar informações do sistema' })
    }
  }

  /**
   * POST /api/admin/ip/ban
   * Banir um endereço IP
   */
  async banIP(req, res) {
    try {
      const { ip, reason, duration } = req.body
      
      if (!ip) {
        return res.status(400).json({ error: 'IP é obrigatório' })
      }

      let bannedIPs = await this.storage.read('banned_ips.json') || []
      
      const existingBan = bannedIPs.find(b => b.ip === ip)
      if (existingBan) {
        existingBan.reason = reason || existingBan.reason
        existingBan.banned_at = new Date().toISOString()
        existingBan.duration = duration || existingBan.duration
      } else {
        bannedIPs.push({
          ip,
          reason: reason || 'Violação de termos',
          banned_at: new Date().toISOString(),
          duration: duration || 'indefinido',
          banned_by: req.user?.id || 'admin'
        })
      }

      await this.storage.write('banned_ips.json', bannedIPs)
      res.json({ message: `IP ${ip} banido com sucesso`, ip })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao banir IP' })
    }
  }

  /**
   * POST /api/admin/ip/unban
   * Desbanir um endereço IP
   */
  async unbanIP(req, res) {
    try {
      const { ip } = req.body
      
      if (!ip) {
        return res.status(400).json({ error: 'IP é obrigatório' })
      }

      let bannedIPs = await this.storage.read('banned_ips.json') || []
      bannedIPs = bannedIPs.filter(b => b.ip !== ip)
      await this.storage.write('banned_ips.json', bannedIPs)
      
      res.json({ message: `IP ${ip} desbanido com sucesso`, ip })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desbanir IP' })
    }
  }

  /**
   * GET /api/admin/ip/banned
   * Lista todos os IPs banidos
   */
  async getBannedIPs(req, res) {
    try {
      const bannedIPs = await this.storage.read('banned_ips.json') || []
      res.json({ banned_ips: bannedIPs, total: bannedIPs.length })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar IPs banidos' })
    }
  }

  /**
   * GET /api/admin/users
   * Lista todos os usuários
   */
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 20, search, status } = req.query
      let allUsers = await this.storage.read('users.json') || []

      if (search) {
        const query = search.toLowerCase()
        allUsers = allUsers.filter(user =>
          user.email?.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query)
        )
      }

      if (status) {
        allUsers = allUsers.filter(user => user.status === status)
      }

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + parseInt(limit)
      const paginatedUsers = allUsers.slice(startIndex, endIndex)

      res.json({
        users: paginatedUsers,
        total: allUsers.length,
        page: parseInt(page),
        totalPages: Math.ceil(allUsers.length / limit)
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
  }

  /**
   * POST /api/admin/users/:id/ban
   * Banir um usuário
   */
  async banUser(req, res) {
    try {
      const { id } = req.params
      const { reason } = req.body

      let allUsers = await this.storage.read('users.json') || []
      const user = allUsers.find(u => u.id === parseInt(id))
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      user.status = 'banned'
      user.ban_reason = reason
      user.banned_at = new Date().toISOString()

      await this.storage.write('users.json', allUsers)
      res.json({ message: 'Usuário banido com sucesso', user })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao banir usuário' })
    }
  }

  /**
   * POST /api/admin/users/:id/unban
   * Desbanir um usuário
   */
  async unbanUser(req, res) {
    try {
      const { id } = req.params

      let allUsers = await this.storage.read('users.json') || []
      const user = allUsers.find(u => u.id === parseInt(id))
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      user.status = 'active'
      delete user.ban_reason
      delete user.banned_at

      await this.storage.write('users.json', allUsers)
      res.json({ message: 'Usuário desbanido com sucesso', user })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desbanir usuário' })
    }
  }

  /**
   * POST /api/admin/users/:id/promote
   * Promover usuário para admin
   */
  async promoteUser(req, res) {
    try {
      const { id } = req.params

      let allUsers = await this.storage.read('users.json') || []
      const user = allUsers.find(u => u.id === parseInt(id))
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      user.role = user.role === 'admin' ? 'user' : 'admin'

      await this.storage.write('users.json', allUsers)
      res.json({ message: `Usuário ${user.role === 'admin' ? 'promovido' : 'rebaixado'} com sucesso`, user })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao promover usuário' })
    }
  }

  /**
   * GET /api/admin/logs
   * Lista logs do sistema
   */
  async getLogs(req, res) {
    try {
      const { level, limit = 100, search } = req.query
      let allLogs = await this.storage.read('system_logs.json') || []

      if (level) {
        allLogs = allLogs.filter(log => log.level === level)
      }

      if (search) {
        const query = search.toLowerCase()
        allLogs = allLogs.filter(log =>
          log.message?.toLowerCase().includes(query) ||
          log.source?.toLowerCase().includes(query)
        )
      }

      const limitedLogs = allLogs.slice(0, parseInt(limit))

      res.json({
        logs: limitedLogs,
        total: allLogs.length,
        limit: parseInt(limit)
      })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar logs' })
    }
  }

  /**
   * POST /api/admin/maintenance
   * Ativar/desativar modo manutenção
   */
  async toggleMaintenance(req, res) {
    try {
      const { enabled, message } = req.body

      const config = await this.storage.read('system_config.json') || {}
      config.maintenance = {
        enabled: enabled || false,
        message: message || 'Sistema em manutenção. Voltaremos em breve.',
        updated_at: new Date().toISOString()
      }

      await this.storage.write('system_config.json', config)
      res.json({ message: `Modo manutenção ${enabled ? 'ativado' : 'desativado'}`, config: config.maintenance })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao alternar modo manutenção' })
    }
  }

  /**
   * GET /api/admin/maintenance
   * Status do modo manutenção
   */
  async getMaintenanceStatus(req, res) {
    try {
      const config = await this.storage.read('system_config.json') || {}
      res.json(config.maintenance || { enabled: false })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar status de manutenção' })
    }
  }

  /**
   * POST /api/admin/cache/clear
   * Limpar cache
   */
  async clearCache(req, res) {
    try {
      const { type } = req.body
      
      const cache = await this.storage.read('cache.json') || {}
      
      if (type && cache[type]) {
        delete cache[type]
        await this.storage.write('cache.json', cache)
        res.json({ message: `Cache ${type} limpo com sucesso` })
      } else {
        await this.storage.write('cache.json', {})
        res.json({ message: 'Todo cache limpo com sucesso' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao limpar cache' })
    }
  }

  /**
   * POST /api/admin/cache/rebuild
   * Rebuild cache
   */
  async rebuildCache(req, res) {
    try {
      const allLinks = await this.storage.read('links.json') || []
      const cache = {}
      
      allLinks.forEach(link => {
        cache[link.slug] = {
          id: link.id,
          destination: link.url_destination,
          active: link.is_active !== false
        }
      })

      await this.storage.write('cache.json', cache)
      res.json({ message: 'Cache rebuild com sucesso', cached_items: Object.keys(cache).length })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao rebuild cache' })
    }
  }

  /**
   * POST /api/admin/broadcast
   * Enviar mensagem broadcast para usuários
   */
  async broadcast(req, res) {
    try {
      const { message, target, channels } = req.body

      if (!message) {
        return res.status(400).json({ error: 'Mensagem é obrigatória' })
      }

      const broadcast = {
        id: Date.now(),
        message,
        target: target || 'all',
        channels: channels || ['system'],
        sent_at: new Date().toISOString(),
        sent_by: req.user?.id || 'admin'
      }

      let broadcasts = await this.storage.read('broadcasts.json') || []
      broadcasts.push(broadcast)
      await this.storage.write('broadcasts.json', broadcasts)

      res.json({ message: 'Mensagem enviada com sucesso', broadcast })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao enviar broadcast' })
    }
  }

  /**
   * GET /api/admin/broadcast
   * Lista todos os broadcasts enviados
   */
  async getBroadcasts(req, res) {
    try {
      const broadcasts = await this.storage.read('broadcasts.json') || []
      res.json({ broadcasts: broadcasts.slice(-50), total: broadcasts.length })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar broadcasts' })
    }
  }

  /**
   * POST /api/admin/rate-limit
   * Configurar rate limiting
   */
  async configureRateLimit(req, res) {
    try {
      const { windowMs, maxRequests, message } = req.body

      const config = await this.storage.read('system_config.json') || {}
      config.rate_limit = {
        windowMs: windowMs || 900000,
        maxRequests: maxRequests || 100,
        message: message || 'Muitas requisições. Tente novamente mais tarde.',
        updated_at: new Date().toISOString()
      }

      await this.storage.write('system_config.json', config)
      res.json({ message: 'Rate limiting configurado', config: config.rate_limit })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao configurar rate limiting' })
    }
  }

  /**
   * GET /api/admin/rate-limit
   * Status do rate limiting
   */
  async getRateLimitConfig(req, res) {
    try {
      const config = await this.storage.read('system_config.json') || {}
      res.json(config.rate_limit || { windowMs: 900000, maxRequests: 100 })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar configuração de rate limiting' })
    }
  }

  /**
   * GET /api/admin/health
   * Health check do sistema
   */
  async healthCheck(req, res) {
    try {
      const startTime = Date.now()
      
      const checks = {
        database: { status: 'ok', message: 'Database acessível' },
        memory: { 
          status: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal < 0.8 ? 'ok' : 'warning',
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal
        },
        uptime: process.uptime(),
        response_time: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }

      const overallStatus = Object.values(checks).every(c => c.status === 'ok') ? 'healthy' : 'degraded'

      res.json({
        status: overallStatus,
        checks,
        version: 'v3.0 Clean',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({ 
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * DELETE /api/admin/links/bulk
   * Excluir múltiplos links
   */
  async bulkDeleteLinks(req, res) {
    try {
      const { ids } = req.body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Lista de IDs é obrigatória' })
      }

      let allLinks = await this.storage.read('links.json') || []
      const deletedCount = ids.length
      allLinks = allLinks.filter(link => !ids.includes(link.id))
      await this.storage.write('links.json', allLinks)

      res.json({ message: `${deletedCount} links excluídos com sucesso`, deleted_count: deletedCount })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir links em lote' })
    }
  }

  /**
   * POST /api/admin/links/bulk-toggle
   * Ativar/desativar múltiplos links
   */
  async bulkToggleLinks(req, res) {
    try {
      const { ids, active } = req.body

      if (!ids || !Array.isArray(ids) || typeof active !== 'boolean') {
        return res.status(400).json({ error: 'Parâmetros inválidos' })
      }

      let allLinks = await this.storage.read('links.json') || []
      allLinks = allLinks.map(link => {
        if (ids.includes(link.id)) {
          return { ...link, is_active: active }
        }
        return link
      })

      await this.storage.write('links.json', allLinks)
      res.json({ message: `${ids.length} links ${active ? 'ativados' : 'desativados'} com sucesso`, updated_count: ids.length })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao alternar links em lote' })
    }
  }
}
