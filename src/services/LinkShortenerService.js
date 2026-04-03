// src/services/LinkShortenerService.js
// Serviço de encurtamento de links seguindo Clean Code (< 80 linhas)

import httpService from './HttpClientService.js'

/**
 * Serviço de encurtamento de links
 * Single Responsibility: Apenas gerenciar operações de links
 */
class LinkShortenerService {
  /**
   * Cria um novo link encurtado
   */
  async createLink(url, slug = null, folderHash = null) {
    const data = {
      url,
      ...(slug && { slug }),
      ...(folderHash && { folder_hash: folderHash })
    }

    const response = await httpService.post('/links', data)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create link')
    }

    return response.data
  }

  /**
   * Lista todos os links (para debug/admin)
   */
  async listLinks() {
    const response = await httpService.get('/links')
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to list links')
    }

    return response.data
  }

  /**
   * Busca um link por ID
   */
  async getLinkById(id) {
    const response = await httpService.get(`/links/${id}`)
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to get link')
    }

    return response.data
  }

  /**
   * Deleta um link
   */
  async deleteLink(id) {
    const response = await httpService.delete(`/links/${id}`)
    
    if (!response.success && response.status !== 204) {
      throw new Error(response.message || 'Failed to delete link')
    }

    return true
  }

  /**
   * Valida uma URL
   */
  validateUrl(url) {
    if (!url || url.trim().length === 0) {
      return { valid: false, error: 'URL é obrigatória' }
    }

    const trimmedUrl = url.trim()
    
    if (!trimmedUrl.match(/^https?:\/\/.+/i)) {
      return { valid: false, error: 'URL deve começar com http:// ou https://' }
    }

    try {
      new URL(trimmedUrl)
      return { valid: true, url: trimmedUrl }
    } catch {
      return { valid: false, error: 'URL inválida' }
    }
  }

  /**
   * Valida um slug
   */
  validateSlug(slug) {
    if (!slug || slug.trim().length === 0) {
      return { valid: true } // Slug é opcional
    }

    const trimmedSlug = slug.trim().toLowerCase()
    
    if (trimmedSlug.length < 3) {
      return { valid: false, error: 'Slug deve ter pelo menos 3 caracteres' }
    }

    if (trimmedSlug.length > 50) {
      return { valid: false, error: 'Slug deve ter no máximo 50 caracteres' }
    }

    if (!trimmedSlug.match(/^[a-z0-9_-]+$/)) {
      return { valid: false, error: 'Slug pode conter apenas letras minúsculas, números, hífens e underscores' }
    }

    return { valid: true, slug: trimmedSlug }
  }
}

// Instância singleton
const linkService = new LinkShortenerService()

export { LinkShortenerService, linkService }
export default linkService
