import prisma from "../config/prisma";
import { CreateCommentDto } from "../types/comments.types";

export const commentsService = {
  // Retorna todos los comentarios de una tarea, ordenados del más antiguo al más reciente
  async findByTask(taskId: string) {
    // 1. Consultar comentarios donde taskId coincida, incluyendo datos del autor
    return prisma.comment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  },

  // Crea un comentario en una tarea. Valida que la tarea exista antes de insertar.
  async create(data: CreateCommentDto, userId: string) {
    // 1. Verificar que la tarea exista
    const task = await prisma.task.findUnique({ where: { id: data.taskId } });
    if (!task) throw { status: 404, message: "Tarea no encontrada" };

    // 2. Crear el comentario asociado a la tarea y al usuario autenticado
    return prisma.comment.create({
      data: { content: data.content, taskId: data.taskId, userId },
      include: { user: { select: { id: true, name: true } } },
    });
  },

  // Elimina un comentario si el usuario autenticado es el autor del mismo
  async remove(id: string, requesterId: string) {
    // 1. Buscar el comentario por ID
    const comment = await prisma.comment.findUnique({ where: { id } });

    // 2. Si no existe, lanzar error 404
    if (!comment) throw { status: 404, message: "Comentario no encontrado" };

    // 3. Verificar que quien solicita la eliminación sea el autor
    if (comment.userId !== requesterId)
      throw {
        status: 403,
        message: "Solo puedes eliminar tus propios comentarios",
      };
      
    // 4. Eliminar el comentario
    await prisma.comment.delete({ where: { id } });
  },
};
