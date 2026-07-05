import { Request, Response, NextFunction } from "express";

// IMPORTANTE: el error middleware DEBE tener 4 parámetros para que Express lo reconozca
export const errorMiddleware = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error no manejado:", error);
  
  // Si el error tiene status personalizado (como los que lanzamos en los services)
  if (error?.status) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  // Error genérico de servidor
  res.status(500).json({ error: "Error interno del servidor" });
};
