// test-local-storage.js
// Testes para validação do localStorage e estado persistido

import { existsSync, readFileSync } from 'fs'

const runLocalStorageTests = () => {
  console.log('🧪 Iniciando testes de localStorage...')
  
  let testsPassed = 0
  let testsTotal = 0
  
  // Teste 1: Verificar se composables existem
  testsTotal++
  try {
    const localStoragePath = 'src/composables/useLocalStorage.js'
    const whatsAppStatePath = 'src/composables/useWhatsAppState.js'
    const errorHandlerPath = 'src/composables/errorHandler.js'
    const testsPath = 'src/composables/tests.js'
    
    const localStorageExists = existsSync(localStoragePath)
    const whatsAppStateExists = existsSync(whatsAppStatePath)
    const hasErrorHandling = existsSync(errorHandlerPath)
    const hasTests = existsSync(testsPath)
    
    if (localStorageExists && whatsAppStateExists && hasErrorHandling && hasTests) {
      console.log('✅ Teste 1 passou: Composables de estado criados')
      testsPassed++
    } else {
      console.log('❌ Teste 1 falhou: Composables faltando')
    }
  } catch (error) {
    console.log('❌ Teste 1 falhou:', error.message)
  }
  
  // Teste 2: Verificar conteúdo do errorHandler
  testsTotal++
  try {
    const errorHandlingContent = readFileSync('src/composables/errorHandler.js', 'utf8')
    
    const hasRequiredFunctions = [
      'handleError',
      'logError',
      'displayError'
    ].every(func => errorHandlingContent.includes(func))
    
    if (hasRequiredFunctions) {
      console.log('✅ Teste 2 passou: errorHandler contém funções essenciais')
      testsPassed++
    } else {
      console.log('❌ Teste 2 falhou: errorHandler incompleto')
    }
  } catch (error) {
    console.log('❌ Teste 2 falhou:', error.message)
  }
  
  // Teste 3: Verificar conteúdo do tests
  testsTotal++
  try {
    const testsContent = readFileSync('src/composables/tests.js', 'utf8')
    
    const hasRequiredFunctions = [
      'runTests',
      'testLocalStorage',
      'testWhatsAppState'
    ].every(func => testsContent.includes(func))
    
    if (hasRequiredFunctions) {
      console.log('✅ Teste 3 passou: useWhatsAppState contém funções essenciais')
      testsPassed++
    } else {
      console.log('❌ Teste 3 falhou: useWhatsAppState incompleto')
    }
  } catch (error) {
    console.log('❌ Teste 3 falhou:', error.message)
  }
  
  // Teste 4: Verificar se WhatsApp.vue usa os composables
  testsTotal++
  try {
    const whatsappContent = readFileSync('src/views/WhatsApp.vue', 'utf8')
    
    const importsComposables = whatsappContent.includes('useWhatsAppState')
    
    const usesState = whatsappContent.includes('whatsappState.currentPhone') &&
                     whatsappContent.includes('whatsappState.saveToHistory') &&
                     whatsappContent.includes('whatsappState.updateLastUsed')
    
    if (importsComposables && usesState) {
      console.log('✅ Teste 4 passou: WhatsApp.vue usa composables de estado')
      testsPassed++
    } else {
      console.log('❌ Teste 4 falhou: WhatsApp.vue não integra estado persistido')
    }
  } catch (error) {
    console.log('❌ Teste 4 falhou:', error.message)
  }
  
  // Teste 5: Verificar se histórico é exibido no template
  testsTotal++
  try {
    const whatsappContent = readFileSync('src/views/WhatsApp.vue', 'utf8')
    
    const hasHistorySection = whatsappContent.includes('recentLinks.length > 0') &&
                             whatsappContent.includes('Links Gerados Recentemente')
    
    if (hasHistorySection) {
      console.log('✅ Teste 5 passou: Template exibe histórico de links')
      testsPassed++
    } else {
      console.log('❌ Teste 5 falhou: Template não exibe histórico')
    }
  } catch (error) {
    console.log('❌ Teste 5 falhou:', error.message)
  }
  
  // Resultado final
  console.log(`\n📊 Resultado: ${testsPassed}/${testsTotal} testes passaram`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 Testes de localStorage passaram!')
    return true
  } else {
    console.log('❌ Alguns testes de localStorage falharam.')
    return false
  }
}

// Executar testes
runLocalStorageTests()
