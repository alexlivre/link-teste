// interfaces/ValidatorInterface.js
// Interface para validadores seguindo SOLID principles

/**
 * Interface abstrata para validadores
 * Segue o Interface Segregation Principle - interfaces pequenas e específicas
 */
export class ValidatorInterface {
  /**
   * Método abstrato para validação
   * @param {any} value - Valor a ser validado
   * @returns {boolean} - Válido ou inválido
   */
  validate(value) {
    throw new Error('Method validate() must be implemented');
  }
  
  /**
   * Método abstrato para mensagem de erro
   * @returns {string} - Mensagem de erro específica
   */
  getErrorMessage() {
    throw new Error('Method getErrorMessage() must be implemented');
  }
}
