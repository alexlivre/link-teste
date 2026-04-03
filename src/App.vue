<!-- App.vue -->
// Componente principal da aplicação seguindo Clean Code (< 100 linhas)

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header com navegação -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <h1 class="text-2xl font-bold text-primary-600">INKPAGE</h1>
          </div>
          
          <!-- Menu desktop -->
          <div class="hidden md:flex space-x-6">
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Início
            </router-link>
            <router-link 
              to="/whatsapp" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              WhatsApp
            </router-link>
            <router-link 
              to="/encurtar" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Encurtador
            </router-link>
            <router-link 
              to="/pasta" 
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Minha Pasta
            </router-link>
          </div>
          
          <!-- Menu mobile -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </nav>
        
        <!-- Menu mobile dropdown -->
        <div v-if="showMobileMenu" class="md:hidden py-4 space-y-2">
          <router-link to="/" class="block py-2 text-gray-600">Início</router-link>
          <router-link to="/whatsapp" class="block py-2 text-gray-600">WhatsApp</router-link>
          <router-link to="/encurtar" class="block py-2 text-gray-600">Encurtador</router-link>
          <router-link to="/pasta" class="block py-2 text-gray-600">Minha Pasta</router-link>
        </div>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="container mx-auto px-4 py-6">
        <p class="text-center text-gray-500 text-sm">
          © 2026 INKPAGE. Ferramenta rápida e limpa para links.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';

// Função pequena para gerenciar menu mobile (< 20 linhas)
const useMobileMenu = () => {
  const showMobileMenu = ref(false);
  
  const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value;
  };
  
  return { showMobileMenu, toggleMobileMenu };
};

export default {
  name: 'App',
  setup() {
    const { showMobileMenu, toggleMobileMenu } = useMobileMenu();
    
    return {
      showMobileMenu,
      toggleMobileMenu
    };
  }
};
</script>
