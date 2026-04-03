<!-- views/FolderManager.vue -->
<!-- Página de gestão de pasta funcional seguindo Clean Code (< 150 linhas) -->

<template>
  <div class="max-w-4xl mx-auto">
    <div class="card">
      <h1 class="text-3xl font-bold text-primary mb-2">Minha Pasta de Links</h1>
      <p class="text-neutral-600 mb-8">
        Acesse e gerencie todos os seus links encurtados usando sua chave secreta SHA256.
      </p>
      
      <!-- Formulário de acesso -->
      <div v-if="!hasFolder" class="space-y-6">
        <div class="p-6 bg-forest-50 border border-forest-200 rounded-lg">
          <h3 class="text-lg font-semibold text-forest-800 mb-4">Acessar Pasta</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-forest-700 mb-2">
                Chave de Acesso (SHA256)
              </label>
              <input
                v-model="hashInput"
                type="text"
                placeholder="Cole sua Chave de Acesso aqui..."
                class="input-field font-mono"
                :class="{ 'border-error-500': error }"
                :disabled="loading"
              >
              <p v-if="error" class="error-message mt-2">{{ error }}</p>
            </div>

            <div class="flex space-x-3">
              <button
                @click="handleLoadFolder"
                class="btn-primary flex-1"
                :disabled="loading || !hashInput.trim()"
              >
                <span v-if="loading">Carregando...</span>
                <span v-else>Acessar Pasta</span>
              </button>
              
              <button
                @click="handleCreateFolder"
                class="btn-secondary"
                :disabled="loading"
              >
                Criar Nova
              </button>
            </div>
          </div>

          <!-- Hash salvo -->
          <div v-if="hasLastHash" class="mt-4 pt-4 border-t border-forest-200">
            <p class="text-sm text-forest-600 mb-2">Última pasta usada:</p>
            <button
              @click="useLastHash"
              class="text-sm text-forest-700 hover:text-forest-800 underline"
            >
              {{ lastHash }}
            </button>
          </div>
        </div>
      </div>

      <!-- Conteúdo da pasta -->
      <div v-else class="space-y-6">
        <!-- Header da pasta -->
        <div class="p-6 bg-success-50 border border-success-200 rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-success-700">Pasta Atual</h3>
            <button @click="clearFolder" class="text-sm text-success-600 hover:text-success-700">
              Sair
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-primary-50 rounded-xl p-4 text-center border border-primary-200">
              <p class="text-sm text-primary-600">Hash</p>
              <p class="font-mono text-sm font-semibold text-primary-900 truncate">
                {{ currentFolder.hash }}
              </p>
            </div>
            <div class="bg-forest-50 rounded-xl p-4 text-center border border-forest-200">
              <p class="text-sm text-forest-600">Links</p>
              <p class="text-2xl font-bold text-forest-900">{{ linkCount }}</p>
            </div>
            <div class="bg-gold-50 rounded-xl p-4 text-center border border-gold-200">
              <p class="text-sm text-gold-600">Criada em</p>
              <p class="text-sm font-semibold text-gold-900">
                {{ formatDate(currentFolder.created_at) }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center space-x-2">
            <button @click="copyHash"
                    class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                           bg-forest-600 text-white text-sm font-semibold
                           hover:bg-forest-700 transition-all duration-200
                           focus:outline-none focus:ring-4 focus:ring-forest-200">
              <svg v-if="!copyHashFeedback" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {{ copyHashFeedback ? 'Copiado!' : 'Copiar Hash' }}
            </button>
            <button @click="refreshFolder"
                    class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                           bg-white text-forest-700 text-sm font-semibold border border-forest-300
                           hover:bg-forest-50 hover:border-forest-400 transition-all duration-200
                           focus:outline-none focus:ring-4 focus:ring-forest-200"
                    :disabled="loading">
              Atualizar
            </button>
          </div>
        </div>

        <!-- Lista de links -->
        <div v-if="currentFolder.links?.length > 0" class="space-y-4">
          <h3 class="text-lg font-semibold text-primary">Seus Links</h3>
          
          <div
            v-for="link in currentFolder.links"
            :key="link.id"
            class="card hover-lift"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="font-semibold text-forest-600">/{{ link.slug }}</span>
                  <span class="text-sm text-neutral-500">• {{ link.clicks || 0 }} cliques</span>
                </div>
                <p class="text-sm text-neutral-600 truncate">{{ link.url_destination }}</p>
                <p class="text-xs text-neutral-400 mt-1">
                  Criado em {{ formatDate(link.created_at) }}
                </p>
              </div>
              
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="copyToClipboard(link.short_url)"
                  class="btn-secondary text-sm py-1 px-3"
                  title="Copiar link"
                >
                  Copiar
                </button>
                <button
                  @click="deleteLink(link.id)"
                  class="text-error-600 hover:text-error-700 p-1"
                  title="Excluir link"
                >
                  <svg class="w-5 h-5"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pasta vazia -->
        <div v-else class="p-8 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
          <svg class="w-12 h-12 text-neutral-400 mx-auto mb-4"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          <h3 class="text-lg font-semibold text-primary mb-2">Nenhum link ainda</h3>
          <p class="text-neutral-600 mb-4">Esta pasta ainda não tem links. Crie seu primeiro link!</p>
          <router-link to="/encurtar" class="btn-primary">Criar Link</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useFolderManager } from '../composables/useFolderManager.js'
import { useLinkShortener } from '../composables/useLinkShortener.js'

export default {
  name: 'FolderManager',
  setup() {
    const hashInput = ref('')

    const folderManager = useFolderManager()
    const linkShortener = useLinkShortener()

    const handleLoadFolder = async () => {
      try {
        await folderManager.loadFolder(hashInput.value)
      } catch (error) {
        console.error('Error loading folder:', error)
      }
    }

    const handleCreateFolder = async () => {
      try {
        const folder = await folderManager.createFolder()
        hashInput.value = folder.hash
      } catch (error) {
        console.error('Error creating folder:', error)
      }
    }

    const useLastHash = () => {
      hashInput.value = folderManager.lastHash.value
      handleLoadFolder()
    }

    const clearFolder = () => {
      folderManager.clearFolder()
      hashInput.value = ''
    }

    const copyHashFeedback = ref(false)

    const copyHash = async () => {
      if (folderManager.currentFolder.value?.hash) {
        try {
          await navigator.clipboard.writeText(folderManager.currentFolder.value.hash)
          copyHashFeedback.value = true
          setTimeout(() => { copyHashFeedback.value = false }, 2000)
        } catch (error) {
          console.error('Failed to copy:', error)
        }
      }
    }

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        alert('Link copiado!')
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }

    const deleteLink = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este link?')) return
      
      try {
        await linkShortener.deleteLink(id)
        await folderManager.refreshFolder()
      } catch (error) {
        console.error('Error deleting link:', error)
      }
    }

    const refreshFolder = async () => {
      try {
        await folderManager.refreshFolder()
      } catch (error) {
        console.error('Error refreshing folder:', error)
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    return {
      hashInput,
      loading: folderManager.loading,
      error: folderManager.error,
      currentFolder: folderManager.currentFolder,
      lastHash: folderManager.lastHash,
      hasFolder: folderManager.hasFolder,
      hasLastHash: folderManager.hasLastHash,
      linkCount: folderManager.linkCount,
      handleLoadFolder,
      handleCreateFolder,
      useLastHash,
      clearFolder,
      copyHash,
      copyHashFeedback,
      copyToClipboard,
      deleteLink,
      refreshFolder,
      formatDate
    }
  }
}
</script>
