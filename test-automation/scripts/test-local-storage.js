// test-local-storage.js
// Testes para validação do localStorage e estado persistido

import fs from 'fs';
import path from 'path';

const runLocalStorageTests = () => {
  console.log('🧪 Iniciando testes de localStorage...');
  
  let testsPassed = 0;
  let testsTotal = 0;
  
  // Teste 1: Verificar se composables existem
  testsTotal++;
  try {
    const localStoragePath = 'src/composables/useLocalStorage.js';
    const whatsAppStatePath = 'src/composables/useWhatsAppState.js';
    
    const localStorageExists = fs.existsSync(localStoragePath);
    const whatsAppStateExists = fs.existsSync(whatsAppStatePath);
    
    if (localStorageExists && whatsAppStateExists) {
      console.log('✅ Teste 1 passou: Composables de estado criados');
      testsPassed++;
    } else {
      console.log('❌ Teste 1 falhou: Composables faltando');
    }
  } catch (error) {
    console.log('❌ Teste 1 falhou:', error.message);
  }
  
  // Teste 2: Verificar conteúdo do useLocalStorage
  testsTotal++;
  try {
    const localStorageContent = fs.readFileSync('src/composables/useLocalStorage.js', 'utf8');
    
    const hasRequiredFunctions = [
      'useLocalStorage',
      'getStoredValue',
      'setValue',
      'removeValue'
    ].every(func => localStorageContent.includes(func));
    
    if (hasRequiredFunctions) {
      console.log('✅ Teste 2 passou: useLocalStorage contém funções essenciais');
      testsPassed++;
    } else {
      console.log('❌ Teste 2 falhou: useLocalStorage incompleto');
    }
  } catch (error) {
    console.log('❌ Teste 2 falhou:', error.message);
  }
  
  // Teste 3: Verificar conteúdo do useWhatsAppState
  testsTotal++;
  try {
    const whatsAppStateContent = fs.readFileSync('src/composables/useWhatsAppState.js', 'utf8');
    
    const hasRequiredFunctions = [
      'useWhatsAppState',
      'saveToHistory',
      'clearHistory',
      'loadLastUsed',
      'updateLastUsed'
    ].every(func => whatsAppStateContent.includes(func));
    
    if (hasRequiredFunctions) {
      console.log('✅ Teste 3 passou: useWhatsAppState contém funções essenciais');
      testsPassed++;
    } else {
      console.log('❌ Teste 3 falhou: useWhatsAppState incompleto');
    }
  } catch (error) {
    console.log('❌ Teste 3 falhou:', error.message);
  }
  
  // Teste 4: Verificar se WhatsApp.vue usa os composables
  testsTotal++;
  try {
    const whatsappContent = fs.readFileSync('src/views/WhatsApp.vue', 'utf8');
    
    const importsComposables = whatsappContent.includes('useWhatsAppState');
    
    const usesState = whatsappContent.includes('whatsappState.currentPhone') &&
                     whatsappContent.includes('whatsappState.saveToHistory') &&
                     whatsappContent.includes('whatsappState.updateLastUsed');
    
    if (importsComposables && usesState) {
      console.log('✅ Teste 4 passou: WhatsApp.vue usa composables de estado');
      testsPassed++;
    } else {
      console.log('❌ Teste 4 falhou: WhatsApp.vue não integra estado persistido');
    }
  } catch (error) {
    console.log('❌ Teste 4 falhou:', error.message);
  }
  
  // Teste 5: Verificar se histórico é exibido no template
  testsTotal++;
  try {
    const whatsappContent = fs.readFileSync('src/views/WhatsApp.vue', 'utf8');
    
    const hasHistorySection = whatsappContent.includes('recentLinks.length > 0') &&
                             whatsappContent.includes('Links Gerados Recentemente');
    
    if (hasHistorySection) {
      console.log('✅ Teste 5 passou: Template exibe histórico de links');
      testsPassed++;
    } else {
      console.log('❌ Teste 5 falhou: Template não exibe histórico');
    }
  } catch (error) {
    console.log('❌ Teste 5 falhou:', error.message);
  }
  
  // Resultado final
  console.log(`\n📊 Resultado: ${testsPassed}/${testsTotal} testes passaram`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 Testes de localStorage passaram!');
    return true;
  } else {
    console.log('❌ Alguns testes de localStorage falharam.');
    return false;
  }
};

// Executar testes
runLocalStorageTests();
