// validators/CompositeValidator.js
// Validador composto seguindo SOLID principles

import { ValidatorInterface } from '../interfaces/ValidatorInterface.js';

/**
 * Validador composto que pode estender sem modificar
 * Open/Closed Principle: Aberto para extensão, fechado para modificação
 */
export class CompositeValidator extends ValidatorInterface {
  constructor(validators = []) {
    super();
    this.validators = validators;
  }
  
  /**
   * Adiciona um validador à lista
   * @param {ValidatorInterface} validator - Validador a adicionar
   */
  addValidator(validator) {
    if (!(validator instanceof ValidatorInterface)) {
      throw new Error('Validator must implement ValidatorInterface');
    }
    this.validators.push(validator);
  }
  
  /**
   * Remove um validador da lista
   * @param {ValidatorInterface} validator - Validador a remover
   */
  removeValidator(validator) {
    const index = this.validators.indexOf(validator);
    if (index > -1) {
      this.validators.splice(index, 1);
    }
  }
  
  /**
   * Valida usando todos os validadores registrados
   * @param {any} value - Valor a validar
   * @returns {boolean} - Válido se todos os validadores aprovarem
   */
  validate(value) {
    return this.validators.every(validator => validator.validate(value));
  }
  
  /**
   * Retorna a primeira mensagem de erro encontrada
   * @returns {string} - Mensagem de erro
   */
  getErrorMessage() {
    for (const validator of this.validators) {
      if (!validator.validate(this.lastValue)) {
        return validator.getErrorMessage();
      }
    }
    return 'Validation failed';
  }
  
  /**
   * Valida e armazena o último valor para uso na mensagem de erro
   * @param {any} value - Valor a validar
   * @returns {boolean} - Válido ou inválido
   */
  validateWithMessage(value) {
    this.lastValue = value;
    return this.validate(value);
  }
}
