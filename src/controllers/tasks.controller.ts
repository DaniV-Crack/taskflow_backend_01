import { Request, Response } from "express";
import { tasksService } from "../services/tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "../types/tasks.types";

export const tasksController = {
  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await tasksService.findByProject(
        req.params.projectId as string,
        req.query.status as string | undefined,
      );
      res.json({ data: tasks, count: tasks.length });
    } catch (e: any) {
      res.status(e?.status ?? 500).json({ error: e?.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.findById(req.params.id as string);
      if (!task) {
        res.status(404).json({ error: "Tarea no encontrada" });
        return;
      }
      res.json({ data: task });
    } catch (e: any) {
      res.status(e?.status ?? 500).json({ error: e?.message });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.create(
        req.body as CreateTaskDto,
        req.user!.userId,
      );
      res.status(201).json({ data: task });
    } catch (e: any) {
      res.status(e?.status ?? 500).json({ error: e?.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.update(
        req.params.id as string,
        req.body as UpdateTaskDto,
        req.user!.userId,
      );
      res.json({ data: task });
    } catch (e: any) {
      res.status(e?.status ?? 500).json({ error: e?.message });
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await tasksService.remove(req.params.id as string, req.user!.userId);
      res.status(204).send();
    } catch (e: any) {
      res.status(e?.status ?? 500).json({ error: e?.message });
    }
  },
};
