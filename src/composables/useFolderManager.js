// src/composables/useFolderManager.js
// Composable de gestão de pastas seguindo Clean Code (< 100 linhas)

import { ref, computed } from 'vue'
import folderService from '../services/FolderService.js'

/**
 * Composable para gerenciamento de pastas
 * Single Responsibility: Apenas gerenciar estado e operações de pastas
 */
export function useFolderManager() {
  // Estado
  const loading = ref(false)
  const error = ref(null)
  const currentFolder = ref(null)
  const folders = ref([])
  const lastHash = ref(folderService.getLastHash())

  // Computed
  const hasError = computed(() => error.value !== null)
  const hasFolder = computed(() => currentFolder.value !== null)
  const hasLastHash = computed(() => !!lastHash.value)
  const linkCount = computed(() => currentFolder.value?.links?.length || 0)

  /**
   * Cria uma nova pasta
   */
  const createFolder = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await folderService.createFolder()
      
      // Salvar hash
      folderService.saveLastHash(result.hash)
      lastHash.value = result.hash
      
      // Definir como pasta atual
      currentFolder.value = {
        ...result,
        links: []
      }

      return result
    } catch (err) {
      error.value = err.message || 'Erro ao criar pasta'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca uma pasta pelo hash
   */
  const loadFolder = async (hash = null) => {
    loading.value = true
    error.value = null

    try {
      const targetHash = hash || lastHash.value
      
      if (!targetHash) {
        throw new Error('Hash da pasta não fornecido')
      }

      // Validar hash
      const validation = folderService.validateHash(targetHash)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Buscar pasta
      const result = await folderService.getFolderByHash(validation.hash)
      
      // Salvar hash
      folderService.saveLastHash(result.hash)
      lastHash.value = result.hash
      
      // Definir como pasta atual
      currentFolder.value = result

      return result
    } catch (err) {
      error.value = err.message || 'Erro ao carregar pasta'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Lista todas as pastas
   */
  const listFolders = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await folderService.listFolders()
      folders.value = result
      return result
    } catch (err) {
      error.value = err.message || 'Erro ao listar pastas'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Verifica se uma pasta existe
   */
  const checkFolderExists = async (hash) => {
    try {
      return await folderService.folderExists(hash)
    } catch {
      return false
    }
  }

  /**
   * Limpa a pasta atual
   */
  const clearFolder = () => {
    currentFolder.value = null
    folderService.clearLastHash()
    lastHash.value = null
  }

  /**
   * Limpa o erro
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Recarrega a pasta atual
   */
  const refreshFolder = async () => {
    if (currentFolder.value?.hash) {
      return loadFolder(currentFolder.value.hash)
    }
  }

  return {
    // Estado
    loading,
    error,
    currentFolder,
    folders,
    lastHash,
    
    // Computed
    hasError,
    hasFolder,
    hasLastHash,
    linkCount,
    
    // Métodos
    createFolder,
    loadFolder,
    listFolders,
    checkFolderExists,
    clearFolder,
    clearError,
    refreshFolder
  }
}
