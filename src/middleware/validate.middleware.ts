import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Recibe un schema Zod y retorna un middleware que valida el request
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.slice(1).join("."),
        message: e.message,
      }));
      res
        .status(400)
        .json({ error: "Datos de entrada inválidos", details: errors });
      return;
    }
    next();
  };
