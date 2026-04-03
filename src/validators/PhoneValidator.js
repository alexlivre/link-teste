// validators/PhoneValidator.js
// Validador de telefone brasileiro seguindo SOLID principles

import { ValidatorInterface } from '../interfaces/ValidatorInterface.js'

/**
 * Validador específico para telefone brasileiro
 * Single Responsibility: Apenas valida telefones brasileiros
 */
export class PhoneValidator extends ValidatorInterface {
  constructor() {
    super()
    // Padrões para celular e fixo brasileiro
    this.cellphonePattern = /^[1-9]{2}[9][0-9]{8}$/
    this.landlinePattern = /^[1-9]{2}[0-9]{8}$/
  }
  
  /**
   * Valida se o telefone está no formato brasileiro correto
   * @param {string} phone - Telefone a validar
   * @returns {boolean} - Válido ou inválido
   */
  validate(phone) {
    if (!phone || typeof phone !== 'string') {
      return false
    }
    
    const cleanPhone = this.cleanPhone(phone)
    
    return (
      this.cellphonePattern.test(cleanPhone) || 
      this.landlinePattern.test(cleanPhone)
    )
  }
  
  /**
   * Limpa caracteres não numéricos do telefone
   * @param {string} phone - Telefone bruto
   * @returns {string} - Telefone limpo
   */
  cleanPhone(phone) {
    return phone
      .replace(/\D/g, '')
      .replace(/^55/, '')
      .slice(0, 11)
  }
  
  /**
   * Retorna mensagem de erro específica
   * @returns {string} - Mensagem de erro
   */
  getErrorMessage() {
    return 'Formato de telefone inválido. Use (XX) XXXXX-XXXX para celular ou (XX) XXXX-XXXX para fixo.'
  }
}
