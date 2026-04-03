<!-- views/LinkShortener.vue -->
// Página de encurtamento de links funcional seguindo Clean Code (< 150 linhas)

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Encurtador de Links</h1>
      <p class="text-gray-600 mb-8">
        Cole uma URL longa e crie um link curto e fácil de compartilhar.
      </p>
      
      <!-- Formulário de criação -->
      <form v-if="!hasCreatedLink" @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Campo URL -->
        <div>
          <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
            URL Longa
          </label>
          <input
            id="url"
            v-model="url"
            type="url"
            placeholder="https://exemplo.com/pagina-muito-longa"
            class="input-field"
            :class="{ 'border-error-500': urlError }"
            :disabled="loading"
          />
          <p v-if="urlError" class="error-message">{{ urlError }}</p>
        </div>
        
        <!-- Campo Slug (opcional) -->
        <div>
          <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
            Slug Personalizado (opcional)
          </label>
          <div class="flex items-center">
            <span class="text-gray-500 mr-2">inkpage.com.br/</span>
            <input
              id="slug"
              v-model="slug"
              type="text"
              placeholder="meu-link"
              class="input-field flex-1"
              :class="{ 'border-error-500': slugError }"
              :disabled="loading"
            />
          </div>
          <p v-if="slugError" class="error-message">{{ slugError }}</p>
          <p class="text-sm text-gray-500 mt-1">
            Deixe em branco para gerar um slug aleatório
          </p>
        </div>

        <!-- Botão submit -->
        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading || !url.trim()"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Criando link...
          </span>
          <span v-else>Encurtar Link</span>
        </button>

        <!-- Erro geral -->
        <div v-if="error" class="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p class="text-error-700">{{ error }}</p>
        </div>
      </form>

      <!-- Resultado do link criado -->
      <div v-else class="space-y-6">
        <div class="p-6 bg-success-50 border border-success-200 rounded-lg">
          <h3 class="text-lg font-semibold text-success-800 mb-4">Link criado com sucesso!</h3>
          
          <!-- Link curto -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-success-700 mb-2">Link Curto</label>
            <div class="flex items-center space-x-2">
              <input :value="createdLink.short_url" readonly class="input-field flex-1 bg-white" />
              <button @click="copyToClipboard(createdLink.short_url)" class="btn-secondary">Copiar</button>
            </div>
          </div>

          <!-- Hash da pasta -->
          <div v-if="createdLink.folder_hash" class="mb-4">
            <label class="block text-sm font-medium text-success-700 mb-2">
              Sua Chave de Acesso (guarde este código!)
            </label>
            <div class="flex items-center space-x-2">
              <input :value="createdLink.folder_hash" readonly class="input-field flex-1 bg-white font-mono text-sm" />
              <button @click="copyToClipboard(createdLink.folder_hash)" class="btn-secondary">Copiar</button>
            </div>
            <p class="text-sm text-success-600 mt-1">
              Use esta chave em "Minha Pasta" para gerenciar seus links
            </p>
          </div>

          <!-- Estatísticas -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="bg-white rounded p-3 text-center">
              <p class="text-2xl font-bold text-gray-900">{{ createdLink.clicks || 0 }}</p>
              <p class="text-sm text-gray-600">Cliques</p>
            </div>
            <div class="bg-white rounded p-3 text-center">
              <p class="text-sm font-bold text-gray-900">{{ formatDate(createdLink.created_at) }}</p>
              <p class="text-sm text-gray-600">Criado em</p>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="flex space-x-4">
          <button @click="createAnother" class="btn-primary flex-1">Criar Outro Link</button>
          <router-link to="/pasta" class="btn-secondary flex-1 text-center">Ver Minha Pasta</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useLinkShortener } from '../composables/useLinkShortener.js';
import { useFolderManager } from '../composables/useFolderManager.js';

export default {
  name: 'LinkShortener',
  setup() {
    const url = ref('');
    const slug = ref('');
    const urlError = ref('');
    const slugError = ref('');

    const linkShortener = useLinkShortener();
    const folderManager = useFolderManager();

    const validateForm = () => {
      urlError.value = '';
      slugError.value = '';
      let isValid = true;

      if (!url.value.trim()) {
        urlError.value = 'URL é obrigatória';
        isValid = false;
      }
      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      try {
        let folderHash = folderManager.lastHash.value;
        if (!folderHash) {
          const folder = await folderManager.createFolder();
          folderHash = folder.hash;
        }
        await linkShortener.createLink(url.value, slug.value || null, folderHash);
      } catch (error) {
        console.error('Error creating link:', error);
      }
    };

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        alert('Copiado!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    };

    const createAnother = () => {
      url.value = '';
      slug.value = '';
      urlError.value = '';
      slugError.value = '';
      linkShortener.reset();
    };

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return {
      url, slug, urlError, slugError,
      loading: linkShortener.loading,
      error: linkShortener.error,
      createdLink: linkShortener.createdLink,
      hasCreatedLink: linkShortener.hasCreatedLink,
      handleSubmit, copyToClipboard, createAnother, formatDate
    };
  }
};
</script>
