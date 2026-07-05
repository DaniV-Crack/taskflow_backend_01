import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { CreateUserDto, UpdateUserDto, UserPublic } from "../types/users.types";
import bcrypt from 'bcryptjs';

// Objeto que define qué campos devolver (excluye passwordHash)
const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const usersService = {
  // Retorna todos los usuarios, del más reciente al más antiguo
  async findAll(): Promise<UserPublic[]> {
    // 1. Consultar todos los usuarios excluyendo passwordHash, ordenados por fecha descendente
    return prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
    });
  },

  // Busca un usuario por su UUID. Retorna null si no existe.
  async findById(id: string): Promise<UserPublic | null> {
    // 1. Buscar usuario por ID, excluyendo passwordHash del resultado
    return prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  },

  // Crea un usuario.
  async create(data: CreateUserDto): Promise<UserPublic> {
    // 1. Hashear la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(data.password, 10);
    // 2. Crear el usuario en la base de datos
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: USER_SELECT,
    });
  },

  // Actualiza solo los campos que se envíen (name y/o email)
  async update(id: string, data: UpdateUserDto): Promise<UserPublic> {
    // 1. Actualizar el usuario que coincida con el ID usando los campos enviados
    return prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  },

  // Elimina el usuario. Prisma lanza P2025 si no existe.
  async remove(id: string): Promise<void> {
    // 1. Eliminar usuario por ID
    await prisma.user.delete({ where: { id } });
  },

  // Verifica si un email ya está registrado (para evitar duplicados)
  async existsByEmail(email: string): Promise<boolean> {
    // 1. Buscar usuario por email
    const user = await prisma.user.findUnique({ where: { email } });
    // 2. Retornar true si existe, false si no
    return user !== null;
  },
};
