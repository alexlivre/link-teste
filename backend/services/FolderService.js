// backend/services/FolderService.js
// Serviço de gestão de pastas seguindo Clean Code (< 100 linhas)

import { storageService } from './JsonStorageService.js';
import crypto from 'crypto';

/**
 * Serviço de gestão de pastas
 * Single Responsibility: Apenas gerenciar pastas e hashes SHA256
 */
class FolderService {
  constructor() {
    this.storage = storageService;
  }

  /**
   * Gera um hash SHA256 único para uma nova pasta
   */
  generateHash() {
    const timestamp = Date.now().toString();
    const random = crypto.randomUUID();
    const data = `${timestamp}-${random}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  /**
   * Cria uma nova pasta
   */
  async createFolder() {
    const hash = this.generateHash();
    const folder = {
      hash,
      created_at: new Date().toISOString(),
      last_accessed: new Date().toISOString()
    };

    await this.storage.append('folders.json', folder);
    return folder;
  }

  /**
   * Busca uma pasta pelo hash
   */
  async findByHash(hash) {
    return this.storage.findOne('folders.json', folder => folder.hash === hash);
  }

  /**
   * Atualiza o último acesso de uma pasta
   */
  async updateLastAccessed(hash) {
    const folders = await this.storage.read('folders.json');
    const index = folders.findIndex(f => f.hash === hash);
    
    if (index !== -1) {
      folders[index].last_accessed = new Date().toISOString();
      await this.storage.write('folders.json', folders);
    }
  }

  /**
   * Obtém ou cria uma pasta (para o sistema de "último hash usado")
   */
  async getOrCreateFolder(existingHash = null) {
    if (existingHash) {
      const folder = await this.findByHash(existingHash);
      if (folder) {
        await this.updateLastAccessed(existingHash);
        return folder;
      }
    }

    return this.createFolder();
  }

  /**
   * Verifica se uma pasta existe
   */
  async exists(hash) {
    const folder = await this.findByHash(hash);
    return !!folder;
  }

  /**
   * Lista todas as pastas
   */
  async listAll() {
    return this.storage.read('folders.json');
  }
}

// Instância singleton
const folderService = new FolderService();

export { FolderService, folderService };
export default folderService;
