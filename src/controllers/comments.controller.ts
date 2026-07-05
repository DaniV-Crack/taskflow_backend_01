import { Request, Response } from "express";
import { commentsService } from "../services/comments.service";
import { CreateCommentDto } from "../types/comments.types";
import { success, error } from "../utils/api-response";

export const commentsController = {
  async getByTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
      const comments = await commentsService.findByTask(taskId);
      success(res, { items: comments, count: comments.length }, "Comentarios obtenidos correctamente");
    } catch (e: any) {
      error(res, e?.message ?? "Error al obtener comentarios", e?.status ?? 500);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const comment = await commentsService.create(
        req.body as CreateCommentDto,
        req.user!.userId,
      );
      success(res, comment, "Comentario creado exitosamente", 201);
    } catch (e: any) {
      error(res, e?.message ?? "Error al crear el comentario", e?.status ?? 500);
    }
  },
  
  async remove(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await commentsService.remove(id, req.user!.userId);
      success(res, null, "Comentario eliminado correctamente", 200);
    } catch (e: any) {
      error(res, e?.message ?? "Error al eliminar el comentario", e?.status ?? 500);
    }
  },
};
