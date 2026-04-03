// backend/services/JsonStorageService.js
// Serviço de armazenamento JSON seguindo Clean Code (< 150 linhas)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Serviço de armazenamento JSON
 * Single Responsibility: Apenas gerenciar persistência em arquivos JSON
 */
class JsonStorageService {
  constructor() {
    this.dataDir = DATA_DIR;
    this.cache = new Map();
    this.pendingWrites = new Set();
    this.initPromise = null;
  }

  /**
   * Inicializa o serviço de armazenamento
   */
  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._initializeDataDir();
    return this.initPromise;
  }

  async _initializeDataDir() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }

    const files = ['links.json', 'folders.json', 'analytics.json'];
    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, '[]');
      }
    }
  }

  /**
   * Obtém o caminho completo de um arquivo
   */
  _getFilePath(filename) {
    return path.join(this.dataDir, filename);
  }

  /**
   * Lê dados de um arquivo JSON
   */
  async read(filename) {
    const filePath = this._getFilePath(filename);
    
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      this.cache.set(filename, parsed);
      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Escreve dados em um arquivo JSON
   */
  async write(filename, data) {
    const filePath = this._getFilePath(filename);
    
    this.cache.set(filename, data);
    
    if (this.pendingWrites.has(filename)) {
      return;
    }

    this.pendingWrites.add(filename);
    
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf8');
    } finally {
      this.pendingWrites.delete(filename);
    }
  }

  /**
   * Adiciona um item a um arquivo
   */
  async append(filename, item) {
    const data = await this.read(filename);
    data.push(item);
    await this.write(filename, data);
    return item;
  }

  /**
   * Atualiza um item por ID
   */
  async updateById(filename, id, updates) {
    const data = await this.read(filename);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    data[index] = { ...data[index], ...updates };
    await this.write(filename, data);
    return data[index];
  }

  /**
   * Remove um item por ID
   */
  async deleteById(filename, id) {
    const data = await this.read(filename);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    const removed = data.splice(index, 1)[0];
    await this.write(filename, data);
    return removed;
  }

  /**
   * Busca itens por critério
   */
  async find(filename, predicate) {
    const data = await this.read(filename);
    return data.filter(predicate);
  }

  /**
   * Busca um único item por critério
   */
  async findOne(filename, predicate) {
    const data = await this.read(filename);
    return data.find(predicate) || null;
  }

  /**
   * Busca por ID
   */
  async findById(filename, id) {
    return this.findOne(filename, item => item.id === id);
  }

  /**
   * Gera próximo ID sequencial
   */
  async getNextId(filename) {
    const data = await this.read(filename);
    if (data.length === 0) {
      return 1;
    }
    const maxId = Math.max(...data.map(item => item.id || 0));
    return maxId + 1;
  }

  /**
   * Limpa o cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Instância singleton
const storageService = new JsonStorageService();

export { JsonStorageService, storageService };
export default storageService;
