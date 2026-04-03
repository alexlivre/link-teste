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
  async set(_key, _value) {
    throw new Error('Method set() must be implemented')
  }
  
  /**
   * Método abstrato para recuperar dados
   * @param {string} _key - Chave do item
   * @param {*} _defaultValue - Valor padrão caso não exista
   * @returns {*} - Valor encontrado ou padrão
   */
  async get(_key, _defaultValue = null) {
    throw new Error('Method get() must be implemented')
  }
  
  /**
   * Método abstrato para remover dados
   * @param {string} _key - Chave para remover
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async remove(_key) {
    throw new Error('Method remove() must be implemented')
  }
}
