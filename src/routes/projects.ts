import { Router } from 'express';
import { projectsController } from '../controllers/projects.controller';

const router = Router();

/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags: [Proyectos]
 *     summary: Lista todos los proyectos
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida correctamente
 */
router.get('/', projectsController.getAll);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     tags: [Proyectos]
 *     summary: Obtiene un proyecto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', projectsController.getById);

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags: [Proyectos]
 *     summary: Crea un nuevo proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, ownerId]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado correctamente
 *       400:
 *         description: Faltan campos requeridos o el ownerId no existe
 */
router.post('/', projectsController.create);

/**
 * @openapi
 * /api/projects/{id}:
 *   put:
 *     tags: [Proyectos]
 *     summary: Actualiza un proyecto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', projectsController.update);

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     tags: [Proyectos]
 *     summary: Elimina un proyecto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Proyecto eliminado correctamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', projectsController.remove);

export default router;