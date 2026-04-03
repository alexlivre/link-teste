// test-automation/scripts/test-analytics.js
// Teste do serviço de analytics seguindo Clean Code (< 100 linhas)

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { analyticsService } from '../../backend/services/AnalyticsService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.join(__dirname, '..', '..')

/**
 * Teste do serviço de analytics
 */
class AnalyticsTest {
  constructor() {
    this.testResults = []
    this.analyticsPath = path.join(PROJECT_ROOT, 'backend/data/analytics.json')
    this.analyticsService = analyticsService
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('🧪 Iniciando testes do serviço de analytics...')
    
    try {
      await this.setupTestData()
      await this.testRegisterClick()
      await this.testGetLinkAnalytics()
      await this.testGeneralStats()
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
    await fs.writeFile(this.analyticsPath, '[]')
    this.addResult('Setup', 'Analytics limpo para teste', true)
  }

  /**
   * Testa registro de clique
   */
  async testRegisterClick() {
    try {
      const mockLink = {
        id: 1,
        slug: 'test-analytics',
        url_destination: 'https://example.com'
      }

      const mockReq = {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'referer': 'https://google.com'
        },
        ip: '192.168.1.100'
      }

      const event = await this.analyticsService.registerClick(mockLink, mockReq, false)
      
      const hasRequiredFields = event.id && event.slug && event.timestamp && event.referer
      this.addResult(
        'Registro de Clique',
        `Evento ID: ${event.id}, Slug: ${event.slug}, Referer: ${event.referer}`,
        hasRequiredFields
      )
    } catch (error) {
      this.addResult('Registro de Clique', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa obtenção de analytics por link
   */
  async testGetLinkAnalytics() {
    try {
      const analytics = await this.analyticsService.getLinkAnalytics('test-analytics')
      
      const hasEvents = analytics.length > 0
      const correctSlug = analytics.every(e => e.slug === 'test-analytics')
      
      this.addResult(
        'Analytics por Link',
        `Eventos: ${analytics.length}, Slug correto: ${correctSlug}`,
        hasEvents && correctSlug
      )
    } catch (error) {
      this.addResult('Analytics por Link', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa estatísticas gerais
   */
  async testGeneralStats() {
    try {
      const stats = await this.analyticsService.getGeneralStats()
      
      const hasStats = stats.total_clicks >= 0 && 
                      stats.human_clicks >= 0 && 
                      stats.bot_clicks >= 0 &&
                      stats.unique_links >= 0
      
      this.addResult(
        'Estatísticas Gerais',
        `Total: ${stats.total_clicks}, Human: ${stats.human_clicks}, Bot: ${stats.bot_clicks}`,
        hasStats
      )
    } catch (error) {
      this.addResult('Estatísticas Gerais', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa detecção de bots
   */
  async testBotDetection() {
    try {
      const mockLink = {
        id: 2,
        slug: 'test-bot',
        url_destination: 'https://example.com'
      }

      const mockBotReq = {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'referer': 'https://google.com'
        },
        ip: '192.168.1.100'
      }

      const event = await this.analyticsService.registerClick(mockLink, mockBotReq, true)
      
      const isBotDetected = event.is_bot === true && event.bot_info && event.bot_info.isBot
      this.addResult(
        'Detecção de Bots',
        `Bot detectado: ${event.is_bot}, Info: ${event.bot_info?.botType}`,
        isBotDetected
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
      await fs.writeFile(this.analyticsPath, '[]')
      this.addResult('Cleanup', 'Analytics limpo com sucesso', true)
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
const test = new AnalyticsTest()
test.runAllTests()
