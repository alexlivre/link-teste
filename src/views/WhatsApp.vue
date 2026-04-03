<!-- views/WhatsApp.vue -->
// Página do gerador WhatsApp seguindo Clean Code (< 100 linhas)

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Gerador de Link WhatsApp</h1>
      <p class="text-gray-600 mb-8">
        Crie links de WhatsApp instantaneamente. Preencha o número e mensagem, 
        então copie o link gerado.
      </p>
      
      <!-- Formulário -->
      <form @submit.prevent="generateLink" class="space-y-6">
        <!-- Campo telefone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="input-field"
            :class="{ 'border-error-500': errors.phone }"
            @input="formatPhone"
            @blur="validatePhone"
          />
          <p v-if="errors.phone" class="error-message">
            {{ errors.phone }}
          </p>
        </div>
        
        <!-- Campo mensagem -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            Mensagem (opcional)
          </label>
          <textarea
            id="message"
            v-model="message"
            placeholder="Digite sua mensagem aqui..."
            rows="4"
            maxlength="1000"
            class="input-field resize-none"
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">
            {{ message.length }}/1000 caracteres
          </p>
        </div>
        
        <!-- Botão gerar -->
        <button
          type="submit"
          :disabled="!isValidForm || isLoading"
          class="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="isLoading" class="mr-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Gerando...' : 'Gerar Link do WhatsApp' }}
        </button>
      </form>
      
      <!-- Erro geral -->
      <div v-if="errors.general" class="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
        <p class="text-error-700 text-sm">{{ errors.general }}</p>
      </div>
      
      <!-- Resultado -->
      <div v-if="generatedLink" class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Link Gerado:</h3>
        <div class="flex items-center space-x-2">
          <input
            :value="generatedLink"
            readonly
            class="flex-1 input-field bg-white"
          />
          <button
            @click="copyLink"
            class="btn-success px-6"
          >
            {{ copyButtonText }}
          </button>
        </div>
        
        <!-- Oferta de encurtamento -->
        <div class="mt-6 p-4 bg-primary-50 rounded-lg">
          <p class="text-primary-700 mb-3">
            🚀 Quer um link curto e rastreável?
          </p>
          <router-link
            :to="`/encurtar?url=${encodeURIComponent(generatedLink)}`"
            class="btn-primary"
          >
            Obter Link Curto
          </router-link>
        </div>
      </div>
      
      <!-- Histórico recente -->
      <div v-if="recentLinks.length > 0" class="mt-8">
        <h3 class="text-lg font-semibold mb-4">Links Gerados Recentemente:</h3>
        <div class="space-y-3">
          <div 
            v-for="link in recentLinks" 
            :key="link.id"
            class="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">
                📱 {{ link.phone }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ new Date(link.createdAt).toLocaleString('pt-BR') }}
              </p>
              <p class="text-xs text-gray-600 mt-1 truncate">
                {{ link.message || '(sem mensagem)' }}
              </p>
            </div>
            <button
              @click="copyHistoryLink(link.url)"
              class="btn-secondary text-sm px-4 py-2"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWhatsAppService } from '../composables/useWhatsAppService.js';

export default {
  name: 'WhatsApp',
  setup() {
    // Usar serviço SOLID com injeção de dependências
    const whatsappService = useWhatsAppService();
    
    return {
      // Estado do serviço
      phone: whatsappService.phone,
      message: whatsappService.message,
      generatedLink: whatsappService.generatedLink,
      errors: whatsappService.errors,
      recentLinks: whatsappService.recentLinks,
      isLoading: whatsappService.isLoading,
      copyButtonText: whatsappService.copyButtonText,
      
      // Computados
      isValidForm: whatsappService.isValidForm,
      hasHistory: whatsappService.hasHistory,
      
      // Métodos
      formatPhone: whatsappService.formatPhone,
      validatePhone: whatsappService.validatePhone,
      generateLink: whatsappService.generateLink,
      copyLink: whatsappService.copyLink,
      copyHistoryLink: whatsappService.copyHistoryLink,
      clearHistory: whatsappService.clearHistory
    };
  }
};
</script>
