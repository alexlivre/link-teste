// backend/controllers/LinkController.js
// Controller de links seguindo Clean Code (< 80 linhas)

import { storageService } from '../services/JsonStorageService.js';
import { folderService } from '../services/FolderService.js';
import { validateLinkCreation } from '../validators/linkValidator.js';
import { NotFoundError } from '../middleware/errorHandler.js';

/**
 * Controller de links
 * Single Responsibility: Apenas gerenciar operações CRUD de links
 */
class LinkController {
  constructor() {
    this.storage = storageService;
    this.folderService = folderService;
  }

  /**
   * Cria um novo link
   */
  async create(req, res, next) {
    try {
      const { url, slug, folder_hash } = req.body;

      // Validação
      const validated = await validateLinkCreation({ url, slug });

      // Obter ou criar pasta
      const folder = await this.folderService.getOrCreateFolder(folder_hash);

      // Gerar ID
      const id = await this.storage.getNextId('links.json');

      // Criar link
      const link = {
        id,
        slug: validated.slug,
        url_destination: validated.url,
        folder_hash: folder.hash,
        created_at: new Date().toISOString(),
        clicks: 0
      };

      // Salvar
      await this.storage.append('links.json', link);

      // Resposta
      res.status(201).json({
        success: true,
        data: {
          id: link.id,
          slug: link.slug,
          url_destination: link.url_destination,
          folder_hash: link.folder_hash,
          created_at: link.created_at,
          clicks: link.clicks,
          short_url: `http://localhost:3001/${link.slug}`
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista todos os links (para debug)
   */
  async list(req, res, next) {
    try {
      const links = await this.storage.read('links.json');
      res.json({
        success: true,
        count: links.length,
        data: links
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um link por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const link = await this.storage.findById('links.json', parseInt(id));

      if (!link) {
        throw new NotFoundError(`Link with id ${id} not found`);
      }

      res.json({
        success: true,
        data: link
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca um link por slug
   */
  async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const link = await this.storage.findOne(
        'links.json',
        l => l.slug === slug
      );

      if (!link) {
        throw new NotFoundError(`Link with slug "${slug}" not found`);
      }

      res.json({
        success: true,
        data: link
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deleta um link
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await this.storage.deleteById('links.json', parseInt(id));

      if (!deleted) {
        throw new NotFoundError(`Link with id ${id} not found`);
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

// Instância singleton
const linkController = new LinkController();

export { LinkController, linkController };
export default linkController;
