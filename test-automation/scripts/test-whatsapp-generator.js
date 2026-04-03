// test-whatsapp-generator.js
// Testes para o componente WhatsAppGenerator seguindo Clean Code

/**
 * Funções puras e pequenas para validação de WhatsApp
 */

// Função pura para limpar telefone (< 20 linhas)
const cleanPhoneNumber = (rawPhone) => {
  if (!rawPhone) return ''
  
  return rawPhone
    .replace(/\D/g, '')
    .replace(/^55/, '')
    .slice(0, 11)
}

// Função pura para validar telefone brasileiro (< 20 linhas)
const validateBrazilianPhone = (phone) => {
  const cleanPhone = cleanPhoneNumber(phone)
  
  // Celular: XX XXXXX-XXXX (11 dígitos)
  // Fixo: XX XXXX-XXXX (10 dígitos)
  const cellphonePattern = /^[1-9]{2}[9][0-9]{8}$/
  const landlinePattern = /^[1-9]{2}[0-9]{8}$/
  
  return cellphonePattern.test(cleanPhone) || landlinePattern.test(cleanPhone)
}

// Função pura para codificar mensagem (< 20 linhas)
const encodeWhatsAppMessage = (message) => {
  if (!message) return ''
  
  return encodeURIComponent(message)
}

// Função pura para gerar link wa.me (< 20 linhas)
const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = cleanPhoneNumber(phone)
  
  if (!validateBrazilianPhone(phone)) {
    throw new Error('Telefone brasileiro inválido')
  }
  
  const encodedMessage = encodeWhatsAppMessage(message)
  const fullPhone = `55${cleanPhone}`
  
  return `https://wa.me/${fullPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

// Testes unitários
const runTests = () => {
  console.log('🧪 Iniciando testes do WhatsApp Generator...')
  
  let testsPassed = 0
  let testsTotal = 0
  
  // Teste 1: Limpeza de telefone
  testsTotal++
  try {
    const result = cleanPhoneNumber('(11) 98765-4321')
    if (result === '11987654321') {
      console.log('✅ Teste 1 passou: Limpeza de telefone')
      testsPassed++
    } else {
      console.log('❌ Teste 1 falhou: Limpeza de telefone')
    }
  } catch (error) {
    console.log('❌ Teste 1 falhou:', error.message)
  }
  
  // Teste 2: Validação de celular válido
  testsTotal++
  try {
    const result = validateBrazilianPhone('(11) 98765-4321')
    if (result === true) {
      console.log('✅ Teste 2 passou: Validação celular válido')
      testsPassed++
    } else {
      console.log('❌ Teste 2 falhou: Validação celular válido')
    }
  } catch (error) {
    console.log('❌ Teste 2 falhou:', error.message)
  }
  
  // Teste 3: Validação de telefone inválido
  testsTotal++
  try {
    const result = validateBrazilianPhone('123')
    if (result === false) {
      console.log('✅ Teste 3 passou: Validação telefone inválido')
      testsPassed++
    } else {
      console.log('❌ Teste 3 falhou: Validação telefone inválido')
    }
  } catch (error) {
    console.log('❌ Teste 3 falhou:', error.message)
  }
  
  // Teste 4: Codificação de mensagem
  testsTotal++
  try {
    const result = encodeWhatsAppMessage('Olá, tudo bem?')
    if (result === 'Ol%C3%A1%2C%20tudo%20bem%3F') {
      console.log('✅ Teste 4 passou: Codificação de mensagem')
      testsPassed++
    } else {
      console.log('❌ Teste 4 falhou: Codificação de mensagem')
    }
  } catch (error) {
    console.log('❌ Teste 4 falhou:', error.message)
  }
  
  // Teste 5: Geração de link completo
  testsTotal++
  try {
    const result = generateWhatsAppLink('(11) 98765-4321', 'Olá, tudo bem?')
    const expected = 'https://wa.me/5511987654321?text=Ol%C3%A1%2C%20tudo%20bem%3F'
    if (result === expected) {
      console.log('✅ Teste 5 passou: Geração de link completo')
      testsPassed++
    } else {
      console.log('❌ Teste 5 falhou: Geração de link completo')
      console.log(`  Esperado: ${expected}`)
      console.log(`  Recebido: ${result}`)
    }
  } catch (error) {
    console.log('❌ Teste 5 falhou:', error.message)
  }
  
  // Teste 6: Geração de link sem mensagem
  testsTotal++
  try {
    const result = generateWhatsAppLink('(11) 98765-4321', '')
    const expected = 'https://wa.me/5511987654321'
    if (result === expected) {
      console.log('✅ Teste 6 passou: Geração de link sem mensagem')
      testsPassed++
    } else {
      console.log('❌ Teste 6 falhou: Geração de link sem mensagem')
    }
  } catch (error) {
    console.log('❌ Teste 6 falhou:', error.message)
  }
  
  // Teste 7: Erro com telefone inválido
  testsTotal++
  try {
    generateWhatsAppLink('123', 'teste')
    console.log('❌ Teste 7 falhou: Deveria lançar erro com telefone inválido')
  } catch {
    console.log('✅ Teste 7 passou: Erro com telefone inválido')
    testsPassed++
  }
  
  // Resultado final
  console.log(`\n📊 Resultado: ${testsPassed}/${testsTotal} testes passaram`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 Todos os testes passaram!')
    return true
  } else {
    console.log('❌ Alguns testes falharam.')
    return false
  }
}

// Exportar para uso no Node.js ou browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cleanPhoneNumber,
    validateBrazilianPhone,
    encodeWhatsAppMessage,
    generateWhatsAppLink,
    runTests
  }
}

// Executar testes se rodado diretamente
if (typeof window === 'undefined') {
  runTests()
}
