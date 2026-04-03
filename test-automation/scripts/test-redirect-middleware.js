// test-automation/scripts/test-redirect-middleware.js
// Teste do middleware de redirecionamento seguindo Clean Code (< 80 linhas)

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.join(__dirname, '..', '..')

/**
 * Teste do middleware de redirecionamento
 */
class RedirectMiddlewareTest {
  constructor() {
    this.testResults = []
    this.linksPath = path.join(PROJECT_ROOT, 'backend/data/links.json')
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('🧪 Iniciando testes do middleware de redirecionamento...')
    
    try {
      await this.setupTestData()
      await this.testRedirectValidSlug()
      await this.testRedirectInvalidSlug()
      await this.testRedirectNotFoundSlug()
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
      slug: 'test-redirect',
      url_destination: 'https://example.com',
      folder_hash: 'test-hash',
      created_at: new Date().toISOString(),
      clicks: 0
    }

    await fs.writeFile(this.linksPath, JSON.stringify([testLink], null, 2))
    this.addResult('Setup', 'Dados de teste criados com sucesso', true)
  }

  /**
   * Testa redirecionamento de slug válido
   */
  async testRedirectValidSlug() {
    try {
      const response = await fetch('http://localhost:3001/test-redirect', {
        redirect: 'manual'
      })

      const isRedirect = response.status >= 300 && response.status < 400
      const hasLocation = response.headers.get('location') === 'https://example.com'

      this.addResult(
        'Redirect Válido',
        `Status: ${response.status}, Location: ${response.headers.get('location')}`,
        isRedirect && hasLocation
      )
    } catch (error) {
      this.addResult('Redirect Válido', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa redirecionamento de slug inválido
   */
  async testRedirectInvalidSlug() {
    try {
      const response = await fetch('http://localhost:3001/invalid@slug', {
        redirect: 'manual'
      })

      const is404 = response.status === 404
      this.addResult('Slug Inválido', `Status: ${response.status}`, is404)
    } catch (error) {
      this.addResult('Slug Inválido', `Erro: ${error.message}`, false)
    }
  }

  /**
   * Testa redirecionamento de slug não encontrado
   */
  async testRedirectNotFoundSlug() {
    try {
      const response = await fetch('http://localhost:3001/not-found', {
        redirect: 'manual'
      })

      const is404 = response.status === 404
      this.addResult('Slug Não Encontrado', `Status: ${response.status}`, is404)
    } catch (error) {
      this.addResult('Slug Não Encontrado', `Erro: ${error.message}`, false)
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
    console.log('=' * 50)
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      console.log(`${status} ${result.test}: ${result.message}`)
    })

    const passed = this.testResults.filter(r => r.passed).length
    const total = this.testResults.length
    
    console.log('\n' + '=' * 50)
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
const test = new RedirectMiddlewareTest()
test.runAllTests()
