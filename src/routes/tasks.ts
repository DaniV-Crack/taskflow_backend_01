import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schemas';

const router = Router();

/**
 * @openapi
 * /api/tasks/project/{projectId}:
 *   get:
 *     tags: [Tareas]
 *     summary: Lista todas las tareas de un proyecto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida correctamente
 *       400:
 *         description: ID del proyecto inválido
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/project/:projectId', tasksController.getByProject);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tareas]
 *     summary: Obtiene una tarea por ID
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
 *         description: Tarea encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', tasksController.getById);

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tareas]
 *     summary: Crea una nueva tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, projectId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *                 default: TODO
 *               projectId:
 *                 type: string
 *                 format: uuid
 *               assignedTo:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para crear tareas en este proyecto
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', validate(createTaskSchema), tasksController.create);

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tareas]
 *     summary: Actualiza una tarea
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               assignedTo:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *       400:
 *         description: ID inválido o datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para actualizar esta tarea
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', validate(updateTaskSchema), tasksController.update);

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tareas]
 *     summary: Elimina una tarea
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
 *         description: Tarea eliminada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar esta tarea
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', tasksController.remove);

export default router;