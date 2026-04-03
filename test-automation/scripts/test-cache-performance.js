// test-automation/scripts/test-cache-performance.js
// Teste do serviço de cache seguindo Clean Code (< 100 linhas)

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { cacheService } from '../../backend/services/CacheService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.join(__dirname, '..', '..')

/**
 * Teste do serviço de cache
 */
class CachePerformanceTest {
  constructor() {
    this.testResults = []
    this.linksPath = path.join(PROJECT_ROOT, 'backend/data/links.json')
    this.cacheService = cacheService
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('🧪 Iniciando testes do serviço de cache...')
    
    try {
      await this.setupTestData()
      await this.testCacheHit()
      await this.testCacheMiss()
      await this.testCacheInvalidation()
      await this.testCacheStats()
      await this.testPerformance()
      await this.cleanup()
      
      this.printResults()
    } catch (error) {
      console.error('❌ Erro nos testes:', error.message)
      process.exit(1)
    }
  }

  /**
   * Configura dados de teste
   */
  async setupTestData() {
    const testLink = {
      id: 1,
      slug: 'test-cache',
      url_destination: 'https://example.com',
      folder_hash: 'test-hash',
      created_at: new Date().toISOString(),
      daily: 0,
      weekly: 0,
      monthly: 0
    }

    await fs.writeFile(this.linksPath, JSON.stringify([testLink], null, 2))
    this.addResult('Setup', 'Dados de teste criados com sucesso', true)
  }

  /**
   * Testa cache hit
   */
  async testCacheHit() {
    try {
      // Primeira acesso (cache miss)
      const start1 = performance.now()
      const link1 = await this.cacheService.getLink('test-cache')
      const time1 = performance.now() - start1

      // Segundo acesso (cache hit)
      const start2 = performance.now()
      const link2 = await this.cacheService.getLink('test-cache')
      const time2 = performance.now() - start2

      const cacheHitFaster = time2 < time1
      const sameLink = link1.slug === link2.slug

      this.addResult(
        'Cache Hit',
        `Primeiro: ${time1.toFixed(2)}ms, Segundo: ${time2.toFixed(2)}ms`,
        cacheHitFaster && sameLink
      )
    } catch (error) {
      this.addResult('Cache Hit', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa cache miss
   */
  async testCacheMiss() {
    try {
      const link = await this.cacheService.getLink('non-existent')
      
      const isNull = link === null
      this.addResult(
        'Cache Miss',
        `Link não encontrado: ${link === null}`,
        isNull
      )
    } catch (error) {
      this.addResult('Cache Miss', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa invalidação de cache
   */
  async testCacheInvalidation() {
    try {
      // Carrega no cache
      await this.cacheService.getLink('test-cache')
      
      // Invalida
      this.cacheService.invalidateLink('test-cache')
      
      // Tenta obter novamente (deve buscar do storage)
      const link = await this.cacheService.getLink('test-cache')
      
      const stillWorks = link && link.slug === 'test-cache'
      this.addResult(
        'Cache Invalidation',
        `Link após invalidação: ${link?.slug}`,
        stillWorks
      )
    } catch (error) {
      this.addResult('Cache Invalidation', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa estatísticas do cache
   */
  async testCacheStats() {
    try {
      // Garante que há algo no cache
      await this.cacheService.getLink('test-cache')
      
      const stats = this.cacheService.getStats()
      
      const hasStats = stats.links_cache_size >= 0 && 
                      stats.total_cache_size >= 0 &&
                      stats.max_size > 0
      
      this.addResult(
        'Cache Stats',
        `Links: ${stats.links_cache_size}, Total: ${stats.total_cache_size}`,
        hasStats
      )
    } catch (error) {
      this.addResult('Cache Stats', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa performance com múltiplos acessos
   */
  async testPerformance() {
    try {
      const iterations = 50
      const times = []
      
      for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        await this.cacheService.getLink('test-cache')
        times.push(performance.now() - start)
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length
      const maxTime = Math.max(...times)
      const under50ms = avgTime < 50
      
      this.addResult(
        'Performance',
        `Média: ${avgTime.toFixed(2)}ms, Máximo: ${maxTime.toFixed(2)}ms (${iterations}x)`,
        under50ms
      )
    } catch (error) {
      this.addResult('Performance', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Limpa dados de teste
   */
  async cleanup() {
    try {
      await fs.writeFile(this.linksPath, '[]')
      this.cacheService.clearCache()
      this.addResult('Cleanup', 'Cache e dados limpos com sucesso', true)
    } catch (error) {
      this.addResult('Cleanup', `Erro: ${error.message}`, false)
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
      process.exit(0)
    } else {
      console.log('❌ Alguns testes falharam')
      process.exit(1)
    }
  }
}

// Executar testes
const test = new CachePerformanceTest()
test.runAllTests()
