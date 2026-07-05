import { Router } from 'express';
import { commentsController } from '../controllers/comments.controller';

const router = Router();

/**
 * @openapi
 * /api/comments/task/{taskId}:
 *   get:
 *     tags: [Comentarios]
 *     summary: Lista todos los comentarios de una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/task/:taskId', commentsController.getByTask);

/**
 * @openapi
 * /api/comments:
 *   post:
 *     tags: [Comentarios]
 *     summary: Crea un nuevo comentario en una tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, taskId]
 *             properties:
 *               content:
 *                 type: string
 *               taskId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Comentario creado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', commentsController.create);

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     tags: [Comentarios]
 *     summary: Elimina un comentario
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
 *         description: Comentario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar este comentario
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', commentsController.remove);

export default router;