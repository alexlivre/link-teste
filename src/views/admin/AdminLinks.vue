<!-- src/views/admin/AdminLinks.vue -->
<!-- Gestão de links administrativa seguindo Clean Code -->

<template>
  <AdminLayout 
    :loading="loading" 
    :lastUpdate="lastUpdate"
    @refresh="loadLinks"
  >
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Gestão de Links</h2>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por slug ou URL..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="banned">Banidos</option>
          </select>
        </div>
      </div>
      
      <!-- Links Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL de Destino
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliques
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <div class="animate-pulse">Carregando links...</div>
                </td>
              </tr>
              <tr v-else-if="filteredLinks.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  Nenhum link encontrado
                </td>
              </tr>
              <tr v-else
                  v-for="link in paginatedLinks"
                  :key="link.id"
                  class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ link.slug }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 truncate max-w-xs" :title="link.url_destination">
                    {{ link.url_destination }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatNumber(link.clicks_day) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(link.is_active)">
                    {{ getStatusText(link.is_active) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(link.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="resetCounters(link)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Resetar
                  </button>
                  <button
                    @click="deleteLink(link)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div class="text-sm text-gray-700">
            Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ filteredLinks.length }} links
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
  name: 'AdminLinks',
  components: {
    AdminLayout
  },
  setup() {
    const loading = ref(false)
    const links = ref([])
    const searchQuery = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const pageSize = 10
    const lastUpdate = ref(null)
    
    // Mock data (será substituído por API)
    const mockLinks = [
      {
        id: 1,
        slug: 'promo-verao',
        url_destination: 'https://example.com/promocao-verao',
        clicks_day: 145,
        is_active: true,
        created_at: new Date('2024-01-15')
      },
      {
        id: 2,
        slug: 'whatsapp-business',
        url_destination: 'https://wa.me/5511999999999',
        clicks_day: 89,
        is_active: true,
        created_at: new Date('2024-01-14')
      },
      {
        id: 3,
        slug: 'lançamento',
        url_destination: 'https://example.com/novo-produto',
        clicks_day: 0,
        is_active: false,
        created_at: new Date('2024-01-13')
      }
    ]
    
    // Computed properties
    const filteredLinks = computed(() => {
      let filtered = links.value
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(link => 
          link.slug.toLowerCase().includes(query) ||
          link.url_destination.toLowerCase().includes(query)
        )
      }
      
      if (statusFilter.value) {
        filtered = filtered.filter(link => {
          if (statusFilter.value === 'active') return link.is_active
          if (statusFilter.value === 'inactive') return !link.is_active
          return true
        })
      }
      
      return filtered
    })
    
    const totalPages = computed(() => Math.ceil(filteredLinks.value.length / pageSize))
    const startIndex = computed(() => (currentPage.value - 1) * pageSize)
    const endIndex = computed(() => Math.min(startIndex.value + pageSize, filteredLinks.value.length))
    
    const paginatedLinks = computed(() => {
      return filteredLinks.value.slice(startIndex.value, endIndex.value)
    })
    
    // Methods
    const loadLinks = async () => {
      loading.value = true
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 500))
        links.value = mockLinks
        lastUpdate.value = new Date()
      } catch (error) {
        console.error('Error loading links:', error)
      } finally {
        loading.value = false
      }
    }
    
    const resetCounters = async (link) => {
      if (!confirm(`Tem certeza que deseja resetar os contadores do link "${link.slug}"?`)) {
        return
      }
      
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 300))
        link.clicks_day = 0
        alert('Contadores resetados com sucesso!')
      } catch (error) {
        console.error('Error resetting counters:', error)
        alert('Erro ao resetar contadores')
      }
    }
    
    const deleteLink = async (link) => {
      if (!confirm(`Tem certeza que deseja excluir o link "${link.slug}"? Esta ação não pode ser desfeita.`)) {
        return
      }
      
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 300))
        const index = links.value.findIndex(l => l.id === link.id)
        if (index > -1) {
          links.value.splice(index, 1)
        }
        alert('Link excluído com sucesso!')
      } catch (error) {
        console.error('Error deleting link:', error)
        alert('Erro ao excluir link')
      }
    }
    
    const getStatusClasses = (isActive) => {
      return isActive 
        ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
        : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    }
    
    const getStatusText = (isActive) => {
      return isActive ? 'Ativo' : 'Inativo'
    }
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat('pt-BR').format(num)
    }
    
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('pt-BR').format(date)
    }
    
    onMounted(() => {
      loadLinks()
    })
    
    return {
      loading,
      links,
      searchQuery,
      statusFilter,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      paginatedLinks,
      filteredLinks,
      lastUpdate,
      loadLinks,
      resetCounters,
      deleteLink,
      getStatusClasses,
      getStatusText,
      formatNumber,
      formatDate
    }
  }
}
</script>
