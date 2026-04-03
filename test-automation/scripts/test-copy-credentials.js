// test-automation/scripts/test-copy-credentials.js
// Teste para funcionalidade de cópia de credenciais do painel admin

// Test suite para cópia de credenciais
const testCopyCredentials = async () => {
  console.log('🧪 Iniciando testes de cópia de credenciais...')
  
  const tests = [
    {
      name: 'Página de login admin carrega corretamente',
      test: async () => {
        const response = await fetch('http://localhost:3000/admin/login')
        return response.ok && response.headers.get('content-type')?.includes('text/html')
      }
    },
    {
      name: 'Arquivo AdminLogin.vue existe e contém cópia',
      test: async () => {
        const fs = await import('fs')
        const path = await import('path')
        const filePath = path.join(process.cwd(), 'src/views/admin/AdminLogin.vue')
        const content = fs.readFileSync(filePath, 'utf8')
        return content.includes('copyToClipboard') && 
               content.includes('Copiar Credenciais')
      }
    },
    {
      name: 'Função copyToClipboard implementada',
      test: async () => {
        const fs = await import('fs')
        const path = await import('path')
        const filePath = path.join(process.cwd(), 'src/views/admin/AdminLogin.vue')
        const content = fs.readFileSync(filePath, 'utf8')
        return content.includes('const copyToClipboard') &&
               content.includes('navigator.clipboard.writeText')
      }
    },
    {
      name: 'Feedback visual de cópia implementado',
      test: async () => {
        const fs = await import('fs')
        const path = await import('path')
        const filePath = path.join(process.cwd(), 'src/views/admin/AdminLogin.vue')
        const content = fs.readFileSync(filePath, 'utf8')
        return content.includes('copyFeedback') &&
               content.includes('Copiado!')
      }
    },
    {
      name: 'Botões individuais de cópia presentes',
      test: async () => {
        const fs = await import('fs')
        const path = await import('path')
        const filePath = path.join(process.cwd(), 'src/views/admin/AdminLogin.vue')
        const content = fs.readFileSync(filePath, 'utf8')
        return content.includes('Copiar usuário') &&
               content.includes('Copiar senha')
      }
    }
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    try {
      console.log(`  ⏳ ${test.name}...`)
      const result = await test.test()
      if (result) {
        console.log(`  ✅ ${test.name}`)
        passed++
      } else {
        console.log(`  ❌ ${test.name}`)
        failed++
      }
    } catch (error) {
      console.log(`  ❌ ${test.name} - Erro: ${error.message}`)
      failed++
    }
  }
  
  console.log(`\n📊 Resultados dos Testes de Cópia:`)
  console.log(`  ✅ Passou: ${passed}`)
  console.log(`  ❌ Falhou: ${failed}`)
  console.log(`  📈 Taxa de sucesso: ${Math.round((passed / (passed + failed)) * 100)}%`)
  
  return { passed, failed, total: passed + failed }
}

// Função principal de execução
const runTests = async () => {
  try {
    const results = await testCopyCredentials()
    
    if (results.failed === 0) {
      console.log('\n🎉 Todos os testes de cópia passaram!')
      process.exit(0)
    } else {
      console.log('\n⚠️ Alguns testes falharam. Verifique os erros acima.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message)
    process.exit(1)
  }
}

// Executar testes
runTests()
