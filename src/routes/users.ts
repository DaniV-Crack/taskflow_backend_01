import { Router } from 'express';
import { usersController } from '../controllers/users.controller';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 */
router.get('/', usersController.getAll);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtiene un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', usersController.getById);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crea un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Faltan campos requeridos
 *       409:
 *         description: El email ya está registrado
 */
router.post('/', usersController.create);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualiza un usuario
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
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', usersController.update);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Elimina un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', usersController.remove);

export default router;