// src/composables/usePolling.js
// Sistema de polling automático seguindo Clean Code (< 60 linhas)

import { ref, onUnmounted, onMounted } from 'vue'

/**
 * Composable para polling automático de dados
 * Single Responsibility: Apenas controle de polling
 */
export function usePolling(callback, interval = 10000) {
  const isPolling = ref(false)
  const lastUpdate = ref(null)
  const error = ref('')
  let pollInterval = null
  
  // Função para executar callback com tratamento de erro
  const executeCallback = async () => {
    try {
      await callback()
      lastUpdate.value = new Date()
      error.value = ''
    } catch (err) {
      error.value = err.message || 'Erro na atualização'
      console.error('Polling error:', err)
    }
  }
  
  // Iniciar polling
  const startPolling = () => {
    if (isPolling.value) return
    
    isPolling.value = true
    error.value = ''
    
    // Executar imediatamente
    executeCallback()
    
    // Configurar intervalo
    pollInterval = setInterval(executeCallback, interval)
  }
  
  // Parar polling
  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
    isPolling.value = false
  }
  
  // Executar manualmente
  const refresh = async () => {
    await executeCallback()
  }
  
  // Lifecycle hooks
  onMounted(() => {
    // Auto-start se necessário
  })
  
  onUnmounted(() => {
    stopPolling()
  })
  
  return {
    isPolling,
    lastUpdate,
    error,
    startPolling,
    stopPolling,
    refresh
  }
}
