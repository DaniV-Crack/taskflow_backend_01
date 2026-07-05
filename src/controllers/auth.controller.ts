import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../types/auth.types";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body as RegisterDto);
      res.status(201).json(result);
    } catch (e: any) {
      res
        .status(e?.status ?? 500)
        .json({ error: e?.message ?? "Error al registrar" });
    }
  },
  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body as LoginDto);
      res.json(result);
    } catch (e: any) {
      res
        .status(e?.status ?? 500)
        .json({ error: e?.message ?? "Error al iniciar sesión" });
    }
  },

  // req.user fue adjuntado por el authMiddleware
  async me(req: Request, res: Response): Promise<void> {
    res.json({ data: req.user });
  },
};
