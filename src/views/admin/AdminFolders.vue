<!-- src/views/admin/AdminFolders.vue -->
<!-- Gestão de pastas administrativa -->

<template>
  <AdminLayout :loading="loading" @refresh="loadFolders">
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestão de Pastas</h2>
      
      <!-- Search by Hash -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Buscar Pasta por Hash</h3>
        <div class="flex space-x-4">
          <input
            v-model="hashQuery"
            type="text"
            placeholder="Digite o hash SHA256 da pasta..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
          <button
            @click="searchFolder"
            :disabled="!hashQuery || loading"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Buscar
          </button>
        </div>
      </div>
      
      <!-- Folder Details -->
      <div v-if="selectedFolder" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Detalhes da Pasta</h3>
          <button
            @click="banFolder"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Banir Pasta
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Hash</p>
            <p class="font-mono text-sm">{{ selectedFolder.hash }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Criada em</p>
            <p class="text-sm">{{ formatDate(selectedFolder.created_at) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total de Links</p>
            <p class="text-2xl font-bold">{{ selectedFolder.links_count }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <span :class="getStatusClasses(selectedFolder.status)">
              {{ selectedFolder.status }}
            </span>
          </div>
        </div>
        
        <!-- Links in Folder -->
        <div class="mt-6">
          <h4 class="font-semibold text-gray-900 mb-3">Links na Pasta</h4>
          <div class="space-y-2">
            <div v-for="link in selectedFolder.links" :key="link.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">{{ link.slug }}</p>
                <p class="text-sm text-gray-500 truncate">{{ link.url_destination }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ link.clicks }} cliques</p>
                <p class="text-xs text-gray-500">{{ formatDate(link.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Results -->
      <div v-else-if="hashQuery && !loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p class="text-gray-500">Nenhuma pasta encontrada para este hash</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

export default {
  name: 'AdminFolders',
  components: { AdminLayout },
  setup() {
    const loading = ref(false)
    const hashQuery = ref('')
    const selectedFolder = ref(null)
    
    const loadFolders = async () => {
      // Placeholder
    }
    
    const searchFolder = async () => {
      if (!hashQuery.value) return
      
      loading.value = true
      try {
        // Mock search
        await new Promise(resolve => setTimeout(resolve, 500))
        
        selectedFolder.value = {
          hash: hashQuery.value,
          created_at: new Date(),
          status: 'active',
          links_count: 3,
          links: [
            { id: 1, slug: 'link1', url_destination: 'https://example.com/1', clicks: 45, created_at: new Date() },
            { id: 2, slug: 'link2', url_destination: 'https://example.com/2', clicks: 23, created_at: new Date() },
            { id: 3, slug: 'link3', url_destination: 'https://example.com/3', clicks: 67, created_at: new Date() }
          ]
        }
      } catch (error) {
        console.error('Error searching folder:', error)
      } finally {
        loading.value = false
      }
    }
    
    const banFolder = async () => {
      if (!confirm('Tem certeza que deseja banir esta pasta? Todos os links serão desativados.')) {
        return
      }
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        selectedFolder.value.status = 'banned'
        alert('Pasta banida com sucesso!')
      } catch (error) {
        console.error('Error banning folder:', error)
      }
    }
    
    const getStatusClasses = (status) => {
      const classes = {
        active: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        banned: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
      }
      return classes[status] || classes.active
    }
    
    const formatDate = (date) => {
      return new Intl.DateTimeFormat('pt-BR').format(date)
    }
    
    return {
      loading,
      hashQuery,
      selectedFolder,
      loadFolders,
      searchFolder,
      banFolder,
      getStatusClasses,
      formatDate
    }
  }
}
</script>
