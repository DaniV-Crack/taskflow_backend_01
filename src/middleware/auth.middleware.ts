import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";

// Esto le dice a TypeScript que Express.Request tiene un campo 'user' opcional
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  
  // Verificar que el header existe y tiene el formato correcto
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token de autenticación requerido" });
    return;
  }
  
  // Extraer el token (eliminar el prefijo 'Bearer ')
  const token = authHeader.split(" ")[1];
  try {
    // Verificar la firma del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; // Adjuntar datos del usuario
    next(); // Continuar al siguiente middleware/handler
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
