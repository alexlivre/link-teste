// backend/controllers/FolderController.js
// Controller de pastas seguindo Clean Code (< 80 linhas)

import { storageService } from '../services/JsonStorageService.js'
import { folderService } from '../services/FolderService.js'
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js'

/**
 * Controller de pastas
 * Single Responsibility: Apenas gerenciar operações de pastas
 */
class FolderController {
  constructor() {
    this.storage = storageService
    this.folderService = folderService
  }

  /**
   * Busca uma pasta pelo hash com todos os seus links
   */
  async getByHash(req, res, next) {
    try {
      const { hash } = req.params

      if (!hash || hash.length < 16) {
        throw new ValidationError('Invalid folder hash')
      }

      // Buscar pasta
      const folder = await this.folderService.findByHash(hash)

      if (!folder) {
        throw new NotFoundError(`Folder with hash "${hash}" not found`)
      }

      // Buscar links da pasta
      const links = await this.storage.find(
        'links.json',
        link => link.folder_hash === hash
      )

      // Atualizar último acesso
      await this.folderService.updateLastAccessed(hash)

      // Resposta
      res.json({
        success: true,
        data: {
          hash: folder.hash,
          created_at: folder.created_at,
          last_accessed: new Date().toISOString(),
          link_count: links.length,
          links: links.map(link => ({
            id: link.id,
            slug: link.slug,
            url_destination: link.url_destination,
            clicks: link.clicks || 0,
            created_at: link.created_at,
            short_url: `http://localhost:3001/${link.slug}`
          }))
        }
      })

    } catch (error) {
      next(error)
    }
  }

  /**
   * Cria uma nova pasta
   */
  async create(req, res, next) {
    try {
      const folder = await this.folderService.createFolder()

      res.status(201).json({
        success: true,
        data: {
          hash: folder.hash,
          created_at: folder.created_at,
          message: 'Folder created successfully. Save this hash to access your links later!'
        }
      })

    } catch (error) {
      next(error)
    }
  }

  /**
   * Lista todas as pastas (para debug)
   */
  async list(req, res, next) {
    try {
      const folders = await this.folderService.listAll()
      
      // Buscar contagem de links para cada pasta
      const foldersWithCount = await Promise.all(
        folders.map(async (folder) => {
          const links = await this.storage.find(
            'links.json',
            link => link.folder_hash === folder.hash
          )
          return {
            ...folder,
            link_count: links.length
          }
        })
      )

      res.json({
        success: true,
        count: foldersWithCount.length,
        data: foldersWithCount
      })

    } catch (error) {
      next(error)
    }
  }

  /**
   * Verifica se uma pasta existe
   */
  async exists(req, res, next) {
    try {
      const { hash } = req.params
      const exists = await this.folderService.exists(hash)

      res.json({
        success: true,
        data: { exists }
      })

    } catch (error) {
      next(error)
    }
  }
}

// Instância singleton
const folderController = new FolderController()

export { FolderController, folderController }
export default folderController
