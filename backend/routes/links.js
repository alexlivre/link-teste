// backend/routes/links.js
// Rotas para gestão de links seguindo Clean Code (< 30 linhas)

import { Router } from 'express';
import linkController from '../controllers/LinkController.js';

const router = Router();

// POST /api/links - Criar novo link
router.post('/', (req, res, next) => linkController.create(req, res, next));

// GET /api/links - Listar todos os links (debug)
router.get('/', (req, res, next) => linkController.list(req, res, next));

// GET /api/links/:id - Buscar link por ID
router.get('/:id', (req, res, next) => linkController.getById(req, res, next));

// DELETE /api/links/:id - Deletar link
router.delete('/:id', (req, res, next) => linkController.delete(req, res, next));

export default router;
