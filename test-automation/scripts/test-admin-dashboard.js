// test-automation/scripts/test-admin-dashboard.js
// Testes automatizados para painel administrativo seguindo Clean Code

// Test suite para painel admin
const testAdminDashboard = async () => {
  console.log('🧪 Iniciando testes do Painel Admin...')
  
  const tests = [
    {
      name: 'Acesso à página de login admin',
      test: async () => {
        const response = await fetch('http://localhost:3000/admin/login')
        return response.ok
      }
    },
    {
      name: 'Redirecionamento de rota protegida',
      test: async () => {
        const response = await fetch('http://localhost:3000/admin', {
          redirect: 'manual'
        })
        // Deve redirecionar para login
        return response.status === 302 || response.status === 307
      }
    },
    {
      name: 'API de métricas admin disponível',
      test: async () => {
        try {
          const response = await fetch('http://localhost:3001/api/admin/metrics')
          return response.status === 401 || response.ok // 401 = não autenticado (esperado)
        } catch {
          return false // API não implementada ainda
        }
      }
    },
    {
      name: 'Health check do backend',
      test: async () => {
        const response = await fetch('http://localhost:3001/health')
        const data = await response.json()
        return response.ok && data.status === 'ok'
      }
    },
    {
      name: 'Carregamento da página inicial',
      test: async () => {
        const response = await fetch('http://localhost:3000/')
        return response.ok
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
  
  console.log(`\n📊 Resultados dos Testes Admin:`)
  console.log(`  ✅ Passou: ${passed}`)
  console.log(`  ❌ Falhou: ${failed}`)
  console.log(`  📈 Taxa de sucesso: ${Math.round((passed / (passed + failed)) * 100)}%`)
  
  return { passed, failed, total: passed + failed }
}

// Função principal de execução
const runTests = async () => {
  try {
    const results = await testAdminDashboard()
    
    if (results.failed === 0) {
      console.log('\n🎉 Todos os testes do painel admin passaram!')
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
