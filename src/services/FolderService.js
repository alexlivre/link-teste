// src/services/FolderService.js
// Serviço de pastas seguindo Clean Code (< 80 linhas)

import httpService from './HttpClientService.js';

/**
 * Serviço de gestão de pastas
 * Single Responsibility: Apenas gerenciar operações de pastas
 */
class FolderService {
  /**
   * Cria uma nova pasta
   */
  async createFolder() {
    const response = await httpService.post('/folder');
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create folder');
    }

    return response.data;
  }

  /**
   * Busca uma pasta pelo hash
   */
  async getFolderByHash(hash) {
    const response = await httpService.get(`/folder/${hash}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to get folder');
    }

    return response.data;
  }

  /**
   * Lista todas as pastas
   */
  async listFolders() {
    const response = await httpService.get('/folder');
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to list folders');
    }

    return response.data;
  }

  /**
   * Verifica se uma pasta existe
   */
  async folderExists(hash) {
    const response = await httpService.get(`/folder/${hash}/exists`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to check folder');
    }

    return response.data.exists;
  }

  /**
   * Valida um hash de pasta
   */
  validateHash(hash) {
    if (!hash || hash.trim().length === 0) {
      return { valid: false, error: 'Hash é obrigatório' };
    }

    const trimmedHash = hash.trim();
    
    if (trimmedHash.length < 16) {
      return { valid: false, error: 'Hash inválido' };
    }

    return { valid: true, hash: trimmedHash };
  }

  /**
   * Salva o último hash usado no localStorage
   */
  saveLastHash(hash) {
    try {
      localStorage.setItem('inkpage_last_folder_hash', hash);
    } catch (error) {
      console.warn('Failed to save hash to localStorage:', error);
    }
  }

  /**
   * Obtém o último hash usado do localStorage
   */
  getLastHash() {
    try {
      return localStorage.getItem('inkpage_last_folder_hash');
    } catch (error) {
      console.warn('Failed to get hash from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove o último hash do localStorage
   */
  clearLastHash() {
    try {
      localStorage.removeItem('inkpage_last_folder_hash');
    } catch (error) {
      console.warn('Failed to clear hash from localStorage:', error);
    }
  }
}

// Instância singleton
const folderService = new FolderService();

export { FolderService, folderService };
export default folderService;
