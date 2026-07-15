import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { projectsService } from "../services/projects.service";
import { CreateProjectDto, UpdateProjectDto } from "../types/projects.types";
import { success, error } from "../utils/api-response";

export const projectsController = {

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectsService.findAll();
      success(res, { items: projects, count: projects.length });
    } catch (e) {
      error(res, 'Error al obtener proyectos', 500);
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectsService.findById(req.params.id as string);
      if (!project) {
        error(res, 'Proyecto no encontrado', 404);
        return;
      }
      success(res, project);
    } catch (e) {
      error(res, 'Error al obtener el proyecto', 500);
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, ownerId } = req.body as CreateProjectDto;
      if (!name || !ownerId) {
        error(res, 'name y ownerId son requeridos', 400);
        return;
      }
      const project = await projectsService.create({ name, description, ownerId });
      success(res, project, 'Operación exitosa', 201);
    } catch (e: any) {
      if (e?.code === 'P2003') {
        error(res, 'El ownerId no existe en la base de datos', 400);
        return;
      }
      error(res, 'Error al crear el proyecto', 500);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as UpdateProjectDto;
      const project = await projectsService.update(req.params.id as string, { name, description });
      success(res, project);
    } catch (e: any) {
      if (e?.code === 'P2025') {
        error(res, 'Proyecto no encontrado', 404);
        return;
      }
      error(res, 'Error al actualizar el proyecto', 500);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await projectsService.remove(req.params.id as string);
      success(res, undefined, 'Operación exitosa', 200);
    } catch (e: any) {
      if (e?.code === 'P2025') {
        error(res, 'Proyecto no encontrado', 404);
        return;
      }
      error(res, 'Error al eliminar el proyecto', 500);
    }
  },
};
