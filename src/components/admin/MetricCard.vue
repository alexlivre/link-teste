<!-- src/components/admin/MetricCard.vue -->
<!-- Card de métrica reutilizável seguindo Clean Code (< 80 linhas) -->

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div :class="iconClasses">
          <component :is="icon" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-600">{{ title }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="trend" class="flex items-center space-x-1">
        <component :is="trendIcon" :class="trendIconClasses" class="w-4 h-4" />
        <span :class="trendTextClasses" class="text-sm font-medium">
          {{ trend }}
        </span>
      </div>
    </div>
    
    <!-- Value -->
    <div class="flex items-baseline space-x-2">
      <span class="text-2xl font-bold text-gray-900">
        {{ formattedValue }}
      </span>
      <span v-if="unit" class="text-sm text-gray-500">{{ unit }}</span>
    </div>
    
    <!-- Progress Bar (opcional) -->
    <div v-if="showProgress" class="mt-4">
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>{{ progressLabel }}</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          :class="progressBarClasses" 
          class="h-2 rounded-full transition-all duration-500"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
    
    <!-- Footer (opcional) -->
    <div v-if="footer" class="mt-4 pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-500">{{ footer }}</p>
    </div>
  </div>
</template>

<script>
import { computed, h } from 'vue'

// Ícones SVG como componentes funcionais para renderização correta
const LinkIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-6 h-6'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
  })
])

const ClickIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-6 h-6'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M15 15l-2 5L9 9l11 4-5 2z'
  })
])

const FolderIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-6 h-6'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
  })
])

const TrendUpIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-4 h-4'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  })
])

const TrendDownIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'w-4 h-4'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
  })
])

export default {
  name: 'MetricCard',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    value: { type: [Number, String], required: true },
    unit: { type: String, default: '' },
    icon: { type: String, required: true },
    iconColor: { type: String, default: 'blue' },
    trend: { type: String, default: '' },
    trendDirection: { type: String, default: 'up', validator: (value) => ['up', 'down'].includes(value) },
    showProgress: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    progressLabel: { type: String, default: '' },
    footer: { type: String, default: '' }
  },
  setup(props) {
    // Mapeamento de ícones
    const iconMap = {
      link: LinkIcon,
      click: ClickIcon,
      folder: FolderIcon
    }
    
    // Classes computadas para o ícone principal
    const iconClasses = computed(() => {
      const colorMap = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600'
      }
      return `w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[props.iconColor] || colorMap.blue}`
    })
    
    // Formatar valor com separadores de milhar
    const formattedValue = computed(() => {
      if (typeof props.value === 'string') return props.value
      return new Intl.NumberFormat('pt-BR').format(props.value)
    })
    
    // Classes para trend
    const trendIcon = computed(() => props.trendDirection === 'up' ? TrendUpIcon : TrendDownIcon)
    const trendIconClasses = computed(() => props.trendDirection === 'up' ? 'text-green-500' : 'text-red-500')
    const trendTextClasses = computed(() => props.trendDirection === 'up' ? 'text-green-600' : 'text-red-600')
    
    // Classes para progress bar
    const progressBarClasses = computed(() => {
      if (props.progress >= 80) return 'bg-green-500'
      if (props.progress >= 50) return 'bg-yellow-500'
      return 'bg-red-500'
    })
    
    return {
      iconMap,
      iconClasses,
      formattedValue,
      trendIcon,
      trendIconClasses,
      trendTextClasses,
      progressBarClasses
    }
  }
}
</script>
