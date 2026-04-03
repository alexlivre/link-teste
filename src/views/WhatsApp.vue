<!-- views/WhatsApp.vue -->
// Gerador de links WhatsApp com design vibrante

<template>
  <div class="max-w-3xl mx-auto">
    <div class="card animate-scale-in">
      <div class="p-6 md:p-8">
        <!-- Header com badges coloridos -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
              Gerador de Link <span class="text-gradient-coral">WhatsApp</span>
            </h1>
            <div class="flex items-center space-x-3">
              <span class="badge badge-emerald">✓ Funcional</span>
              <span class="badge badge-purple">⚡ Instantâneo</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-emerald">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
        </div>
        
        <p class="text-lg text-neutral-600 mb-8">
          Crie links de WhatsApp instantaneamente com estilo! Preencha o número e mensagem, 
          então copie o link gerado.
        </p>
      
        <!-- Formulário colorido -->
        <form @submit.prevent="generateLink" class="space-y-6">
          <!-- Campo telefone -->
          <div>
            <label for="phone" class="block text-sm font-bold text-neutral-700 mb-3">
              <svg class="w-5 h-5 inline mr-2 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Telefone
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 font-bold text-lg">
                +55
              </span>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                placeholder="(11) 98765-4321"
                class="input-field pl-20 text-lg"
                :class="{ 'border-error-500 bg-error-50': errors.phone }"
                @input="formatPhone"
                @blur="validatePhone"
              >
            </div>
            <p v-if="errors.phone" class="error-message flex items-center mt-2">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errors.phone }}
            </p>
          </div>
          
          <!-- Campo mensagem -->
          <div>
            <label for="message" class="block text-sm font-bold text-neutral-700 mb-3">
              <svg class="w-5 h-5 inline mr-2 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Mensagem <span class="text-neutral-500 font-normal">(opcional)</span>
            </label>
            <div class="relative">
              <textarea
                id="message"
                v-model="message"
                placeholder="Digite sua mensagem aqui..."
                rows="4"
                maxlength="1000"
                class="input-field resize-none"
              />
              <div class="absolute bottom-3 right-3 text-xs text-neutral-500 bg-white px-2 py-1 rounded-lg border border-purple-100">
                {{ message.length }}/1000
              </div>
            </div>
          </div>
          
          <!-- Botão gerar vibrante -->
          <button
            type="submit"
            :disabled="!isValidForm || isLoading"
            class="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover-lift group"
          >
            <span v-if="isLoading" class="mr-3">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                        fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </span>
            <svg class="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {{ isLoading ? 'Gerando link...' : 'Gerar Link do WhatsApp' }}
          </button>
        </form>
        
        <!-- Erro geral -->
        <div v-if="errors.general" class="mt-6 p-4 bg-error-50 border-2 border-error-200 rounded-xl animate-slide-in">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-error-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-error-700 font-medium">{{ errors.general }}</p>
          </div>
        </div>
      </div>
    </div>
      
    <!-- Resultado colorido -->
    <div v-if="generatedLink" class="mt-8 animate-scale-in">
      <div class="card card-emerald">
        <div class="p-6">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-emerald-700">🎉 Link Gerado com Sucesso!</h3>
              <p class="text-emerald-600 text-sm">Seu link está pronto para compartilhar</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-emerald-700 mb-2">Link do WhatsApp</label>
              <div class="flex items-center space-x-3">
                <input
                  :value="generatedLink"
                  readonly
                  class="input-field flex-1 bg-emerald-50 font-mono text-sm border-emerald-200"
                >
                <button
                  @click="copyLink"
                  class="btn-success px-6 hover-lift"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  {{ copyButtonText }}
                </button>
              </div>
            </div>
            
            <!-- Oferta de encurtamento colorida -->
            <div class="p-4 bg-gradient-to-r from-coral-50 to-pink-50 rounded-xl border-2 border-coral-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-coral-700 font-bold mb-1">
                    🚀 Quer um link curto e profissional?
                  </p>
                  <p class="text-coral-600 text-sm">
                    Transforme este link em um link curto e rastreável
                  </p>
                </div>
                <router-link
                  :to="`/encurtar?url=${encodeURIComponent(generatedLink)}`"
                  class="btn-coral hover-lift whitespace-nowrap"
                >
                  Encurtar Agora
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      
    <!-- Histórico recente colorido -->
    <div v-if="recentLinks.length > 0" class="mt-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-neutral-800">📚 Links Gerados Recentemente</h3>
        <span class="badge badge-purple">{{ recentLinks.length }} links</span>
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="link in recentLinks" 
          :key="link.id"
          class="card hover-lift group"
        >
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center mb-2">
                  <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <p class="font-bold text-neutral-700 group-hover:text-purple-600 transition-colors">
                    📱 {{ link.phone }}
                  </p>
                </div>
                <p class="text-xs text-neutral-500 mb-1">
                  {{ new Date(link.createdAt).toLocaleString('pt-BR') }}
                </p>
                <p class="text-sm text-neutral-600 truncate">
                  {{ link.message || '(sem mensagem)' }}
                </p>
              </div>
              <button
                @click="copyHistoryLink(link.url)"
                class="btn-secondary text-sm px-4 py-2 hover-lift group-hover:scale-105 transition-transform"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useWhatsAppService } from '../composables/useWhatsAppService.js'

export default {
  name: 'WhatsApp',
  setup() {
    // Usar serviço SOLID com injeção de dependências
    const whatsappService = useWhatsAppService()
    
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
    }
  }
}
</script>
