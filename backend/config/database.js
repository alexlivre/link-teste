// backend/config/database.js
// Configuração do sistema de armazenamento JSON seguindo Clean Code (< 60 linhas)

import fs from 'fs/promises';
import path from 'path';
import { logError, logInfo } from '../middleware/logger.js';

/**
 * Configuração do sistema de armazenamento JSON
 * Single Responsibility: Apenas gerenciar configuração e inicialização
 */
export const config = {
  dataPath: path.join(process.cwd(), 'backend', 'data'),
  
  /**
   * Inicializa o sistema de armazenamento
   * Cria arquivos JSON necessários se não existirem
   */
  async initialize() {
    try {
      await this.ensureDataDirectory();
      await this.createDataFiles();
      logInfo('Database system initialized successfully');
    } catch (error) {
      logError('Failed to initialize database system', error);
      throw error;
    }
  },

  /**
   * Garante que o diretório de dados existe
   */
  async ensureDataDirectory() {
    try {
      await fs.access(this.dataPath);
    } catch {
      await fs.mkdir(this.dataPath, { recursive: true });
      logInfo(`Created data directory: ${this.dataPath}`);
    }
  },

  /**
   * Cria arquivos JSON iniciais se não existirem
   */
  async createDataFiles() {
    const files = [
      { name: 'links.json', content: [] },
      { name: 'folders.json', content: [] },
      { name: 'analytics.json', content: [] }
    ];

    for (const file of files) {
      const filePath = path.join(this.dataPath, file.name);
      
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, JSON.stringify(file.content, null, 2));
        logInfo(`Created data file: ${file.name}`);
      }
    }
  },

  /**
   * Obtém o caminho completo de um arquivo de dados
   */
  getDataPath(filename) {
    return path.join(this.dataPath, filename);
  }
};
