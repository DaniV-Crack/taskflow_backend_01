import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { projectsService } from "../services/projects.service";
import { CreateProjectDto, UpdateProjectDto } from "../types/projects.types";
import { success, error as sendError } from "../utils/api-response";

export const projectsController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectsService.findAll();
      success(res, { items: projects, count: projects.length }, "Proyectos obtenidos correctamente");
    } catch (error) {
      console.error("Error en getAll:", error);
      sendError(res, "Error al obtener proyectos", 500);
    }
  },
  
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectsService.findById(req.params.id as string);
      if (!project) {
        sendError(res, "Proyecto no encontrado", 404);
        return;
      }
      success(res, project, "Proyecto obtenido correctamente");
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2023") {
        sendError(res, "ID de proyecto inválido", 400);
        return;
      }
      console.error("Error en getById:", error);
      sendError(res, "Error al obtener el proyecto", 500);
    }
  },
  
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, ownerId } = req.body as CreateProjectDto;
      if (!name || !ownerId) {
        sendError(res, "name y ownerId son requeridos", 400);
        return;
      }
      const project = await projectsService.create({
        name,
        description,
        ownerId,
      });
      success(res, project, "Proyecto creado exitosamente", 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          sendError(res, "El usuario owner no existe", 404);
          return;
        }
        if (error.code === "P2023") {
          sendError(res, "ID de owner inválido", 400);
          return;
        }
      }
      console.error("Error en create:", error);
      sendError(res, "Error al crear el proyecto", 500);
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as UpdateProjectDto;
      if (name === undefined && description === undefined) {
        sendError(res, "Se requiere al menos name o description para actualizar", 400);
        return;
      }
      const project = await projectsService.update(req.params.id as string, {
        name,
        description,
      });
      success(res, project, "Proyecto actualizado correctamente");
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          sendError(res, "Proyecto no encontrado", 404);
          return;
        }
        if (error.code === "P2023") {
          sendError(res, "ID de proyecto inválido", 400);
          return;
        }
      }
      console.error("Error en update:", error);
      sendError(res, "Error al actualizar el proyecto", 500);
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await projectsService.remove(req.params.id as string);
      success(res, null, "Proyecto eliminado correctamente", 200);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          sendError(res, "Proyecto no encontrado", 404);
          return;
        }
        if (error.code === "P2023") {
          sendError(res, "ID de proyecto inválido", 400);
          return;
        }
      }
      console.error("Error en remove:", error);
      sendError(res, "Error al eliminar el proyecto", 500);
    }
  },
};
