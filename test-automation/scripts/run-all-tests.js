// run-all-tests.js
// Script principal para executar todos os testes do projeto

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando suite completa de testes do INKPAGE...\n');

let totalTests = 0;
let totalPassed = 0;
let allResults = [];

// Função para executar um teste e capturar resultado
const runTest = (testName, testCommand) => {
  console.log(`🧪 Executando: ${testName}`);
  totalTests++;
  
  try {
    const output = execSync(testCommand, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    console.log('✅ Teste passou!\n');
    totalPassed++;
    allResults.push({ name: testName, status: 'PASSOU', output });
    return true;
  } catch (error) {
    console.log('❌ Teste falhou!\n');
    allResults.push({ name: testName, status: 'FALHOU', error: error.message });
    return false;
  }
};

// Executar todos os testes
console.log('=== Testes Unitários ===');
runTest('WhatsApp Generator Functions', 'node test-automation/scripts/test-whatsapp-generator.js');

console.log('=== Testes de Setup ===');
runTest('Setup do Projeto Vue.js', 'node test-automation/scripts/test-setup.js');

console.log('=== Testes de Estado Persistido ===');
runTest('LocalStorage e Estado', 'node test-automation/scripts/test-local-storage.js');

console.log('=== Testes de Arquitetura SOLID ===');
runTest('SOLID Principles', 'node test-automation/scripts/test-solid-architecture.js');

// Gerar relatório final
console.log('\n📊 === RELATÓRIO FINAL ===');
console.log(`Total de Testes: ${totalTests}`);
console.log(`Testes Passaram: ${totalPassed}`);
console.log(`Testes Falharam: ${totalTests - totalPassed}`);
console.log(`Taxa de Sucesso: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);

console.log('\n📋 Detalhes dos Resultados:');
allResults.forEach(result => {
  console.log(`- ${result.name}: ${result.status}`);
});

// Salvar relatório em arquivo
const reportData = {
  timestamp: new Date().toISOString(),
  summary: {
    total: totalTests,
    passed: totalPassed,
    failed: totalTests - totalPassed,
    successRate: ((totalPassed / totalTests) * 100).toFixed(1)
  },
  results: allResults
};

const reportPath = 'test-automation/reports/latest-report.json';
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
console.log(`\n📄 Relatório detalhado salvo em: ${reportPath}`);

// Status final
if (totalPassed === totalTests) {
  console.log('\n🎉 TODOS OS TESTES PASSARAM! Projeto está pronto para continuar.');
  process.exit(0);
} else {
  console.log('\n❌ ALGUNS TESTES FALHARAM! Corrija os problemas antes de continuar.');
  process.exit(1);
}
