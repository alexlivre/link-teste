// src/composables/useAdminAPI.js
// Composable para APIs admin seguindo Clean Code (< 80 linhas)

import { ref } from 'vue'
import axios from 'axios'

/**
 * Composable para comunicação com APIs admin
 * Single Responsibility: Apenas comunicação HTTP admin
 */
export function useAdminAPI() {
  const loading = ref(false)
  const error = ref('')
  
  // Configuração base do axios
  const api = axios.create({
    baseURL: 'http://localhost:3001/api/admin',
    timeout: 10000
  })

  // Interceptor para adicionar token de autenticação
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('inkpage_admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Interceptor para tratar erros
  api.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err.response?.status === 401) {
        // Token expirado/inválido
        localStorage.removeItem('inkpage_admin_token')
        window.location.href = '/admin/login'
      }
      error.value = err.response?.data?.error || 'Erro na requisição'
      return Promise.reject(err)
    }
  )

  /**
   * Buscar métricas do dashboard
   */
  const getMetrics = async () => {
    loading.value = true
    try {
      const response = await api.get('/metrics')
      return response.data
    } finally {
      loading.value = false
    }
  }

  /**
   * Listar links com paginação
   */
  const getLinks = async (params = {}) => {
    loading.value = true
    try {
      const response = await api.get('/links', { params })
      return response.data
    } finally {
      loading.value = false
    }
  }

  /**
   * Excluir link
   */
  const deleteLink = async (id) => {
    const response = await api.delete(`/links/${id}`)
    return response.data
  }

  /**
   * Resetar contadores de link
   */
  const resetLinkCounters = async (id) => {
    const response = await api.post(`/links/${id}/reset`)
    return response.data
  }

  /**
   * Buscar pasta por hash
   */
  const getFolderByHash = async (hash) => {
    const response = await api.get(`/folder/${hash}`)
    return response.data
  }

  /**
   * Banir pasta
   */
  const banFolder = async (hash) => {
    const response = await api.post(`/folder/${hash}/ban`)
    return response.data
  }

  /**
   * Buscar analytics com filtros
   */
  const getAnalytics = async (params = {}) => {
    loading.value = true
    try {
      const response = await api.get('/analytics', { params })
      return response.data
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpar analytics antigos
   */
  const clearAnalytics = async (days = 30) => {
    const response = await api.delete('/analytics', { params: { days } })
    return response.data
  }

  /**
   * Resetar todos os contadores
   */
  const resetAllCounters = async () => {
    const response = await api.post('/reset-all')
    return response.data
  }

  /**
   * Exportar dados
   */
  const exportData = async () => {
    const response = await api.get('/export')
    return response.data
  }

  /**
   * Informações do sistema
   */
  const getSystemInfo = async () => {
    const response = await api.get('/system')
    return response.data
  }

  /**
   * Banir IP
   */
  const banIP = async (ip, reason, duration) => {
    const response = await api.post('/ip/ban', { ip, reason, duration })
    return response.data
  }

  /**
   * Desbanir IP
   */
  const unbanIP = async (ip) => {
    const response = await api.post('/ip/unban', { ip })
    return response.data
  }

  /**
   * Listar IPs banidos
   */
  const getBannedIPs = async () => {
    const response = await api.get('/ip/banned')
    return response.data
  }

  /**
   * Listar usuários
   */
  const getUsers = async (params = {}) => {
    loading.value = true
    try {
      const response = await api.get('/users', { params })
      return response.data
    } finally {
      loading.value = false
    }
  }

  /**
   * Banir usuário
   */
  const banUser = async (id, reason) => {
    const response = await api.post(`/users/${id}/ban`, { reason })
    return response.data
  }

  /**
   * Desbanir usuário
   */
  const unbanUser = async (id) => {
    const response = await api.post(`/users/${id}/unban`)
    return response.data
  }

  /**
   * Promover usuário
   */
  const promoteUser = async (id) => {
    const response = await api.post(`/users/${id}/promote`)
    return response.data
  }

  /**
   * Listar logs
   */
  const getLogs = async (params = {}) => {
    loading.value = true
    try {
      const response = await api.get('/logs', { params })
      return response.data
    } finally {
      loading.value = false
    }
  }

  /**
   * Toggle modo manutenção
   */
  const toggleMaintenance = async (enabled, message) => {
    const response = await api.post('/maintenance', { enabled, message })
    return response.data
  }

  /**
   * Status do modo manutenção
   */
  const getMaintenanceStatus = async () => {
    const response = await api.get('/maintenance')
    return response.data
  }

  /**
   * Limpar cache
   */
  const clearCache = async (type) => {
    const response = await api.post('/cache/clear', { type })
    return response.data
  }

  /**
   * Rebuild cache
   */
  const rebuildCache = async () => {
    const response = await api.post('/cache/rebuild')
    return response.data
  }

  /**
   * Enviar broadcast
   */
  const broadcast = async (message, target, channels) => {
    const response = await api.post('/broadcast', { message, target, channels })
    return response.data
  }

  /**
   * Listar broadcasts
   */
  const getBroadcasts = async () => {
    const response = await api.get('/broadcast')
    return response.data
  }

  /**
   * Configurar rate limiting
   */
  const configureRateLimit = async (config) => {
    const response = await api.post('/rate-limit', config)
    return response.data
  }

  /**
   * Status do rate limiting
   */
  const getRateLimitConfig = async () => {
    const response = await api.get('/rate-limit')
    return response.data
  }

  /**
   * Health check
   */
  const getHealth = async () => {
    const response = await api.get('/health')
    return response.data
  }

  /**
   * Excluir múltiplos links
   */
  const bulkDeleteLinks = async (ids) => {
    const response = await api.delete('/links/bulk', { data: { ids } })
    return response.data
  }

  /**
   * Toggle múltiplos links
   */
  const bulkToggleLinks = async (ids, active) => {
    const response = await api.post('/links/bulk-toggle', { ids, active })
    return response.data
  }

  return {
    loading,
    error,
    getMetrics,
    getLinks,
    deleteLink,
    resetLinkCounters,
    getFolderByHash,
    banFolder,
    getAnalytics,
    clearAnalytics,
    resetAllCounters,
    exportData,
    getSystemInfo,
    banIP,
    unbanIP,
    getBannedIPs,
    getUsers,
    banUser,
    unbanUser,
    promoteUser,
    getLogs,
    toggleMaintenance,
    getMaintenanceStatus,
    clearCache,
    rebuildCache,
    broadcast,
    getBroadcasts,
    configureRateLimit,
    getRateLimitConfig,
    getHealth,
    bulkDeleteLinks,
    bulkToggleLinks
  }
}
