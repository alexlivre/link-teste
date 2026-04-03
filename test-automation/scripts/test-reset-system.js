// test-automation/scripts/test-reset-system.js
// Teste do sistema de reset automático seguindo Clean Code (< 80 linhas)

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { resetService } from '../../backend/services/ResetService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.join(__dirname, '..', '..')

/**
 * Teste do sistema de reset
 */
class ResetSystemTest {
  constructor() {
    this.testResults = []
    this.linksPath = path.join(PROJECT_ROOT, 'backend/data/links.json')
    this.resetService = resetService
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('🧪 Iniciando testes do sistema de reset...')
    
    try {
      await this.setupTestData()
      await this.testResetCheck()
      await this.testForceReset()
      await this.testResetServiceStatus()
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
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 35) // 35 dias atrás (para reset mensal)

    const testLink = {
      id: 1,
      slug: 'test-reset',
      url_destination: 'https://example.com',
      folder_hash: 'test-hash',
      created_at: oldDate.toISOString(),
      daily: 100,
      weekly: 500,
      monthly: 1500,
      last_reset_day: oldDate.toISOString(),
      last_reset_week: oldDate.toISOString(),
      last_reset_month: oldDate.toISOString()
    }

    await fs.writeFile(this.linksPath, JSON.stringify([testLink], null, 2))
    this.addResult('Setup', 'Dados de teste criados com contadores antigos', true)
  }

  /**
   * Testa verificação de reset
   */
  async testResetCheck() {
    try {
      const links = JSON.parse(await fs.readFile(this.linksPath, 'utf8'))
      const link = links[0]
      
      const needsReset = this.resetService.checkIfNeedsReset(link)
      
      const shouldResetDaily = needsReset.daily
      const shouldResetWeekly = needsReset.weekly
      const shouldResetMonthly = needsReset.monthly
      
      this.addResult(
        'Verificação de Reset',
        `Daily: ${shouldResetDaily}, Weekly: ${shouldResetWeekly}, Monthly: ${shouldResetMonthly}`,
        shouldResetDaily && shouldResetWeekly && shouldResetMonthly
      )
    } catch (error) {
      this.addResult('Verificação de Reset', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa reset forçado
   */
  async testForceReset() {
    try {
      await this.resetService.forceResetLink(1)
      
      const links = JSON.parse(await fs.readFile(this.linksPath, 'utf8'))
      const link = links[0]
      
      const allZero = link.daily === 0 && link.weekly === 0 && link.monthly === 0
      const hasNewTimestamps = link.last_reset_day && link.last_reset_week && link.last_reset_month
      
      this.addResult(
        'Reset Forçado',
        `Daily: ${link.daily}, Weekly: ${link.weekly}, Monthly: ${link.monthly}`,
        allZero && hasNewTimestamps
      )
    } catch (error) {
      this.addResult('Reset Forçado', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa status do serviço
   */
  async testResetServiceStatus() {
    try {
      const status = this.resetService.getStatus()
      
      const hasStatus = status && typeof status.running === 'boolean'
      const hasInterval = status && typeof status.checkInterval === 'number'
      
      this.addResult(
        'Status do Serviço',
        `Running: ${status?.running}, Interval: ${status?.checkInterval}ms`,
        hasStatus && hasInterval
      )
    } catch (error) {
      this.addResult('Status do Serviço', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Limpa dados de teste
   */
  async cleanup() {
    try {
      await fs.writeFile(this.linksPath, '[]')
      this.resetService.stop()
      this.addResult('Cleanup', 'Dados limpos e serviço parado', true)
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
const test = new ResetSystemTest()
test.runAllTests()
