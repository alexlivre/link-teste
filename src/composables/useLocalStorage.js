// composables/useLocalStorage.js
// Hook reutilizável para localStorage seguindo Clean Code (< 20 linhas por função)

import { ref, watch } from 'vue'

/**
 * Hook reativo para localStorage
 * @param {string} key - Chave no localStorage
 * @param {any} defaultValue - Valor padrão
 * @returns {Object} - Valor reativo e funções
 */
export const useLocalStorage = (key, defaultValue = null) => {
  // Obter valor inicial do localStorage
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Erro ao ler localStorage "${key}":`, error)
      return defaultValue
    }
  }

  // Estado reativo
  const value = ref(getStoredValue())

  // Salvar no localStorage quando mudar
  const setValue = (newValue) => {
    try {
      value.value = newValue
      window.localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error(`Erro ao salvar localStorage "${key}":`, error)
    }
  }

  // Remover do localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      value.value = defaultValue
    } catch (error) {
      console.error(`Erro ao remover localStorage "${key}":`, error)
    }
  }

  // Watch para atualizações externas
  watch(value, (newValue) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error(`Erro ao sincronizar localStorage "${key}":`, error)
    }
  }, { deep: true })

  return {
    value,
    setValue,
    removeValue
  }
}
