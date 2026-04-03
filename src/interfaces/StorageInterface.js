// interfaces/StorageInterface.js
// Interface para serviços de armazenamento seguindo SOLID principles

/**
 * Interface abstrata para serviços de armazenamento
 * Segue o Interface Segregation Principle - interfaces pequenas e específicas
 */
export class StorageInterface {
  /**
   * Método abstrato para salvar dados
   * @param {string} key - Chave para salvar
   * @param {any} value - Valor a ser salvo
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async save(key, value) {
    throw new Error('Method save() must be implemented');
  }
  
  /**
   * Método abstrato para recuperar dados
   * @param {string} key - Chave para recuperar
   * @param {any} defaultValue - Valor padrão se não encontrado
   * @returns {Promise<any>} - Valor recuperado
   */
  async get(key, defaultValue = null) {
    throw new Error('Method get() must be implemented');
  }
  
  /**
   * Método abstrato para remover dados
   * @param {string} key - Chave para remover
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async remove(key) {
    throw new Error('Method remove() must be implemented');
  }
}
