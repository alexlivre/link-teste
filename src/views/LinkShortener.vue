<!-- views/LinkShortener.vue -->
// Encurtador de links com design vibrante

<template>
  <div class="max-w-3xl mx-auto">
    <div class="card animate-scale-in">
      <div class="p-6 md:p-8">
        <!-- Header com badges coloridos -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
              Encurtador de <span class="text-gradient-purple">Links</span>
            </h1>
            <div class="flex items-center space-x-3">
              <span class="badge badge-emerald">✓ Funcional</span>
              <span class="badge badge-coral">🔗 Rastreável</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-coral-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-coral">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
        </div>
        
        <p class="text-lg text-neutral-600 mb-8">
          Cole uma URL longa e crie um link curto, colorido e fácil de compartilhar!
        </p>
      
        <!-- Formulário de criação colorido -->
        <form v-if="!hasCreatedLink" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Campo URL -->
          <div>
            <label for="url" class="block text-sm font-bold text-neutral-700 mb-3">
              <svg class="w-5 h-5 inline mr-2 text-coral-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
              URL Longa
            </label>
            <input
              id="url"
              v-model="url"
              type="url"
              placeholder="https://exemplo.com/pagina-muito-longa"
              class="input-field text-lg"
              :class="{ 'border-error-500 bg-error-50': urlError }"
              :disabled="loading"
            >
            <p v-if="urlError" class="error-message flex items-center mt-2">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ urlError }}
            </p>
          </div>
          
          <!-- Campo Slug (opcional) -->
          <div>
            <label for="slug" class="block text-sm font-bold text-neutral-700 mb-3">
              <svg class="w-5 h-5 inline mr-2 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Slug Personalizado <span class="text-neutral-500 font-normal">(opcional)</span>
            </label>
            <div class="flex items-center space-x-3">
              <div class="flex items-center bg-purple-100 px-4 py-3 rounded-xl border-2 border-purple-200">
                <span class="text-purple-700 font-bold">linkpage.com.br/</span>
              </div>
              <input
                id="slug"
                v-model="slug"
                type="text"
                placeholder="meu-link"
                class="input-field flex-1 font-mono"
                :class="{ 'border-error-500 bg-error-50': slugError }"
                :disabled="loading"
              >
            </div>
            <p v-if="slugError" class="error-message flex items-center mt-2">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ slugError }}
            </p>
            <p class="text-sm text-neutral-500 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Deixe em branco para gerar um slug aleatório colorido
            </p>
          </div>

          <!-- Botão submit com design premium -->
          <button
            type="submit"
            class="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover-lift group"
            :disabled="loading || !url.trim()"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Criando link...
            </span>
            <span v-else class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:rotate-45 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              Encurtar Link
            </span>
          </button>

          <!-- Erro geral -->
          <div v-if="error" class="p-4 bg-error-50 border border-error-200 rounded-xl animate-slide-in">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-error-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-error-700 font-medium">{{ error }}</p>
            </div>
          </div>
        </form>

        <!-- Resultado do link criado com design premium -->
        <div v-else class="space-y-6 animate-scale-in">
          <div class="card card-success">
            <div class="p-6">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-success-700">Link criado com sucesso!</h3>
                  <p class="text-success-600 text-sm">Seu link curto está pronto para usar</p>
                </div>
              </div>
              
              <div class="space-y-6">
                <!-- Link curto -->
                <div>
                  <label class="block text-sm font-semibold text-success-700 mb-3">
                    <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                    Link Curto
                  </label>
                  <div class="flex items-center space-x-3">
                    <input :value="createdLink.short_url" readonly class="input-field flex-1 bg-success-50 font-mono text-sm" >
                    <button @click="copyToClipboard(createdLink.short_url)" class="btn-success hover-lift">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      Copiar
                    </button>
                  </div>
                </div>

                <!-- Hash da pasta -->
                <div v-if="createdLink.folder_hash" class="p-4 bg-gradient-to-r from-gold-50 to-primary-50 rounded-xl border border-gold-200">
                  <label class="block text-sm font-semibold text-gold-700 mb-3">
                    <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Sua Chave de Acesso
                    <span class="text-gold-600 font-normal text-xs ml-2">(guarde este código!)</span>
                  </label>
                  <div class="flex items-center space-x-3">
                    <input :value="createdLink.folder_hash" readonly class="input-field flex-1 bg-white font-mono text-sm" >
                    <button @click="copyToClipboard(createdLink.folder_hash)" class="btn-gold hover-lift">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      Copiar
                    </button>
                  </div>
                  <p class="text-sm text-gold-600 mt-3 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Use esta chave em "Minha Pasta" para gerenciar seus links
                  </p>
                </div>

                <!-- Estatísticas com design visual -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gradient-to-br from-forest-50 to-primary-50 rounded-xl p-4 text-center border border-forest-200">
                    <div class="text-3xl font-bold text-forest-600 mb-1">{{ createdLink.clicks || 0 }}</div>
                    <p class="text-sm text-forest-700 font-medium">Cliques</p>
                    <div class="text-xs text-forest-600 mt-1">📈 Total de acessos</div>
                  </div>
                  <div class="bg-gradient-to-br from-gold-50 to-primary-50 rounded-xl p-4 text-center border border-gold-200">
                    <div class="text-lg font-bold text-gold-600 mb-1">{{ formatDate(createdLink.created_at) }}</div>
                    <p class="text-sm text-gold-700 font-medium">Criado em</p>
                    <div class="text-xs text-gold-600 mt-1">📅 Data de criação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button @click="createAnother" class="btn-primary flex-1 hover-lift">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4"/>
              </svg>
              Criar Outro Link
            </button>
            <router-link to="/pasta" class="btn-secondary flex-1 text-center hover-lift">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              </svg>
              Ver Minha Pasta
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useLinkShortener } from '../composables/useLinkShortener.js'
import { useFolderManager } from '../composables/useFolderManager.js'

export default {
  name: 'LinkShortener',
  setup() {
    const url = ref('')
    const slug = ref('')
    const urlError = ref('')
    const slugError = ref('')

    const linkShortener = useLinkShortener()
    const folderManager = useFolderManager()

    const validateForm = () => {
      urlError.value = ''
      slugError.value = ''
      let isValid = true

      if (!url.value.trim()) {
        urlError.value = 'URL é obrigatória'
        isValid = false
      }
      return isValid
    }

    const handleSubmit = async () => {
      if (!validateForm()) return
      try {
        let folderHash = folderManager.lastHash.value
        if (!folderHash) {
          const folder = await folderManager.createFolder()
          folderHash = folder.hash
        }
        await linkShortener.createLink(url.value, slug.value || null, folderHash)
      } catch (error) {
        console.error('Error creating link:', error)
      }
    }

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        alert('Copiado!')
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }

    const createAnother = () => {
      url.value = ''
      slug.value = ''
      urlError.value = ''
      slugError.value = ''
      linkShortener.reset()
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    return {
      url, slug, urlError, slugError,
      loading: linkShortener.loading,
      error: linkShortener.error,
      createdLink: linkShortener.createdLink,
      hasCreatedLink: linkShortener.hasCreatedLink,
      handleSubmit, copyToClipboard, createAnother, formatDate
    }
  }
}
</script>
