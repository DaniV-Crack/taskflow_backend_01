import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../types/auth.types";
import { success, error } from "../utils/api-response";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body as RegisterDto);
      success(res, result, "Usuario registrado exitosamente", 201);
    } catch (e: any) {
      error(res, e?.message ?? "Error al registrar", e?.status ?? 500);
    }
  },
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body as LoginDto);
      success(res, result, "Inicio de sesión exitoso");
    } catch (e: any) {
      error(res, e?.message ?? "Error al iniciar sesión", e?.status ?? 500);
    }
  },

  // req.user fue adjuntado por el authMiddleware
  async me(req: Request, res: Response): Promise<void> {
    success(res, req.user, "Usuario autenticado");
  },
};
