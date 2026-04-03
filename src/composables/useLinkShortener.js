// src/composables/useLinkShortener.js
// Composable de encurtamento de links seguindo Clean Code (< 100 linhas)

import { ref, computed } from 'vue'
import linkService from '../services/LinkShortenerService.js'

/**
 * Composable para gerenciamento de links
 * Single Responsibility: Apenas gerenciar estado e operações de links
 */
export function useLinkShortener() {
  // Estado
  const loading = ref(false)
  const error = ref(null)
  const createdLink = ref(null)
  const links = ref([])

  // Computed
  const hasError = computed(() => error.value !== null)
  const hasCreatedLink = computed(() => createdLink.value !== null)

  /**
   * Cria um novo link
   */
  const createLink = async (url, slug = null, folderHash = null) => {
    loading.value = true
    error.value = null
    createdLink.value = null

    try {
      // Validação
      const urlValidation = linkService.validateUrl(url)
      if (!urlValidation.valid) {
        throw new Error(urlValidation.error)
      }

      if (slug) {
        const slugValidation = linkService.validateSlug(slug)
        if (!slugValidation.valid) {
          throw new Error(slugValidation.error)
        }
      }

      // Criar link
      const result = await linkService.createLink(
        urlValidation.url,
        slug,
        folderHash
      )

      createdLink.value = result
      return result

    } catch (err) {
      error.value = err.message || 'Erro ao criar link'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Lista todos os links
   */
  const listLinks = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await linkService.listLinks()
      links.value = result
      return result
    } catch (err) {
      error.value = err.message || 'Erro ao listar links'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Deleta um link
   */
  const deleteLink = async (id) => {
    loading.value = true
    error.value = null

    try {
      await linkService.deleteLink(id)
      // Remover da lista local
      links.value = links.value.filter(link => link.id !== id)
      return true
    } catch (err) {
      error.value = err.message || 'Erro ao deletar link'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa o estado
   */
  const reset = () => {
    loading.value = false
    error.value = null
    createdLink.value = null
  }

  /**
   * Limpa o erro
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    loading,
    error,
    createdLink,
    links,
    
    // Computed
    hasError,
    hasCreatedLink,
    
    // Métodos
    createLink,
    listLinks,
    deleteLink,
    reset,
    clearError
  }
}
