<!-- src/components/admin/AnalyticsChart.vue -->
<!-- Componente de gráficos reutilizável com Chart.js (< 100 linhas) -->

<template>
  <div class="relative" :style="{ height: height }">
    <canvas ref="chartCanvas"/>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default {
  name: 'AnalyticsChart',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['bar', 'line', 'doughnut', 'pie'].includes(value)
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null
    
    // Opções padrão para todos os gráficos
    const getDefaultOptions = () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('pt-BR').format(context.parsed.y)
              }
              return label
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11
            },
            color: '#6b7280'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(229, 231, 235, 0.5)',
            drawBorder: false,
            borderDash: [2, 2]
          },
          ticks: {
            font: {
              size: 11
            },
            color: '#6b7280',
            callback: function(value) {
              return new Intl.NumberFormat('pt-BR', {
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value)
            }
          }
        }
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuart'
      }
    })
    
    // Opções específicas por tipo
    const getTypeSpecificOptions = () => {
      switch (props.type) {
      case 'bar':
        return {
          plugins: {
            ...getDefaultOptions().plugins,
            legend: {
              display: false
            }
          },
          scales: {
            ...getDefaultOptions().scales,
            y: {
              ...getDefaultOptions().scales.y,
              grid: {
                ...getDefaultOptions().scales.y.grid,
                borderDash: [2, 2]
              }
            }
          }
        }
        
      case 'line':
        return {
          ...getDefaultOptions(),
          elements: {
            line: {
              tension: 0.4,
              borderWidth: 3
            },
            point: {
              radius: 4,
              hoverRadius: 6,
              borderWidth: 2,
              backgroundColor: '#fff'
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
        
      case 'doughnut':
      case 'pie':
        return {
          ...getDefaultOptions(),
          scales: undefined,
          plugins: {
            ...getDefaultOptions().plugins,
            legend: {
              ...getDefaultOptions().plugins.legend,
              position: 'bottom'
            }
          }
        }
        
      default:
        return getDefaultOptions()
      }
    }
    
    // Criar ou atualizar gráfico
    const createChart = () => {
      if (!chartCanvas.value) return
      
      // Destruir gráfico existente
      if (chartInstance) {
        chartInstance.destroy()
      }
      
      // Mesclar opções padrão com opções personalizadas
      const mergedOptions = {
        ...getTypeSpecificOptions(),
        ...props.options
      }
      
      // Criar nova instância do gráfico
      chartInstance = new ChartJS(chartCanvas.value, {
        type: props.type,
        data: props.data,
        options: mergedOptions
      })
    }
    
    // Watch para mudanças nos dados
    watch(
      () => props.data,
      () => {
        if (chartInstance) {
          chartInstance.data = props.data
          chartInstance.update('active')
        }
      },
      { deep: true }
    )
    
    watch(
      () => props.options,
      () => {
        if (chartInstance) {
          chartInstance.options = {
            ...getTypeSpecificOptions(),
            ...props.options
          }
          chartInstance.update('active')
        }
      },
      { deep: true }
    )
    
    // Lifecycle
    onMounted(async () => {
      await nextTick()
      createChart()
    })
    
    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })
    
    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para gráficos */
canvas {
  max-height: 100%;
}
</style>
