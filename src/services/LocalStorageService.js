// services/LocalStorageService.js
// Serviço de armazenamento LocalStorage seguindo SOLID principles

import { StorageInterface } from '../interfaces/StorageInterface.js';

/**
 * Serviço específico para armazenamento LocalStorage
 * Single Responsibility: Apenas gerencia LocalStorage
 */
export class LocalStorageService extends StorageInterface {
  constructor() {
    super();
    this.isAvailable = this.checkAvailability();
  }
  
  /**
   * Verifica se LocalStorage está disponível
   * @returns {boolean} - Disponível ou não
   */
  checkAvailability() {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('LocalStorage not available:', error.message);
      return false;
    }
  }
  
  /**
   * Salva dados no LocalStorage
   * @param {string} key - Chave para salvar
   * @param {any} value - Valor a ser salvo
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async save(key, value) {
    if (!this.isAvailable) {
      console.warn('LocalStorage not available, data not saved');
      return false;
    }
    
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error saving to LocalStorage key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Recupera dados do LocalStorage
   * @param {string} key - Chave para recuperar
   * @param {any} defaultValue - Valor padrão se não encontrado
   * @returns {Promise<any>} - Valor recuperado
   */
  async get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting from LocalStorage key "${key}":`, error);
      return defaultValue;
    }
  }
  
  /**
   * Remove dados do LocalStorage
   * @param {string} key - Chave para remover
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async remove(key) {
    if (!this.isAvailable) {
      return false;
    }
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from LocalStorage key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Limpa todos os dados do LocalStorage
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async clear() {
    if (!this.isAvailable) {
      return false;
    }
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing LocalStorage:', error);
      return false;
    }
  }
  
  /**
   * Lista todas as chaves do LocalStorage
   * @returns {string[]} - Lista de chaves
   */
  getKeys() {
    if (!this.isAvailable) {
      return [];
    }
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }
}
