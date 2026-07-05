import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponse } from "../utils/api-response";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    
    if (!result.success) {
      const details = result.error.issues.map((e) => ({
        field: e.path.slice(1).join("."),
        message: e.message,
      }));
      const body: ApiResponse = {
        status: 400,
        message: "Datos de entrada inválidos",
        data: { details },
        error: "VALIDATION_ERROR",
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(body);
      return;
    }
    next();
  };
