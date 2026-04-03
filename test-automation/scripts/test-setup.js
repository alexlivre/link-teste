// test-setup.js
// Testes para validação do setup do projeto Vue.js

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runSetupTests = () => {
  console.log('🧪 Iniciando testes de setup do projeto...');
  
  let testsPassed = 0;
  let testsTotal = 0;
  
  // Teste 1: Verificar se os arquivos essenciais existem
  testsTotal++;
  try {
    const essentialFiles = [
      'package.json',
      'vite.config.js',
      'tailwind.config.js',
      'index.html',
      'src/main.js',
      'src/App.vue',
      'src/utils/whatsapp.js',
      'src/views/Home.vue',
      'src/views/WhatsApp.vue'
    ];
    
    let allFilesExist = true;
    for (const file of essentialFiles) {
      if (!fs.existsSync(file)) {
        console.log(`❌ Arquivo essencial faltando: ${file}`);
        allFilesExist = false;
      }
    }
    
    if (allFilesExist) {
      console.log('✅ Teste 1 passou: Todos os arquivos essenciais existem');
      testsPassed++;
    } else {
      console.log('❌ Teste 1 falhou: Arquivos essenciais faltando');
    }
  } catch (error) {
    console.log('❌ Teste 1 falhou:', error.message);
  }
  
  // Teste 2: Verificar estrutura de pastas
  testsTotal++;
  try {
    const essentialDirs = [
      'src',
      'src/components',
      'src/views',
      'src/composables',
      'src/utils',
      'src/assets',
      'test-automation',
      'test-automation/scripts',
      'test-automation/reports'
    ];
    
    let allDirsExist = true;
    for (const dir of essentialDirs) {
      if (!fs.existsSync(dir)) {
        console.log(`❌ Diretório essencial faltando: ${dir}`);
        allDirsExist = false;
      }
    }
    
    if (allDirsExist) {
      console.log('✅ Teste 2 passou: Estrutura de pastas correta');
      testsPassed++;
    } else {
      console.log('❌ Teste 2 falhou: Diretórios essenciais faltando');
    }
  } catch (error) {
    console.log('❌ Teste 2 falhou:', error.message);
  }
  
  // Teste 3: Verificar package.json
  testsTotal++;
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const requiredDeps = ['vue', 'vue-router'];
    const requiredDevDeps = ['vite', '@vitejs/plugin-vue', 'tailwindcss'];
    
    let depsOk = requiredDeps.every(dep => packageJson.dependencies[dep]);
    let devDepsOk = requiredDevDeps.every(dep => packageJson.devDependencies[dep]);
    
    if (depsOk && devDepsOk) {
      console.log('✅ Teste 3 passou: Dependências corretas no package.json');
      testsPassed++;
    } else {
      console.log('❌ Teste 3 falhou: Dependências incorretas');
    }
  } catch (error) {
    console.log('❌ Teste 3 falhou:', error.message);
  }
  
  // Teste 4: Verificar funções do WhatsApp
  testsTotal++;
  try {
    // Ler e executar as funções do utils
    const utilsPath = join(__dirname, '../../src/utils/whatsapp.js');
    const utilsContent = fs.readFileSync(utilsPath, 'utf8');
    
    // Verificar se as funções essenciais existem no arquivo
    const essentialFunctions = [
      'cleanPhoneNumber',
      'validateBrazilianPhone', 
      'generateWhatsAppLink',
      'encodeWhatsAppMessage'
    ];
    
    let allFunctionsExist = essentialFunctions.every(func => 
      utilsContent.includes(`export const ${func}`)
    );
    
    if (allFunctionsExist) {
      console.log('✅ Teste 4 passou: Funções do WhatsApp definidas');
      testsPassed++;
    } else {
      console.log('❌ Teste 4 falhou: Funções do WhatsApp faltando');
    }
  } catch (error) {
    console.log('❌ Teste 4 falhou:', error.message);
  }
  
  // Teste 5: Verificar estrutura de testes
  testsTotal++;
  try {
    const testFiles = [
      'test-automation/TEST_LOG.md',
      'test-automation/scripts/test-whatsapp-generator.js'
    ];
    
    let allTestFilesExist = testFiles.every(file => fs.existsSync(file));
    
    if (allTestFilesExist) {
      console.log('✅ Teste 5 passou: Estrutura de testes criada');
      testsPassed++;
    } else {
      console.log('❌ Teste 5 falhou: Arquivos de teste faltando');
    }
  } catch (error) {
    console.log('❌ Teste 5 falhou:', error.message);
  }
  
  // Resultado final
  console.log(`\n📊 Resultado: ${testsPassed}/${testsTotal} testes passaram`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 Setup do projeto validado com sucesso!');
    return true;
  } else {
    console.log('❌ Alguns testes de setup falharam.');
    return false;
  }
};

// Executar testes
runSetupTests();
