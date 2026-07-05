import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { usersService } from "../services/users.service";
import { CreateUserDto, UpdateUserDto } from "../types/users.types";
import { success, error as sendError } from "../utils/api-response";

export const usersController = {
  // GET /api/users — Lista todos los usuarios
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await usersService.findAll();
      success(res, { items: users, count: users.length }, "Usuarios obtenidos correctamente");
    } catch (error) {
      console.error("Error en getAll:", error);
      sendError(res, "Error al obtener usuarios", 500);
    }
  },

  // GET /api/users/:id — Obtiene un usuario por su ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.findById(req.params.id as string);
      if (!user) {
        sendError(res, "Usuario no encontrado", 404);
        return;
      }
      success(res, user, "Usuario obtenido correctamente");
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2023") {
        sendError(res, "ID de usuario inválido", 400);
        return;
      }
      console.error("Error en getById:", error);
      sendError(res, "Error al obtener el usuario", 500);
    }
  },
  
  // POST /api/users — Crea un nuevo usuario
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserDto;
      if (!name || !email || !password) {
        sendError(res, "name, email y password son requeridos", 400);
        return;
      }
      const exists = await usersService.existsByEmail(email);
      if (exists) {
        sendError(res, "El email ya está registrado", 409);
        return;
      }
      const user = await usersService.create({ name, email, password });
      success(res, user, "Usuario creado exitosamente", 201);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        sendError(res, "El email ya está registrado", 409);
        return;
      }
      console.error("Error en create:", error);
      sendError(res, "Error al crear el usuario", 500);
    }
  },
  
  // PUT /api/users/:id — Actualiza un usuario
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as UpdateUserDto;
      if (name === undefined && email === undefined) {
        sendError(res, "Se requiere al menos name o email para actualizar", 400);
        return;
      }
      const user = await usersService.update(req.params.id as string, { name, email });
      success(res, user, "Usuario actualizado correctamente");
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          sendError(res, "Usuario no encontrado", 404);
          return;
        }
        if (error.code === "P2002") {
          sendError(res, "El email ya está registrado por otro usuario", 409);
          return;
        }
        if (error.code === "P2023") {
          sendError(res, "ID de usuario inválido", 400);
          return;
        }
      }
      console.error("Error en update:", error);
      sendError(res, "Error al actualizar el usuario", 500);
    }
  },

  // DELETE /api/users/:id — Elimina un usuario
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await usersService.remove(req.params.id as string);
      success(res, null, "Usuario eliminado correctamente", 200);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          sendError(res, "Usuario no encontrado", 404);
          return;
        }
        if (error.code === "P2023") {
          sendError(res, "ID de usuario inválido", 400);
          return;
        }
      }
      console.error("Error en remove:", error);
      sendError(res, "Error al eliminar el usuario", 500);
    }
  },
};
