<!-- views/Home.vue -->
// Página inicial seguindo Clean Code (< 100 linhas)

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Hero section -->
    <section class="text-center py-12 fade-in">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Links Rápidos e
        <span class="text-primary-600">Limpos</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        A ferramenta mais rápida para criar links de WhatsApp e encurtar URLs. 
        Sem cadastro, sem anúncios, sem complicação.
      </p>
      
      <!-- Botões de ação -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/whatsapp" 
          class="btn-primary text-lg px-8 py-3"
        >
          Gerar Link WhatsApp
        </router-link>
        <router-link 
          to="/encurtar" 
          class="btn-secondary text-lg px-8 py-3"
        >
          Encurtar URL
        </router-link>
      </div>
    </section>
    
    <!-- Features -->
    <section class="grid md:grid-cols-3 gap-8 py-12">
      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Instantâneo</h3>
        <p class="text-gray-600">Gere links em milissegundos, processamento 100% no navegador.</p>
      </div>
      
      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <div class="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Seguro</h3>
        <p class="text-gray-600">Seus dados ficam no seu navegador. Nenhuma informação é enviada para servidores.</p>
      </div>
      
      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Grátis</h3>
        <p class="text-gray-600">Uso ilimitado para links de WhatsApp. Funcionalidades avançadas em desenvolvimento.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>
