import prisma from "../config/prisma";
import { CreateTaskDto, UpdateTaskDto } from "../types/tasks.types";

export const tasksService = {
  // Retorna las tareas de un proyecto, con filtro opcional por estado
  async findByProject(projectId: string, status?: string) {
    // 1. Consultar tareas del proyecto, filtrando por estado si se especifica
    return prisma.task.findMany({
      where: { projectId, ...(status && { status: status as any }) },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Obtiene una tarea con su asignado, proyecto y comentarios incluidos
  async findById(id: string) {
    // 1. Buscar tarea por ID con relaciones: asignado, proyecto y comentarios
    return prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true, ownerId: true } },
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  // Solo el owner del proyecto puede crear tasks
  async create(data: CreateTaskDto, requesterId: string) {
    // 1. Verificar que el proyecto exista
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });
    if (!project) throw { status: 404, message: "Proyecto no encontrado" };

    // 2. Verificar que quien crea sea el dueño del proyecto
    if (project.ownerId !== requesterId)
      throw {
        status: 403,
        message: "Solo el dueño del proyecto puede crear tareas",
      };
      
    // 3. Crear la tarea con estado por defecto "TODO"
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? "TODO",
        projectId: data.projectId,
        assignedTo: data.assignedTo,
      },
    });
  },

  // Owner del proyecto O usuario asignado pueden actualizar el status
  async update(id: string, data: UpdateTaskDto, requesterId: string) {
    // 1. Obtener la tarea con su proyecto
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });
    // 2. Si no existe, lanzar error 404
    if (!task) throw { status: 404, message: "Tarea no encontrada" };
    // 3. Verificar permisos: dueño del proyecto o usuario asignado
    const canEdit =
      task.project.ownerId === requesterId || task.assignedTo === requesterId;
    if (!canEdit)
      throw {
        status: 403,
        message: "No tienes permiso para modificar esta tarea",
      };
    // 4. Actualizar la tarea
    return prisma.task.update({ where: { id }, data });
  },
  
  // Elimina una tarea. Solo el dueño del proyecto puede hacerlo.
  async remove(id: string, requesterId: string) {
    // 1. Obtener la tarea con su proyecto
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });
    // 2. Si no existe, lanzar error 404
    if (!task) throw { status: 404, message: "Tarea no encontrada" };
    // 3. Verificar que quien elimina sea el dueño del proyecto
    if (task.project.ownerId !== requesterId)
      throw { status: 403, message: "Solo el dueño puede eliminar tareas" };
    // 4. Eliminar la tarea
    await prisma.task.delete({ where: { id } });
  },
};
