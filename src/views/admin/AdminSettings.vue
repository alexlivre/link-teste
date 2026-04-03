<!-- src/views/admin/AdminSettings.vue -->
<!-- Configurações administrativas -->

<template>
  <AdminLayout :loading="loading" @refresh="loadSettings">
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Configurações</h2>
      
      <!-- Admin Tools -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ferramentas de Administração</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            @click="resetAllCounters"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">Resetar Todos Contadores</p>
                <p class="text-sm text-gray-500">Zera todos os contadores de cliques</p>
              </div>
            </div>
          </button>
          
          <button
            @click="clearAnalytics"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">Limpar Analytics</p>
                <p class="text-sm text-gray-500">Remove todos os dados de analytics</p>
              </div>
            </div>
          </button>
          
          <button
            @click="exportData"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">Exportar Dados</p>
                <p class="text-sm text-gray-500">Baixar backup completo</p>
              </div>
            </div>
          </button>
          
          <button
            @click="showSystemInfo"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium">Informações do Sistema</p>
                <p class="text-sm text-gray-500">Ver status e configurações</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <!-- System Status -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Versão</p>
            <p class="text-lg font-semibold">v3.0 Clean</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Ambiente</p>
            <p class="text-lg font-semibold">Desenvolvimento</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Uptime</p>
            <p class="text-lg font-semibold">{{ uptime }}</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

export default {
  name: 'AdminSettings',
  components: { AdminLayout },
  setup() {
    const loading = ref(false)
    const uptime = ref('0d 0h 0m')
    let uptimeInterval = null
    
    const loadSettings = async () => {
      // Placeholder
    }
    
    const resetAllCounters = async () => {
      if (!confirm('Tem certeza que deseja resetar TODOS os contadores? Esta ação não pode ser desfeita.')) {
        return
      }
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        alert('Todos os contadores foram resetados com sucesso!')
      } catch (error) {
        console.error('Error resetting counters:', error)
      }
    }
    
    const clearAnalytics = async () => {
      if (!confirm('Tem certeza que deseja limpar TODOS os dados de analytics? Esta ação não pode ser desfeita.')) {
        return
      }
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        alert('Dados de analytics limpos com sucesso!')
      } catch (error) {
        console.error('Error clearing analytics:', error)
      }
    }
    
    const exportData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock export
        const data = {
          links: [],
          analytics: [],
          folders: [],
          exported_at: new Date().toISOString()
        }
        
        const blob = new window.Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `inkpage-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        
        alert('Dados exportados com sucesso!')
      } catch (error) {
        console.error('Error exporting data:', error)
      }
    }
    
    const showSystemInfo = () => {
      const info = `
INKPAGE System Information
========================
Version: v3.0 Clean
Environment: Development
Node.js: ${process.version}
Vue.js: 3.4.0
Database: JSON Local
Last Update: ${new Date().toLocaleString('pt-BR')}
      `.trim()
      
      alert(info)
    }
    
    const updateUptime = () => {
      const now = Date.now()
      const start = now - (2 * 24 * 60 * 60 * 1000) // Mock: 2 dias uptime
      
      const diff = now - start
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      uptime.value = `${days}d ${hours}h ${minutes}m`
    }
    
    onMounted(() => {
      loadSettings()
      updateUptime()
      uptimeInterval = setInterval(updateUptime, 60000) // Atualizar a cada minuto
    })
    
    onUnmounted(() => {
      if (uptimeInterval) {
        clearInterval(uptimeInterval)
      }
    })
    
    return {
      loading,
      uptime,
      loadSettings,
      resetAllCounters,
      clearAnalytics,
      exportData,
      showSystemInfo
    }
  }
}
</script>
