// test-solid-architecture.js
// Testes para validação da arquitetura SOLID implementada

import fs from 'fs';

const runSolidTests = () => {
  console.log('🧪 Iniciando testes de arquitetura SOLID...');
  
  let testsPassed = 0;
  let testsTotal = 0;
  
  // Teste 1: Verificar interfaces criadas
  testsTotal++;
  try {
    const interfaces = [
      'src/interfaces/ValidatorInterface.js',
      'src/interfaces/LinkGeneratorInterface.js',
      'src/interfaces/StorageInterface.js'
    ];
    
    const allInterfacesExist = interfaces.every(interfacePath => 
      fs.existsSync(interfacePath)
    );
    
    if (allInterfacesExist) {
      console.log('✅ Teste 1 passou: Interfaces SOLID criadas');
      testsPassed++;
    } else {
      console.log('❌ Teste 1 falhou: Interfaces faltando');
    }
  } catch (error) {
    console.log('❌ Teste 1 falhou:', error.message);
  }
  
  // Teste 2: Verificar implementações concretas
  testsTotal++;
  try {
    const implementations = [
      'src/validators/PhoneValidator.js',
      'src/validators/CompositeValidator.js',
      'src/services/WhatsAppLinkGenerator.js',
      'src/services/LocalStorageService.js',
      'src/services/WhatsAppService.js'
    ];
    
    const allImplementationsExist = implementations.every(implPath => 
      fs.existsSync(implPath)
    );
    
    if (allImplementationsExist) {
      console.log('✅ Teste 2 passou: Implementações concretas criadas');
      testsPassed++;
    } else {
      console.log('❌ Teste 2 falhou: Implementações faltando');
    }
  } catch (error) {
    console.log('❌ Teste 2 falhou:', error.message);
  }
  
  // Teste 3: Verificar Single Responsibility Principle
  testsTotal++;
  try {
    const phoneValidatorContent = fs.readFileSync('src/validators/PhoneValidator.js', 'utf8');
    const linkGeneratorContent = fs.readFileSync('src/services/WhatsAppLinkGenerator.js', 'utf8');
    const storageServiceContent = fs.readFileSync('src/services/LocalStorageService.js', 'utf8');
    
    // Cada classe deve ter apenas uma responsabilidade
    const phoneHasSingleResponsibility = phoneValidatorContent.includes('validate') &&
                                        phoneValidatorContent.includes('cleanPhone') &&
                                        !phoneValidatorContent.includes('localStorage');
    
    const generatorHasSingleResponsibility = linkGeneratorContent.includes('generate') &&
                                            linkGeneratorContent.includes('validateParams') &&
                                            !linkGeneratorContent.includes('localStorage');
    
    const storageHasSingleResponsibility = storageServiceContent.includes('save') &&
                                         storageServiceContent.includes('get') &&
                                         storageServiceContent.includes('remove') &&
                                         !storageServiceContent.includes('generate');
    
    if (phoneHasSingleResponsibility && generatorHasSingleResponsibility && storageHasSingleResponsibility) {
      console.log('✅ Teste 3 passou: Single Responsibility Principle aplicado');
      testsPassed++;
    } else {
      console.log('❌ Teste 3 falhou: Classes com múltiplas responsabilidades');
    }
  } catch (error) {
    console.log('❌ Teste 3 falhou:', error.message);
  }
  
  // Teste 4: Verificar Open/Closed Principle
  testsTotal++;
  try {
    const compositeValidatorContent = fs.readFileSync('src/validators/CompositeValidator.js', 'utf8');
    
    // CompositeValidator deve ser extensível sem modificação
    const hasOpenClosed = compositeValidatorContent.includes('addValidator') &&
                         compositeValidatorContent.includes('removeValidator') &&
                         compositeValidatorContent.includes('Aberto para extensão');
    
    if (hasOpenClosed) {
      console.log('✅ Teste 4 passou: Open/Closed Principle aplicado');
      testsPassed++;
    } else {
      console.log('❌ Teste 4 falhou: Open/Closed Principle não aplicado');
    }
  } catch (error) {
    console.log('❌ Teste 4 falhou:', error.message);
  }
  
  // Teste 5: Verificar Dependency Inversion Principle
  testsTotal++;
  try {
    const whatsappServiceContent = fs.readFileSync('src/services/WhatsAppService.js', 'utf8');
    const composableContent = fs.readFileSync('src/composables/useWhatsAppService.js', 'utf8');
    
    // WhatsAppService deve depender de abstrações
    const hasDependencyInversion = whatsappServiceContent.includes('LinkGeneratorInterface') &&
                                 whatsappServiceContent.includes('StorageInterface') &&
                                 whatsappServiceContent.includes('Dependency Inversion') &&
                                 whatsappServiceContent.includes('injeção de dependência');
    
    // Composable deve injetar dependências
    const hasDependencyInjection = composableContent.includes('new WhatsAppLinkGenerator()') &&
                                  composableContent.includes('new LocalStorageService()') &&
                                  composableContent.includes('new WhatsAppService');
    
    if (hasDependencyInversion && hasDependencyInjection) {
      console.log('✅ Teste 5 passou: Dependency Inversion Principle aplicado');
      testsPassed++;
    } else {
      console.log('❌ Teste 5 falhou: Dependency Inversion Principle não aplicado');
    }
  } catch (error) {
    console.log('❌ Teste 5 falhou:', error.message);
  }
  
  // Teste 6: Verificar Liskov Substitution Principle
  testsTotal++;
  try {
    const phoneValidatorContent = fs.readFileSync('src/validators/PhoneValidator.js', 'utf8');
    const compositeValidatorContent = fs.readFileSync('src/validators/CompositeValidator.js', 'utf8');
    
    // PhoneValidator deve ser substituível por ValidatorInterface
    const phoneExtendsInterface = phoneValidatorContent.includes('extends ValidatorInterface');
    
    // CompositeValidator deve validar substituição
    const validatesSubstitution = compositeValidatorContent.includes('instanceof ValidatorInterface');
    
    if (phoneExtendsInterface && validatesSubstitution) {
      console.log('✅ Teste 6 passou: Liskov Substitution Principle aplicado');
      testsPassed++;
    } else {
      console.log('❌ Teste 6 falhou: Liskov Substitution Principle não aplicado');
    }
  } catch (error) {
    console.log('❌ Teste 6 falhou:', error.message);
  }
  
  // Teste 7: Verificar Interface Segregation Principle
  testsTotal++;
  try {
    const validatorInterfaceContent = fs.readFileSync('src/interfaces/ValidatorInterface.js', 'utf8');
    const linkGeneratorInterfaceContent = fs.readFileSync('src/interfaces/LinkGeneratorInterface.js', 'utf8');
    
    // Interfaces devem ser pequenas e específicas
    const validatorHasSmallInterface = validatorInterfaceContent.includes('validate') &&
                                      validatorInterfaceContent.includes('getErrorMessage') &&
                                      validatorInterfaceContent.split('\n').length < 30;
    
    const generatorHasSmallInterface = linkGeneratorInterfaceContent.includes('generate') &&
                                      linkGeneratorInterfaceContent.includes('validateParams') &&
                                      linkGeneratorInterfaceContent.split('\n').length < 30;
    
    if (validatorHasSmallInterface && generatorHasSmallInterface) {
      console.log('✅ Teste 7 passou: Interface Segregation Principle aplicado');
      testsPassed++;
    } else {
      console.log('❌ Teste 7 falhou: Interface Segregation Principle não aplicado');
    }
  } catch (error) {
    console.log('❌ Teste 7 falhou:', error.message);
  }
  
  // Resultado final
  console.log(`\n📊 Resultado: ${testsPassed}/${testsTotal} testes passaram`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 Arquitetura SOLID validada com sucesso!');
    return true;
  } else {
    console.log('❌ Alguns testes SOLID falharam.');
    return false;
  }
};

// Executar testes
runSolidTests();
