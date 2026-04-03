<!-- src/components/admin/AdminLayout.vue -->
<!-- Layout admin com menu lateral seguindo Clean Code (< 150 linhas) -->

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">INKPAGE</h1>
            <p class="text-sm text-gray-500">Painel Admin</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4">
        <div class="space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.route"
            class="admin-nav-item"
            active-class="admin-nav-item-active"
          >
            <span v-html="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </router-link>
        </div>
      </nav>

      <!-- User Section -->
      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Administrador</p>
              <p class="text-xs text-gray-500">admin@inkpage</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Sair"
          >
            <svg class="w-5 h-5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-gray-900">
              {{ currentPageTitle }}
            </h2>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500">
                Última atualização: {{ formatTimestamp(lastUpdate) }}
              </div>
              <button
                @click="$emit('refresh')"
                :disabled="loading"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                title="Atualizar"
              >
                <svg class="w-5 h-5"
                     :class="{ 'animate-spin': loading }"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

// Ícones SVG como strings HTML
const DashboardIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
  </svg>
`

const LinksIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
  </svg>
`

const FoldersIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
  </svg>
`

const AnalyticsIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
  </svg>
`

const CommandsIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
`

const SettingsIcon = `
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
`

export default {
  name: 'AdminLayout',
  props: {
    loading: { type: Boolean, default: false },
    lastUpdate: { type: [Date, String], default: new Date() }
  },
  emits: ['refresh'],
  setup() {
    const route = useRoute()
    const { logout } = useAuth()
    
    // Menu items configuráveis
    const menuItems = [
      { name: 'dashboard', label: 'Dashboard', route: '/admin', icon: DashboardIcon },
      { name: 'links', label: 'Links', route: '/admin/links', icon: LinksIcon },
      { name: 'folders', label: 'Pastas', route: '/admin/folders', icon: FoldersIcon },
      { name: 'analytics', label: 'Analytics', route: '/admin/analytics', icon: AnalyticsIcon },
      { name: 'commands', label: 'Comandos', route: '/admin/commands', icon: CommandsIcon },
      { name: 'settings', label: 'Configurações', route: '/admin/settings', icon: SettingsIcon }
    ]
    
    // Computed para título da página
    const currentPageTitle = computed(() => {
      const current = menuItems.find(item => item.route === route.path)
      return current ? current.label : 'Painel Administrativo'
    })
    
    // Função pequena para formatar timestamp (< 10 linhas)
    const formatTimestamp = (date) => {
      if (!date) return 'Nunca'
      const d = new Date(date)
      return d.toLocaleString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      })
    }
    
    // Handler para logout
    const handleLogout = () => {
      if (confirm('Tem certeza que deseja sair do painel administrativo?')) {
        logout()
      }
    }
    
    return {
      menuItems,
      currentPageTitle,
      formatTimestamp,
      handleLogout
    }
  }
}
</script>

<style scoped>
.admin-nav-item {
  @apply flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors;
}

.admin-nav-item-active {
  @apply text-indigo-600 bg-indigo-50;
}
</style>
