import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../types/auth.types";
import { success, error } from "../utils/api-response";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const result = await authService.register(dto);
      success(res, result, 'Operación exitosa', 201);
    } catch (e: any) {
      error(res, e?.message ?? 'Error al registrar', e?.status ?? 500);
    }
  },
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const result = await authService.login(dto);
      success(res, result);
    } catch (e: any) {
      error(res, e?.message ?? 'Error al iniciar sesión', e?.status ?? 500);
    }
  },

  // req.user fue adjuntado por el authMiddleware
  async me(req: Request, res: Response): Promise<void> {
    try {
      success(res, req.user);
    } catch (e: any) {
      error(res, 'Error al obtener el usuario', 500);
    }
  },
};
