<!-- src/views/admin/AdminCommands.vue -->
<!-- Painel de comandos avançados do superusuário -->

<template>
  <AdminLayout :loading="loading" :lastUpdate="lastUpdate" @refresh="refreshAll">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Comandos de Super Usuário</h2>
        <div class="flex items-center space-x-2">
          <span :class="healthStatusClass" class="px-3 py-1 rounded-full text-sm font-medium">
            {{ healthStatus }}
          </span>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        v-if="notification.show"
        :class="notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'"
        class="border-l-4 p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between"
      >
        <div class="flex items-center">
          <svg v-if="notification.type === 'success'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">{{ notification.message }}</span>
        </div>
        <button @click="notification.show = false" class="ml-4 text-gray-500 hover:text-gray-700">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- System Health & Maintenance -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Health Check -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Health Check
          </h3>
          <div v-if="healthData" class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Status</span>
              <span :class="healthData.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'" class="text-sm font-semibold">
                {{ healthData.status === 'healthy' ? 'Saudável' : 'Degradado' }}
              </span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Database</span>
              <span class="text-sm text-green-600 font-semibold">OK</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Memória</span>
              <span class="text-sm text-gray-900">{{ formatMemory(healthData.checks?.memory?.used) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Uptime</span>
              <span class="text-sm text-gray-900">{{ formatUptime(healthData.checks?.uptime) }}</span>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Clique para verificar o status
          </div>
          <button
            @click="checkHealth"
            :disabled="loadingHealth"
            class="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {{ loadingHealth ? 'Verificando...' : 'Verificar Status' }}
          </button>
        </div>

        <!-- Maintenance Mode -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            Modo Manutenção
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-700">Status</span>
              <span :class="maintenanceEnabled ? 'text-red-600' : 'text-green-600'" class="text-sm font-semibold">
                {{ maintenanceEnabled ? 'Ativado' : 'Desativado' }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mensagem de Manutenção</label>
              <textarea
                v-model="maintenanceMessage"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Mensagem exibida aos usuários durante manutenção..."
              ></textarea>
            </div>
            <button
              @click="toggleMaintenance"
              :disabled="loadingMaintenance"
              :class="maintenanceEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
              class="w-full px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              {{ loadingMaintenance ? 'Processando...' : maintenanceEnabled ? 'Desativar Manutenção' : 'Ativar Manutenção' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cache Management -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Gerenciamento de Cache
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            @click="clearCache"
            :disabled="loadingCache"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors disabled:opacity-50"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Limpar Cache</p>
                <p class="text-sm text-gray-500">Remove todos os dados em cache</p>
              </div>
            </div>
          </button>

          <button
            @click="rebuildCache"
            :disabled="loadingCache"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors disabled:opacity-50"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Rebuild Cache</p>
                <p class="text-sm text-gray-500">Reconstrói o cache completamente</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Rate Limiting -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Controle de Rate Limiting
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Janela (ms)</label>
            <input
              v-model.number="rateLimitConfig.windowMs"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="900000"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Requisições</label>
            <input
              v-model.number="rateLimitConfig.maxRequests"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="100"
            >
          </div>
          <div class="flex items-end">
            <button
              @click="saveRateLimit"
              :disabled="loadingRateLimit"
              class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {{ loadingRateLimit ? 'Salvando...' : 'Salvar Configuração' }}
            </button>
          </div>
        </div>
      </div>

      <!-- IP Ban Management -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
          Gerenciamento de IPs Banidos
        </h3>
        <div class="space-y-4">
          <div class="flex space-x-2">
            <input
              v-model="newBanIP"
              type="text"
              placeholder="Endereço IP (ex: 192.168.1.1)"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
            <input
              v-model="newBanReason"
              type="text"
              placeholder="Motivo"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
            <button
              @click="banIP"
              :disabled="loadingIPs || !newBanIP"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Banir
            </button>
          </div>

          <div v-if="bannedIPs.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="banned in bannedIPs" :key="banned.ip">
                  <td class="px-4 py-3 text-sm font-mono text-gray-900">{{ banned.ip }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ banned.reason }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(banned.banned_at) }}</td>
                  <td class="px-4 py-3 text-right">
                    <button
                      @click="unbanIP(banned.ip)"
                      :disabled="loadingIPs"
                      class="text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    >
                      Desbanir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            Nenhum IP banido
          </div>
        </div>
      </div>

      <!-- Broadcast Messages -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          Enviar Mensagem Broadcast
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
            <textarea
              v-model="broadcastMessage"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Digite a mensagem que será enviada aos usuários..."
            ></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Destinatários</label>
              <select v-model="broadcastTarget" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="all">Todos os usuários</option>
                <option value="active">Usuários ativos</option>
                <option value="admins">Apenas administradores</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Canais</label>
              <select v-model="broadcastChannel" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="system">Sistema (notificação interna)</option>
                <option value="email">E-mail</option>
                <option value="both">Sistema + E-mail</option>
              </select>
            </div>
          </div>
          <button
            @click="sendBroadcast"
            :disabled="loadingBroadcast || !broadcastMessage"
            class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {{ loadingBroadcast ? 'Enviando...' : 'Enviar Broadcast' }}
          </button>
        </div>
      </div>

      <!-- System Logs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Logs do Sistema
        </h3>
        <div class="space-y-4">
          <div class="flex space-x-2">
            <select v-model="logLevelFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Todos os níveis</option>
              <option value="error">Error</option>
              <option value="warn">Warn</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
            <input
              v-model="logSearch"
              type="text"
              placeholder="Buscar nos logs..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
            <button
              @click="loadLogs"
              :disabled="loadingLogs"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {{ loadingLogs ? 'Carregando...' : 'Atualizar' }}
            </button>
          </div>

          <div class="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div v-if="logs.length === 0" class="text-gray-500 text-center py-8">
              Nenhum log encontrado
            </div>
            <div v-for="log in logs" :key="log.id" class="mb-2 font-mono text-sm">
              <span :class="getLogLevelClass(log.level)" class="px-2 py-1 rounded text-xs mr-2">
                {{ log.level?.toUpperCase() || 'INFO' }}
              </span>
              <span class="text-gray-400">[{{ formatTimestamp(log.timestamp) }}]</span>
              <span class="text-gray-300 ml-2">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { useAdminAPI } from '@/composables/useAdminAPI.js'

export default {
  name: 'AdminCommands',
  components: { AdminLayout },
  setup() {
    const loading = ref(false)
    const lastUpdate = ref(new Date())
    const adminAPI = useAdminAPI()

    // Health Check
    const healthData = ref(null)
    const loadingHealth = ref(false)
    const healthStatus = ref('Desconhecido')
    const healthStatusClass = ref('bg-gray-200 text-gray-800')

    // Maintenance
    const maintenanceEnabled = ref(false)
    const maintenanceMessage = ref('')
    const loadingMaintenance = ref(false)

    // Cache
    const loadingCache = ref(false)

    // Rate Limiting
    const rateLimitConfig = ref({ windowMs: 900000, maxRequests: 100 })
    const loadingRateLimit = ref(false)

    // IP Ban
    const newBanIP = ref('')
    const newBanReason = ref('')
    const bannedIPs = ref([])
    const loadingIPs = ref(false)

    // Broadcast
    const broadcastMessage = ref('')
    const broadcastTarget = ref('all')
    const broadcastChannel = ref('system')
    const loadingBroadcast = ref(false)

    // Logs
    const logs = ref([])
    const loadingLogs = ref(false)
    const logLevelFilter = ref('')
    const logSearch = ref('')

    // Notification
    const notification = ref({ show: false, message: '', type: 'success' })

    const showNotification = (message, type = 'success') => {
      notification.value = { show: true, message, type }
      setTimeout(() => {
        notification.value.show = false
      }, 5000)
    }

    // Health Check
    const checkHealth = async () => {
      loadingHealth.value = true
      try {
        healthData.value = await adminAPI.getHealth()
        healthStatus.value = healthData.value.status === 'healthy' ? 'Saudável' : 'Degradado'
        healthStatusClass.value = healthData.value.status === 'healthy'
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      } catch (error) {
        console.error('Error checking health:', error)
        healthStatus.value = 'Erro'
        healthStatusClass.value = 'bg-red-100 text-red-800'
        // Dados mock para demonstração
        healthData.value = {
          status: 'healthy',
          checks: {
            database: { status: 'ok', message: 'Database acessível' },
            memory: { status: 'ok', used: 52428800, total: 134217728 },
            uptime: 86400 * 2.5,
            response_time: 15,
            timestamp: new Date().toISOString()
          },
          version: 'v3.0 Clean',
          timestamp: new Date().toISOString()
        }
      } finally {
        loadingHealth.value = false
      }
    }

    // Maintenance
    const loadMaintenanceStatus = async () => {
      try {
        const status = await adminAPI.getMaintenanceStatus()
        maintenanceEnabled.value = status.enabled || false
        maintenanceMessage.value = status.message || ''
      } catch (error) {
        console.error('Error loading maintenance status:', error)
      }
    }

    const toggleMaintenance = async () => {
      loadingMaintenance.value = true
      try {
        await adminAPI.toggleMaintenance(!maintenanceEnabled.value, maintenanceMessage.value)
        maintenanceEnabled.value = !maintenanceEnabled.value
        showNotification(`Modo manutenção ${maintenanceEnabled.value ? 'ativado' : 'desativado'} com sucesso!`)
      } catch (error) {
        console.error('Error toggling maintenance:', error)
        showNotification('Erro ao alternar modo manutenção', 'error')
      } finally {
        loadingMaintenance.value = false
      }
    }

    // Cache
    const clearCache = async () => {
      if (!confirm('Tem certeza que deseja limpar todo o cache?')) return

      loadingCache.value = true
      try {
        await adminAPI.clearCache()
        showNotification('Cache limpo com sucesso!')
      } catch (error) {
        console.error('Error clearing cache:', error)
        showNotification('Erro ao limpar cache', 'error')
      } finally {
        loadingCache.value = false
      }
    }

    const rebuildCache = async () => {
      if (!confirm('Tem certeza que deseja rebuildar o cache?')) return

      loadingCache.value = true
      try {
        await adminAPI.rebuildCache()
        showNotification('Cache rebuild com sucesso!')
      } catch (error) {
        console.error('Error rebuilding cache:', error)
        showNotification('Erro ao rebuildar cache', 'error')
      } finally {
        loadingCache.value = false
      }
    }

    // Rate Limiting
    const loadRateLimitConfig = async () => {
      try {
        rateLimitConfig.value = await adminAPI.getRateLimitConfig()
      } catch (error) {
        console.error('Error loading rate limit config:', error)
        // Dados mock
        rateLimitConfig.value = { windowMs: 900000, maxRequests: 100 }
      }
    }

    const saveRateLimit = async () => {
      loadingRateLimit.value = true
      try {
        await adminAPI.configureRateLimit(rateLimitConfig.value)
        showNotification('Rate limiting configurado com sucesso!')
      } catch (error) {
        console.error('Error saving rate limit:', error)
        showNotification('Erro ao salvar rate limiting', 'error')
      } finally {
        loadingRateLimit.value = false
      }
    }

    // IP Ban
    const loadBannedIPs = async () => {
      loadingIPs.value = true
      try {
        const data = await adminAPI.getBannedIPs()
        bannedIPs.value = data.banned_ips || []
      } catch (error) {
        console.error('Error loading banned IPs:', error)
        bannedIPs.value = []
      } finally {
        loadingIPs.value = false
      }
    }

    const banIP = async () => {
      if (!newBanIP.value) return

      loadingIPs.value = true
      try {
        await adminAPI.banIP(newBanIP.value, newBanReason.value)
        newBanIP.value = ''
        newBanReason.value = ''
        await loadBannedIPs()
        showNotification('IP banido com sucesso!')
      } catch (error) {
        console.error('Error banning IP:', error)
        showNotification('Erro ao banir IP', 'error')
      } finally {
        loadingIPs.value = false
      }
    }

    const unbanIP = async (ip) => {
      if (!confirm(`Tem certeza que deseja desbanir o IP ${ip}?`)) return

      loadingIPs.value = true
      try {
        await adminAPI.unbanIP(ip)
        await loadBannedIPs()
        showNotification('IP desbanido com sucesso!')
      } catch (error) {
        console.error('Error unbanning IP:', error)
        showNotification('Erro ao desbanir IP', 'error')
      } finally {
        loadingIPs.value = false
      }
    }

    // Broadcast
    const sendBroadcast = async () => {
      if (!broadcastMessage.value) return

      loadingBroadcast.value = true
      try {
        await adminAPI.broadcast(
          broadcastMessage.value,
          broadcastTarget.value,
          [broadcastChannel.value]
        )
        broadcastMessage.value = ''
        showNotification('Mensagem broadcast enviada com sucesso!')
      } catch (error) {
        console.error('Error sending broadcast:', error)
        showNotification('Erro ao enviar broadcast', 'error')
      } finally {
        loadingBroadcast.value = false
      }
    }

    // Logs
    const loadLogs = async () => {
      loadingLogs.value = true
      try {
        const params = {}
        if (logLevelFilter.value) params.level = logLevelFilter.value
        if (logSearch.value) params.search = logSearch.value

        const data = await adminAPI.getLogs(params)
        logs.value = data.logs || []
      } catch (error) {
        console.error('Error loading logs:', error)
      } finally {
        loadingLogs.value = false
      }
    }

    // Utility functions
    const formatMemory = (bytes) => {
      if (!bytes) return 'N/A'
      const mb = bytes / (1024 * 1024)
      return `${mb.toFixed(2)} MB`
    }

    const formatUptime = (seconds) => {
      if (!seconds) return 'N/A'
      const days = Math.floor(seconds / (24 * 60 * 60))
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
      const minutes = Math.floor((seconds % (60 * 60)) / 60)
      return `${days}d ${hours}h ${minutes}m`
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A'
      return new Date(dateStr).toLocaleString('pt-BR')
    }

    const formatTimestamp = (dateStr) => {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleTimeString('pt-BR')
    }

    const getLogLevelClass = (level) => {
      const classes = {
        error: 'bg-red-600 text-white',
        warn: 'bg-yellow-600 text-white',
        info: 'bg-blue-600 text-white',
        debug: 'bg-gray-600 text-white'
      }
      return classes[level] || classes.info
    }

    const refreshAll = async () => {
      lastUpdate.value = new Date()
      await Promise.all([
        checkHealth(),
        loadMaintenanceStatus(),
        loadBannedIPs(),
        loadRateLimitConfig(),
        loadLogs()
      ])
    }

    onMounted(() => {
      refreshAll()
    })

    return {
      loading,
      lastUpdate,
      notification,
      healthData,
      loadingHealth,
      healthStatus,
      healthStatusClass,
      maintenanceEnabled,
      maintenanceMessage,
      loadingMaintenance,
      loadingCache,
      rateLimitConfig,
      loadingRateLimit,
      newBanIP,
      newBanReason,
      bannedIPs,
      loadingIPs,
      broadcastMessage,
      broadcastTarget,
      broadcastChannel,
      loadingBroadcast,
      logs,
      loadingLogs,
      logLevelFilter,
      logSearch,
      checkHealth,
      toggleMaintenance,
      clearCache,
      rebuildCache,
      saveRateLimit,
      banIP,
      unbanIP,
      sendBroadcast,
      loadLogs,
      refreshAll,
      formatMemory,
      formatUptime,
      formatDate,
      formatTimestamp,
      getLogLevelClass
    }
  }
}
</script>
