<!-- App.vue -->
// Layout principal vibrante e moderno

<template>
  <div class="min-h-screen bg-white">
    <!-- Header clean -->
    <header class="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <!-- Logo clean -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
            </div>
            <h1 class="text-xl font-bold text-neutral-900">LINKPAGE</h1>
          </div>
          
          <!-- Menu desktop -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link 
              to="/" 
              class="nav-link"
              exact-active-class="nav-link-active"
            >
              <svg class="w-4 h-4 mr-2"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Início
            </router-link>
            <router-link 
              to="/whatsapp" 
              class="nav-link"
              exact-active-class="nav-link-active"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </router-link>
            <router-link 
              to="/encurtar" 
              class="nav-link"
              exact-active-class="nav-link-active"
            >
              <svg class="w-4 h-4 mr-2"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              Encurtar
            </router-link>
            <router-link
              to="/pasta"
              class="nav-link"
              exact-active-class="nav-link-active"
            >
              <svg class="w-4 h-4 mr-2"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              </svg>
              Minha Pasta
            </router-link>
          </div>
          
          <!-- Menu mobile button -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <svg class="w-5 h-5 text-neutral-600"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </nav>
        
        <!-- Menu mobile dropdown -->
        <transition 
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div v-if="showMobileMenu" class="md:hidden py-4 space-y-2 mt-4 border-t border-neutral-200">
            <router-link to="/" class="mobile-nav-link" exact-active-class="mobile-nav-link-active">
              <svg class="w-4 h-4 mr-3"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Início
            </router-link>
            <router-link to="/whatsapp" class="mobile-nav-link" exact-active-class="mobile-nav-link-active">
              <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </router-link>
            <router-link to="/encurtar" class="mobile-nav-link" exact-active-class="mobile-nav-link-active">
              <svg class="w-4 h-4 mr-3"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              Encurtar
            </router-link>
            <router-link to="/pasta" class="mobile-nav-link" exact-active-class="mobile-nav-link-active">
              <svg class="w-4 h-4 mr-3"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              </svg>
              Minha Pasta
            </router-link>
          </div>
        </transition>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <!-- Footer clean -->
    <footer class="bg-neutral-50 border-t border-neutral-200 mt-20">
      <div class="container mx-auto px-4 py-12">
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-neutral-900">LINKPAGE</h3>
            </div>
            <p class="text-neutral-600 max-w-sm">
              Ferramenta simples e rápida para criar links de WhatsApp e encurtar URLs. 
              100% gratuito e seguro.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="badge badge-neutral">100% Gratuito</span>
              <span class="badge badge-outline">Sem Cadastro</span>
            </div>
          </div>
          
          <!-- Links rápidos -->
          <div class="space-y-4">
            <h4 class="font-semibold text-neutral-900">Ferramentas</h4>
            <div class="space-y-2">
              <router-link to="/whatsapp" class="block text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                Gerador de Links WhatsApp
              </router-link>
              <router-link to="/encurtar" class="block text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                Encurtador de URLs
              </router-link>
              <router-link to="/pasta" class="block text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                Gerenciar Links
              </router-link>
            </div>
          </div>
          
          <!-- Info -->
          <div class="space-y-4">
            <h4 class="font-semibold text-neutral-900">Sobre</h4>
            <div class="space-y-2">
              <p class="text-neutral-600 text-sm">
                Feito com Vue.js 3 + Tailwind CSS
              </p>
              <div class="flex items-center space-x-2 text-sm text-neutral-500">
                <span>© 2026</span>
                <span>•</span>
                <span class="text-neutral-700 font-medium">v3.0 Clean</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom bar -->
        <div class="mt-12 pt-8 border-t border-neutral-200 text-center">
          <p class="text-neutral-500 text-sm">
            100% client-side • Seus dados ficam no seu navegador • Privacidade garantida
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'

// Gerenciamento do menu mobile
const useMobileMenu = () => {
  const showMobileMenu = ref(false)
  
  const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
  }
  
  return { showMobileMenu, toggleMobileMenu }
}

export default {
  name: 'App',
  setup() {
    const { showMobileMenu, toggleMobileMenu } = useMobileMenu()
    
    return {
      showMobileMenu,
      toggleMobileMenu
    }
  }
}
</script>
