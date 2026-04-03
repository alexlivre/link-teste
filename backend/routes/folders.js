// backend/routes/folders.js
// Rotas para gestão de pastas seguindo Clean Code (< 30 linhas)

import { Router } from 'express'
import folderController from '../controllers/FolderController.js'

const router = Router()

// GET /api/folder/:hash - Buscar pasta pelo hash
router.get('/:hash', (req, res, next) => folderController.getByHash(req, res, next))

// GET /api/folder - Listar todas as pastas (debug)
router.get('/', (req, res, next) => folderController.list(req, res, next))

// POST /api/folder - Criar nova pasta
router.post('/', (req, res, next) => folderController.create(req, res, next))

// GET /api/folder/:hash/exists - Verificar se pasta existe
router.get('/:hash/exists', (req, res, next) => folderController.exists(req, res, next))

export default router
