import { Request, Response } from "express";
import { tasksService } from "../services/tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "../types/tasks.types";
import { success, error } from "../utils/api-response";

export const tasksController = {
  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await tasksService.findByProject(
        req.params.projectId as string,
        req.query.status as string | undefined,
      );
      success(res, { items: tasks, count: tasks.length }, "Tareas obtenidas correctamente");
    } catch (e: any) {
      error(res, e?.message ?? "Error al obtener tareas", e?.status ?? 500);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.findById(req.params.id as string);
      if (!task) {
        error(res, "Tarea no encontrada", 404);
        return;
      }
      success(res, task, "Tarea obtenida correctamente");
    } catch (e: any) {
      error(res, e?.message ?? "Error al obtener la tarea", e?.status ?? 500);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.create(
        req.body as CreateTaskDto,
        req.user!.userId
      );
      success(res, { data: task }, 'Operación exitosa', 201);
    } catch (e: any) { error(res, e?.message ?? 'Error al crear la tarea', e?.status ?? 500); }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.update(
        req.params.id as string,
        req.body as UpdateTaskDto,
        req.user!.userId,
      );
      success(res, task, "Tarea actualizada correctamente");
    } catch (e: any) {
      error(res, e?.message ?? "Error al actualizar la tarea", e?.status ?? 500);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await tasksService.remove(req.params.id as string, req.user!.userId);
      success(res, null, "Tarea eliminada correctamente", 200);
    } catch (e: any) {
      error(res, e?.message ?? "Error al eliminar la tarea", e?.status ?? 500);
    }
  },
};
