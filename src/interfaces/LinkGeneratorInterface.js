// interfaces/LinkGeneratorInterface.js
// Interface para geradores de links seguindo SOLID principles

/**
 * Interface abstrata para geradores de links
 * Segue o Interface Segregation Principle - interfaces pequenas e específicas
 */
export class LinkGeneratorInterface {
  /**
   * Método abstrato para gerar link
   * @param {Object} _params - Parâmetros para geração
   * @returns {string} - URL gerada
   */
  generate(_params) {
    throw new Error('Method generate() must be implemented')
  }
  
  /**
   * Método abstrato para validar parâmetros
   * @param {Object} _params - Parâmetros a validar
   */
  validate(_params) {
    throw new Error('Method validate() must be implemented')
  }
}
