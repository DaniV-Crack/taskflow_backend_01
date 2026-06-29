import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { usersService } from "../services/users.service";
import { CreateUserDto, UpdateUserDto } from "../types/users.types";

export const usersController = {
  // GET /api/users — Lista todos los usuarios
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await usersService.findAll();
      res.json({ data: users, count: users.length });
    } catch (error) {
      console.error("Error en getAll:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },

  // GET /api/users/:id — Obtiene un usuario por su ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await usersService.findById(req.params.id as string);
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.json({ data: user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2023") {
        res.status(400).json({ error: "ID de usuario inválido" });
        return;
      }
      console.error("Error en getById:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  },
  
  // POST /api/users — Crea un nuevo usuario
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as CreateUserDto;
      // Validación básica de campos requeridos
      if (!name || !email || !password) {
        res
          .status(400)
          .json({ error: "name, email y password son requeridos" });
        return;
      }
      // Verificar que el email no exista ya
      const exists = await usersService.existsByEmail(email);
      if (exists) {
        res.status(409).json({ error: "El email ya está registrado" });
        return;
      }
      const user = await usersService.create({ name, email, password });
      res.status(201).json({ data: user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        res.status(409).json({ error: "El email ya está registrado" });
        return;
      }
      console.error("Error en create:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  },
  
  // PUT /api/users/:id — Actualiza un usuario
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as UpdateUserDto;
      if (name === undefined && email === undefined) {
        res.status(400).json({ error: "Se requiere al menos name o email para actualizar" });
        return;
      }
      const user = await usersService.update(req.params.id as string, { name, email });
      res.json({ data: user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ error: "Usuario no encontrado" });
          return;
        }
        if (error.code === "P2002") {
          res.status(409).json({ error: "El email ya está registrado por otro usuario" });
          return;
        }
        if (error.code === "P2023") {
          res.status(400).json({ error: "ID de usuario inválido" });
          return;
        }
      }
      console.error("Error en update:", error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  },

  // DELETE /api/users/:id — Elimina un usuario
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await usersService.remove(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ error: "Usuario no encontrado" });
          return;
        }
        if (error.code === "P2023") {
          res.status(400).json({ error: "ID de usuario inválido" });
          return;
        }
      }
      console.error("Error en remove:", error);
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  },
};
