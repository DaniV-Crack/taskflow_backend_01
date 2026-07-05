import { Router } from 'express';
import { projectsController } from '../controllers/projects.controller';

const router = Router();

/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags: [Proyectos]
 *     summary: Lista todos los proyectos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', projectsController.getAll);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     tags: [Proyectos]
 *     summary: Obtiene un proyecto por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', projectsController.getById);

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags: [Proyectos]
 *     summary: Crea un nuevo proyecto
 *     security:
 *       - bearerAuth: []
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
 *         description: Faltan campos requeridos
 *       404:
 *         description: El ownerId no existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', projectsController.create);

/**
 * @openapi
 * /api/projects/{id}:
 *   put:
 *     tags: [Proyectos]
 *     summary: Actualiza un proyecto
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: ID inválido o no hay campos para actualizar
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', projectsController.update);

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     tags: [Proyectos]
 *     summary: Elimina un proyecto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Proyecto eliminado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', projectsController.remove);

export default router;