<!-- src/views/admin/AdminDashboard.vue -->
<!-- Dashboard admin principal seguindo Clean Code (< 150 linhas) -->

<template>
  <AdminLayout 
    :loading="loading" 
    :lastUpdate="lastUpdate"
    @refresh="refresh"
  >
    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total de Links"
        subtitle="Links criados"
        :value="metrics.total_links"
        icon="link"
        icon-color="blue"
        :trend="linkTrend"
        trend-direction="up"
        footer="Últimos 30 dias"
      />
      
      <MetricCard
        title="Cliques Hoje"
        subtitle="Acessos hoje"
        :value="metrics.clicks_today"
        icon="click"
        icon-color="green"
        :trend="clickTrend"
        trend-direction="up"
        footer="Últimas 24 horas"
      />
      
      <MetricCard
        title="Links Ativos"
        subtitle="Funcionando"
        :value="metrics.active_links"
        icon="link"
        icon-color="purple"
        :show-progress="true"
        :progress="activeLinksPercentage"
        progress-label="Taxa de ativação"
      />
      
      <MetricCard
        title="Pastas Criadas"
        subtitle="Grupos de links"
        :value="metrics.total_folders"
        icon="folder"
        icon-color="orange"
        :trend="folderTrend"
        trend-direction="up"
        footer="Total organizado"
      />
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Clicks por Dia -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cliques por Dia (7 dias)</h3>
        <div v-if="loadingCharts" class="h-64 flex items-center justify-center">
          <div class="text-gray-500">Carregando gráfico...</div>
        </div>
        <AnalyticsChart
          v-else
          type="bar"
          :data="dailyClicksData"
          :options="chartOptions"
        />
      </div>
      
      <!-- Clicks por Hora -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cliques por Hora (24h)</h3>
        <div v-if="loadingCharts" class="h-64 flex items-center justify-center">
          <div class="text-gray-500">Carregando gráfico...</div>
        </div>
        <AnalyticsChart
          v-else
          type="line"
          :data="hourlyClicksData"
          :options="chartOptions"
        />
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
      <div v-if="loadingActivity" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4"/>
        </div>
      </div>
      <div v-else-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
        Nenhuma atividade recente
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
        >
          <div class="flex items-center space-x-3">
            <div :class="getActivityIconClasses(activity.type)">
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ activity.description }}</p>
            </div>
          </div>
          <span class="text-xs text-gray-400">
            {{ formatTimestamp(activity.timestamp) }}
          </span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, computed, onMounted, h } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import MetricCard from '@/components/admin/MetricCard.vue'
import AnalyticsChart from '@/components/admin/AnalyticsChart.vue'
import { usePolling } from '@/composables/usePolling.js'

// Mock data service (será substituído por API real)
const mockAdminService = {
  async getMetrics() {
    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      total_links: 150,
      clicks_today: 45,
      active_links: 142,
      total_folders: 28,
      link_trend: '+12%',
      click_trend: '+8%',
      folder_trend: '+3%'
    }
  },
  
  async getDailyClicks() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    const data = [23, 45, 38, 52, 48, 35, 41]
    
    return {
      labels: days,
      datasets: [{
        label: 'Cliques',
        data: data,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2
      }]
    }
  },
  
  async getHourlyClicks() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    const data = [12, 8, 5, 3, 2, 4, 8, 15, 25, 32, 28, 35, 42, 38, 45, 52, 48, 55, 62, 58, 45, 35, 28, 20]
    
    return {
      labels: hours,
      datasets: [{
        label: 'Cliques',
        data: data,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    }
  },
  
  async getRecentActivity() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [
      {
        id: 1,
        type: 'link_created',
        title: 'Novo link criado',
        description: 'whatsapp/promocao',
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: 2,
        type: 'click_recorded',
        title: 'Clique registrado',
        description: 'promo/verao - 15 cliques',
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: 3,
        type: 'folder_created',
        title: 'Pasta criada',
        description: 'Campanha de Verão',
        timestamp: new Date(Date.now() - 1000 * 60 * 30)
      }
    ]
  }
}

export default {
  name: 'AdminDashboard',
  components: {
    AdminLayout,
    MetricCard,
    AnalyticsChart
  },
  setup() {
    const loading = ref(false)
    const loadingCharts = ref(false)
    const loadingActivity = ref(false)
    const metrics = ref({})
    const dailyClicksData = ref({})
    const hourlyClicksData = ref({})
    const recentActivity = ref([])
    
    // Configuração do polling (10 segundos)
    const { lastUpdate, refresh } = usePolling(async () => {
      await loadMetrics()
    }, 10000)
    
    // Computed para métricas derivadas
    const activeLinksPercentage = computed(() => {
      if (!metrics.value.total_links) return 0
      return (metrics.value.active_links / metrics.value.total_links) * 100
    })
    
    const linkTrend = computed(() => metrics.value.link_trend || '')
    const clickTrend = computed(() => metrics.value.click_trend || '')
    const folderTrend = computed(() => metrics.value.folder_trend || '')
    
    // Opções padrão para gráficos
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [2, 2]
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
    
    // Funções para carregar dados
    const loadMetrics = async () => {
      loading.value = true
      try {
        metrics.value = await mockAdminService.getMetrics()
      } catch (error) {
        console.error('Error loading metrics:', error)
      } finally {
        loading.value = false
      }
    }
    
    const loadCharts = async () => {
      loadingCharts.value = true
      try {
        dailyClicksData.value = await mockAdminService.getDailyClicks()
        hourlyClicksData.value = await mockAdminService.getHourlyClicks()
      } catch (error) {
        console.error('Error loading charts:', error)
      } finally {
        loadingCharts.value = false
      }
    }
    
    const loadActivity = async () => {
      loadingActivity.value = true
      try {
        recentActivity.value = await mockAdminService.getRecentActivity()
      } catch (error) {
        console.error('Error loading activity:', error)
      } finally {
        loadingActivity.value = false
      }
    }
    
    // Funções utilitárias
    const formatTimestamp = (date) => {
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    const getActivityIcon = (type) => {
      const icons = {
        link_created: () => h('svg', {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
          class: 'w-4 h-4'
        }, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M12 4v16m8-8H4'
          })
        ]),
        click_recorded: () => h('svg', {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
          class: 'w-4 h-4'
        }, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M15 15l-2 5L9 9l11 4-5 2z'
          })
        ]),
        folder_created: () => h('svg', {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24',
          class: 'w-4 h-4'
        }, [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
          })
        ])
      }
      return icons[type] || icons.link_created
    }
    
    const getActivityIconClasses = (type) => {
      const classes = {
        link_created: 'w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center',
        click_recorded: 'w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center',
        folder_created: 'w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center'
      }
      return classes[type] || classes.link_created
    }
    
    // Carregar dados iniciais
    onMounted(async () => {
      await Promise.all([
        loadMetrics(),
        loadCharts(),
        loadActivity()
      ])
    })
    
    return {
      loading,
      loadingCharts,
      loadingActivity,
      metrics,
      dailyClicksData,
      hourlyClicksData,
      recentActivity,
      lastUpdate,
      refresh,
      activeLinksPercentage,
      linkTrend,
      clickTrend,
      folderTrend,
      chartOptions,
      formatTimestamp,
      getActivityIcon,
      getActivityIconClasses
    }
  }
}
</script>
