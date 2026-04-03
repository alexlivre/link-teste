<!-- views/Home.vue -->
// Página inicial vibrante e moderna

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Hero Section Clean -->
    <section class="text-center py-16 md:py-24">
      <!-- Título principal -->
      <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        <span class="block text-neutral-900">Links simples</span>
        <span class="block text-neutral-600">e rápidos</span>
      </h1>
      
      <!-- Subtítulo clean -->
      <p class="text-lg md:text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Ferramenta prática para criar links de WhatsApp e encurtar URLs.
        <span class="block mt-2 text-neutral-500">Sem cadastro, sem anúncios.</span>
      </p>
      
      <!-- Botões de ação clean -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <router-link 
          to="/whatsapp" 
          class="btn-primary text-lg px-8 py-4"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Gerar Link WhatsApp
        </router-link>
        <router-link 
          to="/encurtar" 
          class="btn-secondary text-lg px-8 py-4"
        >
          <svg class="w-5 h-5 mr-2"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          Encurtar URL
        </router-link>
      </div>
      
      <!-- Indicadores de confiança clean -->
      <div class="flex flex-wrap justify-center gap-4 mb-16">
        <div class="flex items-center text-sm text-neutral-600 bg-neutral-100 px-4 py-2 rounded-lg">
          <svg class="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          100% Seguro
        </div>
        <div class="flex items-center text-sm text-neutral-600 bg-neutral-100 px-4 py-2 rounded-lg">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Instantâneo
        </div>
        <div class="flex items-center text-sm text-neutral-600 bg-neutral-100 px-4 py-2 rounded-lg">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1"/>
          </svg>
          Sempre Grátis
        </div>
      </div>
    </section>
    
    <!-- Features Cards Clean -->
    <section class="py-16">
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
          Por que usar o <span class="text-neutral-900">LINKPAGE</span>?
        </h2>
        <p class="text-neutral-600 max-w-2xl mx-auto">
          Design minimalista com funcionalidades essenciais para sua produtividade.
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Feature 1: Instantâneo -->
        <div class="card card-hover">
          <div class="p-6">
            <div class="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">Instantâneo</h3>
            <p class="text-neutral-600 leading-relaxed">
              Gere links em milissegundos com processamento 100% no navegador. 
              Sem esperas, sem servidores.
            </p>
          </div>
        </div>
        
        <!-- Feature 2: Seguro -->
        <div class="card card-hover">
          <div class="p-6">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">100% Seguro</h3>
            <p class="text-neutral-600 leading-relaxed">
              Seus dados ficam no seu navegador. Nenhuma informação é enviada para servidores. 
              Privacidade garantida.
            </p>
          </div>
        </div>
        
        <!-- Feature 3: Grátis -->
        <div class="card card-hover">
          <div class="p-6">
            <div class="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">Sempre Grátis</h3>
            <p class="text-neutral-600 leading-relaxed">
              Uso ilimitado para todos os recursos. 
              Sem surpresas, sem custos escondidos.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Seção de Estatísticas Clean -->
    <section class="py-16 bg-neutral-50 rounded-lg">
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
          Numeros que importam
        </h2>
        <p class="text-neutral-600 max-w-2xl mx-auto">
          Crescimento orgânico baseado em experiência excepcional.
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8 px-8">
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            10K+
          </div>
          <p class="text-neutral-600 font-medium">Links Criados</p>
        </div>
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            100%
          </div>
          <p class="text-neutral-600 font-medium">Uptime</p>
        </div>
        <div class="text-center">
          <div class="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
            0ms
          </div>
          <p class="text-neutral-600 font-medium">Latência</p>
        </div>
      </div>
    </section>
    
    <!-- CTA Final Clean -->
    <section class="py-16 text-center">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
          Pronto para simplificar seus <span class="text-neutral-700">links</span>?
        </h2>
        <p class="text-neutral-600 mb-8">
          Junte-se a milhares de usuários que já transformaram sua produtividade.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/whatsapp" 
            class="btn-primary text-lg px-8 py-4"
          >
            Começar Agora
          </router-link>
          <router-link 
            to="/pasta" 
            class="btn-secondary text-lg px-8 py-4"
          >
            Ver Demonstração
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
