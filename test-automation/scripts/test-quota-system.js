// test-automation/scripts/test-quota-system.js
// Teste do sistema de cotas seguindo Clean Code (< 100 linhas)

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { quotaService } from '../../backend/services/QuotaService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.join(__dirname, '..', '..')

/**
 * Teste do sistema de cotas
 */
class QuotaSystemTest {
  constructor() {
    this.testResults = []
    this.linksPath = path.join(PROJECT_ROOT, 'backend/data/links.json')
    this.quotaService = quotaService
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('🧪 Iniciando testes do sistema de cotas...')
    
    try {
      await this.setupTestData()
      await this.testQuotaCheck()
      await this.testQuotaIncrement()
      await this.testQuotaExceeded()
      await this.testBotDetection()
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
      slug: 'test-quota',
      url_destination: 'https://example.com',
      folder_hash: 'test-hash',
      created_at: new Date().toISOString(),
      daily: 0,
      weekly: 0,
      monthly: 0,
      total_clicks: 0,
      last_reset_day: new Date().toISOString(),
      last_reset_week: new Date().toISOString(),
      last_reset_month: new Date().toISOString(),
      last_access: new Date().toISOString()
    }

    await fs.writeFile(this.linksPath, JSON.stringify([testLink], null, 2))
    this.addResult('Setup', 'Dados de teste criados com sucesso', true)
  }

  /**
   * Testa verificação de cotas
   */
  async testQuotaCheck() {
    try {
      const quota = await this.quotaService.checkQuota('test-quota')
      const hasQuotas = quota && typeof quota.daily === 'number'
      
      this.addResult(
        'Verificação de Cotas',
        `Cotas: daily=${quota?.daily}, weekly=${quota?.weekly}, monthly=${quota?.monthly}`,
        hasQuotas
      )
    } catch (error) {
      this.addResult('Verificação de Cotas', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa incremento de contadores
   */
  async testQuotaIncrement() {
    try {
      await this.quotaService.incrementCounters('test-quota', false)
      const status = await this.quotaService.getQuotaStatus('test-quota')
      
      const incremented = status.daily.current === 1
      this.addResult(
        'Incremento de Contadores',
        `Daily: ${status.daily.current}, Weekly: ${status.weekly.current}`,
        incremented
      )
    } catch (error) {
      this.addResult('Incremento de Contadores', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa limite excedido
   */
  async testQuotaExceeded() {
    try {
      // Simula link com cota diária esgotada
      const testLink = {
        id: 2,
        slug: 'test-exceeded',
        url_destination: 'https://example.com',
        folder_hash: 'test-hash',
        created_at: new Date().toISOString(),
        daily: 1000, // Limite excedido
        weekly: 100,
        monthly: 100,
        total_clicks: 1000,
        last_reset_day: new Date().toISOString(),
        last_reset_week: new Date().toISOString(),
        last_reset_month: new Date().toISOString(),
        last_access: new Date().toISOString()
      }

      const links = JSON.parse(await fs.readFile(this.linksPath, 'utf8'))
      links.push(testLink)
      await fs.writeFile(this.linksPath, JSON.stringify(links, null, 2))

      // Tenta verificar cota (deve lançar erro)
      try {
        await this.quotaService.checkQuota('test-exceeded')
        this.addResult('Cota Excedida', 'Erro: deveria lançar exceção', false)
      } catch (error) {
        const isQuotaError = error.name === 'QuotaExceededError'
        this.addResult('Cota Excedida', `Erro correto: ${error.message}`, isQuotaError)
      }
    } catch (error) {
      this.addResult('Cota Excedida', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa detecção de bots
   */
  async testBotDetection() {
    try {
      // Incrementa contador para bot (não deve incrementar)
      await this.quotaService.incrementCounters('test-quota', true)
      const status = await this.quotaService.getQuotaStatus('test-quota')
      
      const notIncremented = status.daily.current === 1 // Continua 1
      this.addResult(
        'Detecção de Bots',
        `Bot não incrementou: daily=${status.daily.current}`,
        notIncremented
      )
    } catch (error) {
      this.addResult('Detecção de Bots', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Limpa dados de teste
   */
  async cleanup() {
    try {
      await fs.writeFile(this.linksPath, '[]')
      this.addResult('Cleanup', 'Dados de teste limpos com sucesso', true)
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
const test = new QuotaSystemTest()
test.runAllTests()
