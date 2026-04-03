<!-- src/views/admin/AdminAnalytics.vue -->
<!-- Analytics detalhados administrativos -->

<template>
  <AdminLayout :loading="loading" @refresh="loadAnalytics">
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Analytics Detalhados</h2>
      
      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Referer</label>
            <input
              v-model="filters.referer"
              type="text"
              placeholder="Filtrar por referer..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
          </div>
        </div>
        <div class="mt-4 flex space-x-4">
          <button
            @click="applyFilters"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Aplicar Filtros
          </button>
          <button
            @click="clearFilters"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Limpar
          </button>
        </div>
      </div>
      
      <!-- Analytics Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Agent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bot</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <div class="animate-pulse">Carregando analytics...</div>
                </td>
              </tr>
              <tr v-else-if="analytics.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  Nenhum dado encontrado no período
                </td>
              </tr>
              <tr v-else
                  v-for="event in paginatedAnalytics"
                  :key="event.id"
                  class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  {{ formatDateTime(event.accessed_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {{ event.link_slug }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span class="truncate max-w-xs block" :title="event.referer">
                    {{ event.referer || 'Direto' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span class="truncate max-w-xs block" :title="event.user_agent">
                    {{ getUserAgentShort(event.user_agent) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  {{ event.country || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="event.is_bot ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" 
                        class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ event.is_bot ? 'Sim' : 'Não' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div class="text-sm text-gray-700">
            Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ analytics.length }} eventos
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span class="px-3 py-1 text-sm">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

export default {
  name: 'AdminAnalytics',
  components: { AdminLayout },
  setup() {
    const loading = ref(false)
    const analytics = ref([])
    const currentPage = ref(1)
    const pageSize = 20
    const filters = ref({
      startDate: '',
      endDate: '',
      referer: ''
    })
    
    // Mock data
    const mockAnalytics = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      accessed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      link_slug: `link-${i + 1}`,
      referer: Math.random() > 0.5 ? 'https://google.com' : 'https://facebook.com',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      country: 'BR',
      is_bot: Math.random() > 0.9
    }))
    
    const totalPages = computed(() => Math.ceil(analytics.value.length / pageSize))
    const startIndex = computed(() => (currentPage.value - 1) * pageSize)
    const endIndex = computed(() => Math.min(startIndex.value + pageSize, analytics.value.length))
    
    const paginatedAnalytics = computed(() => {
      return analytics.value.slice(startIndex.value, endIndex.value)
    })
    
    const loadAnalytics = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        analytics.value = mockAnalytics
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        loading.value = false
      }
    }
    
    const applyFilters = async () => {
      // Simular aplicação de filtros
      loading.value = true
      await new Promise(resolve => setTimeout(resolve, 300))
      loading.value = false
    }
    
    const clearFilters = () => {
      filters.value = {
        startDate: '',
        endDate: '',
        referer: ''
      }
      loadAnalytics()
    }
    
    const formatDateTime = (date) => {
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(date)
    }
    
    const getUserAgentShort = (ua) => {
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Firefox')) return 'Firefox'
      if (ua.includes('Safari')) return 'Safari'
      return 'Outro'
    }
    
    onMounted(() => {
      loadAnalytics()
    })
    
    return {
      loading,
      analytics,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      paginatedAnalytics,
      filters,
      loadAnalytics,
      applyFilters,
      clearFilters,
      formatDateTime,
      getUserAgentShort
    }
  }
}
</script>
