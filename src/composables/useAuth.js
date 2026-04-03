// src/composables/useAuth.js
// Sistema de autenticação mock seguindo Clean Code (< 50 linhas)

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Constantes de configuração
const AUTH_TOKEN_KEY = 'inkpage_admin_token'
const TOKEN_EXPIRY_HOURS = 24
const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

/**
 * Composable para gerenciar autenticação mock
 * Single Responsibility: Apenas controle de sessão admin
 */
export function useAuth() {
  const router = useRouter()
  const token = ref(localStorage.getItem(AUTH_TOKEN_KEY))
  const loading = ref(false)
  const error = ref('')

  // Computed para verificar autenticação
  const isAuthenticated = computed(() => {
    if (!token.value) return false
    
    try {
      const payload = JSON.parse(window.atob(token.value.split('.')[1]))
      const now = Date.now() / 1000
      return payload.exp > now
    } catch {
      return false
    }
  })

  // Função pequena para gerar token mock (< 20 linhas)
  const generateMockToken = () => {
    const payload = {
      username: MOCK_CREDENTIALS.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (TOKEN_EXPIRY_HOURS * 3600)
    }
    
    const header = { alg: 'HS256', typ: 'JWT' }
    const encodedHeader = window.btoa(JSON.stringify(header))
    const encodedPayload = window.btoa(JSON.stringify(payload))
    const signature = window.btoa('mock-signature')
    
    return `${encodedHeader}.${encodedPayload}.${signature}`
  }

  // Função de login (< 20 linhas)
  const login = async (username, password) => {
    loading.value = true
    error.value = ''
    
    try {
      // Simulação de delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (username === MOCK_CREDENTIALS.username && 
          password === MOCK_CREDENTIALS.password) {
        const mockToken = generateMockToken()
        token.value = mockToken
        localStorage.setItem(AUTH_TOKEN_KEY, mockToken)
        return true
      } else {
        error.value = 'Credenciais inválidas'
        return false
      }
    } catch {
      error.value = 'Erro no login'
      return false
    } finally {
      loading.value = false
    }
  }

  // Função de logout
  const logout = () => {
    token.value = ''
    localStorage.removeItem(AUTH_TOKEN_KEY)
    router.push('/admin/login')
  }

  return {
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout
  }
}
