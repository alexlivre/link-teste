// test-automation/scripts/test-dashboard.js
// Teste do dashboard Vue.js seguindo Clean Code (< 80 linhas)

/**
 * Teste do dashboard Vue.js
 * Single Responsibility: Apenas testar endpoints do dashboard
 */
class DashboardTest {
  constructor() {
    this.testResults = []
    this.apiBase = 'http://localhost:3001/api/analytics'
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('🧪 Iniciando testes do dashboard...')
    
    try {
      await this.testDashboardEndpoint()
      await this.testStatsEndpoint()
      await this.testCacheEndpoint()
      await this.testLinkAnalyticsEndpoint()
      await this.testLinkQuotaEndpoint()
      
      this.printResults()
    } catch (error) {
      console.error('❌ Erro nos testes:', error.message)
      process.exit(1)
    }
  }

  /**
   * Testa endpoint principal do dashboard
   */
  async testDashboardEndpoint() {
    try {
      const response = await fetch(`${this.apiBase}/dashboard`)
      const data = await response.json()
      
      const hasGeneral = data.data && data.data.general
      const hasCache = data.data && data.data.cache
      const isSuccess = response.ok && data.success
      
      this.addResult(
        'Dashboard Endpoint',
        `Status: ${response.status}, General: ${!!hasGeneral}, Cache: ${!!hasCache}`,
        isSuccess && hasGeneral && hasCache
      )
    } catch (error) {
      this.addResult('Dashboard Endpoint', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa endpoint de estatísticas
   */
  async testStatsEndpoint() {
    try {
      const response = await fetch(`${this.apiBase}/stats`)
      const data = await response.json()
      
      const hasClicks = data.data && typeof data.data.total_clicks === 'number'
      const isSuccess = response.ok && data.success
      
      this.addResult(
        'Stats Endpoint',
        `Total clicks: ${data.data?.total_clicks || 0}`,
        isSuccess && hasClicks
      )
    } catch (error) {
      this.addResult('Stats Endpoint', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa endpoint de cache
   */
  async testCacheEndpoint() {
    try {
      const response = await fetch(`${this.apiBase}/cache`)
      const data = await response.json()
      
      const hasCacheSize = data.data && typeof data.data.links_cache_size === 'number'
      const isSuccess = response.ok && data.success
      
      this.addResult(
        'Cache Endpoint',
        `Cache size: ${data.data?.links_cache_size || 0}`,
        isSuccess && hasCacheSize
      )
    } catch (error) {
      this.addResult('Cache Endpoint', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa endpoint de analytics de link
   */
  async testLinkAnalyticsEndpoint() {
    try {
      const response = await fetch(`${this.apiBase}/links/test-dashboard`)
      const data = await response.json()
      
      const isArray = Array.isArray(data.data)
      const isSuccess = response.ok && data.success
      
      this.addResult(
        'Link Analytics Endpoint',
        `Events: ${data.data?.length || 0}`,
        isSuccess && isArray
      )
    } catch (error) {
      this.addResult('Link Analytics Endpoint', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa endpoint de cotas de link
   */
  async testLinkQuotaEndpoint() {
    try {
      const response = await fetch(`${this.apiBase}/links/test-dashboard/quota`)
      const data = await response.json()
      
      const hasDaily = data.data && typeof data.data.daily === 'object'
      const isSuccess = response.ok && data.success
      
      this.addResult(
        'Link Quota Endpoint',
        `Daily quota: ${data.data?.daily?.current || 0}/${data.data?.daily?.limit || 0}`,
        isSuccess && hasDaily
      )
    } catch (error) {
      this.addResult('Link Quota Endpoint', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Adiciona resultado ao array
   */
  addResult(test, message, passed) {
    this.testResults.push({ test, message, passed })
  }

  /**
   * Imprime resultados
   */
  printResults() {
    console.log('\n📊 Resultados dos Testes:')
    console.log('='.repeat(50))
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      console.log(`${status} ${result.test}: ${result.message}`)
    })

    const passed = this.testResults.filter(r => r.passed).length
    const total = this.testResults.length
    
    console.log('\n' + '='.repeat(50))
    console.log(`📈 Total: ${passed}/${total} testes passaram`)
    
    if (passed === total) {
      console.log('🎉 Todos os testes passaram!')
      console.log('🌐 Dashboard disponível em: http://localhost:3000/analytics')
      process.exit(0)
    } else {
      console.log('❌ Alguns testes falharam')
      process.exit(1)
    }
  }
}

// Executar testes
const test = new DashboardTest()
test.runAllTests()
