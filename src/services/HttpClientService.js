// src/services/HttpClientService.js
// Serviço HTTP centralizado seguindo Clean Code (< 100 linhas)

import axios from 'axios'

/**
 * Configuração base do Axios
 * Single Responsibility: Apenas configurar e gerenciar cliente HTTP
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const httpClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de requisições
httpClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

// Interceptor de respostas
httpClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status} ${response.config.url}`)
    return response.data
  },
  (error) => {
    console.error('[API] Response error:', error.response?.status, error.message)
    
    // Tratamento padronizado de erros
    const errorResponse = {
      success: false,
      error: error.response?.data?.error || 'Unknown Error',
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500
    }
    
    return Promise.reject(errorResponse)
  }
)

/**
 * Serviço HTTP centralizado
 */
class HttpClientService {
  constructor() {
    this.client = httpClient
  }

  /**
   * Realiza uma requisição GET
   */
  async get(url, params = {}) {
    return this.client.get(url, { params })
  }

  /**
   * Realiza uma requisição POST
   */
  async post(url, data = {}) {
    return this.client.post(url, data)
  }

  /**
   * Realiza uma requisição PUT
   */
  async put(url, data = {}) {
    return this.client.put(url, data)
  }

  /**
   * Realiza uma requisição DELETE
   */
  async delete(url) {
    return this.client.delete(url)
  }
}

// Instância singleton
const httpService = new HttpClientService()

export { HttpClientService, httpService, API_BASE_URL }
export default httpService
