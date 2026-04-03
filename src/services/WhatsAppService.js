// services/WhatsAppService.js
// Serviço de alto nível para WhatsApp seguindo SOLID principles

import { LinkGeneratorInterface } from '../interfaces/LinkGeneratorInterface.js';
import { StorageInterface } from '../interfaces/StorageInterface.js';

/**
 * Serviço de alto nível que gerencia operações WhatsApp
 * Dependency Inversion: Depende de abstrações, não implementações
 */
export class WhatsAppService {
  /**
   * @param {LinkGeneratorInterface} linkGenerator - Gerador de links (injeção de dependência)
   * @param {StorageInterface} storage - Serviço de armazenamento (injeção de dependência)
   */
  constructor(linkGenerator, storage) {
    // Validação de dependências (Liskov Substitution)
    if (!(linkGenerator instanceof LinkGeneratorInterface)) {
      throw new Error('linkGenerator must implement LinkGeneratorInterface');
    }
    
    if (!(storage instanceof StorageInterface)) {
      throw new Error('storage must implement StorageInterface');
    }
    
    this.linkGenerator = linkGenerator;
    this.storage = storage;
    this.historyKey = 'inkpage_whatsapp_history';
    this.lastUsedKey = 'inkpage_whatsapp_last_used';
  }
  
  /**
   * Gera link e salva no histórico
   * @param {Object} params - { phone: string, message: string }
   * @returns {Promise<Object>} - { link: string, saved: boolean }
   */
  async generateAndSave(params) {
    try {
      // Gera link usando serviço injetado
      const link = this.linkGenerator.generate(params);
      
      // Salva no histórico usando serviço injetado
      const historyItem = {
        id: Date.now(),
        url: link,
        phone: params.phone,
        message: params.message || '',
        createdAt: new Date().toISOString(),
        type: 'whatsapp'
      };
      
      const saved = await this.saveToHistory(historyItem);
      
      // Atualiza último usado
      await this.updateLastUsed(params.phone, params.message || '');
      
      return {
        link,
        saved,
        historyItem
      };
    } catch (error) {
      throw new Error(`Failed to generate WhatsApp link: ${error.message}`);
    }
  }
  
  /**
   * Salva item no histórico
   * @param {Object} historyItem - Item do histórico
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async saveToHistory(historyItem) {
    try {
      const history = await this.getHistory();
      const updatedHistory = [...history, historyItem];
      
      // Manter apenas últimos 50 itens
      const limitedHistory = updatedHistory.slice(-50);
      
      return await this.storage.save(this.historyKey, limitedHistory);
    } catch (error) {
      console.error('Error saving to history:', error);
      return false;
    }
  }
  
  /**
   * Recupera histórico de links
   * @returns {Promise<Array>} - Histórico de links
   */
  async getHistory() {
    try {
      const history = await this.storage.get(this.historyKey, []);
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }
  
  /**
   * Recupera últimos N links do histórico
   * @param {number} limit - Limite de links
   * @returns {Promise<Array>} - Últimos links
   */
  async getRecentLinks(limit = 5) {
    const history = await this.getHistory();
    return history.slice(-limit).reverse();
  }
  
  /**
   * Atualiza último telefone e mensagem usados
   * @param {string} phone - Telefone
   * @param {string} message - Mensagem
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async updateLastUsed(phone, message) {
    const lastUsed = { phone, message };
    return await this.storage.save(this.lastUsedKey, lastUsed);
  }
  
  /**
   * Recupera último telefone e mensagem usados
   * @returns {Promise<Object>} - { phone: string, message: string }
   */
  async getLastUsed() {
    return await this.storage.get(this.lastUsedKey, { phone: '', message: '' });
  }
  
  /**
   * Limpa histórico
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async clearHistory() {
    return await this.storage.save(this.historyKey, []);
  }
  
  /**
   * Remove item específico do histórico
   * @param {number} itemId - ID do item a remover
   * @returns {Promise<boolean>} - Sucesso ou falha
   */
  async removeFromHistory(itemId) {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter(item => item.id !== itemId);
      return await this.storage.save(this.historyKey, updatedHistory);
    } catch (error) {
      console.error('Error removing from history:', error);
      return false;
    }
  }
}
