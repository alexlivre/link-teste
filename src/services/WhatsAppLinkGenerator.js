// services/WhatsAppLinkGenerator.js
// Serviço de geração de links WhatsApp seguindo SOLID principles

import { LinkGeneratorInterface } from '../interfaces/LinkGeneratorInterface.js';
import { PhoneValidator } from '../validators/PhoneValidator.js';

/**
 * Serviço específico para geração de links WhatsApp
 * Single Responsibility: Apenas gera links WhatsApp
 */
export class WhatsAppLinkGenerator extends LinkGeneratorInterface {
  constructor() {
    super();
    this.phoneValidator = new PhoneValidator();
    this.baseUrl = 'https://wa.me';
  }
  
  /**
   * Gera link WhatsApp a partir de telefone e mensagem
   * @param {Object} params - { phone: string, message: string }
   * @returns {string} - URL do WhatsApp
   */
  generate(params) {
    const { phone, message = '' } = params;
    
    if (!this.validateParams(params)) {
      throw new Error('Invalid parameters for WhatsApp link generation');
    }
    
    const cleanPhone = this.phoneValidator.cleanPhone(phone);
    const fullPhone = `55${cleanPhone}`;
    const encodedMessage = this.encodeMessage(message);
    
    const url = `${this.baseUrl}/${fullPhone}`;
    return encodedMessage ? `${url}?text=${encodedMessage}` : url;
  }
  
  /**
   * Valida parâmetros para geração de link
   * @param {Object} params - Parâmetros a validar
   * @returns {boolean} - Válidos ou inválidos
   */
  validateParams(params) {
    if (!params || typeof params !== 'object') {
      return false;
    }
    
    const { phone, message } = params;
    
    // Telefone é obrigatório e deve ser válido
    if (!phone || !this.phoneValidator.validate(phone)) {
      return false;
    }
    
    // Mensagem é opcional, mas se existir deve ser string
    if (message && typeof message !== 'string') {
      return false;
    }
    
    return true;
  }
  
  /**
   * Codifica mensagem para URL
   * @param {string} message - Mensagem a codificar
   * @returns {string} - Mensagem codificada
   */
  encodeMessage(message) {
    if (!message) return '';
    return encodeURIComponent(message);
  }
  
  /**
   * Formata telefone para exibição
   * @param {string} phone - Telefone bruto
   * @returns {string} - Telefone formatado
   */
  formatPhone(phone) {
    const cleanPhone = this.phoneValidator.cleanPhone(phone);
    
    if (cleanPhone.length <= 2) {
      return cleanPhone;
    } else if (cleanPhone.length <= 7) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`;
    } else {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    }
  }
}
