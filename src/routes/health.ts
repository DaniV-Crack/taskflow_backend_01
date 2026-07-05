import { Router, Request, Response } from "express";
import pool from "../config/database";
import { success, error as sendError } from "../utils/api-response";
const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Sistema]
 *     summary: Verifica el estado del servidor y la conexión a la base de datos
 *     responses:
 *       200:
 *         description: Servidor y base de datos funcionando correctamente
 *       500:
 *         description: Error de conexión con la base de datos
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT NOW() as timestamp, version() as pg_version",
    );
    success(res, {
      server: {
        environment: process.env.NODE_ENV || "development",
      },
      database: {
        status: "connected",
        queryTimestamp: result.rows[0].timestamp,
      },
    }, "TaskFlow API funcionando correctamente");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    sendError(res, "Error al conectar con la base de datos", 500, message);
  }
});

export default router;
