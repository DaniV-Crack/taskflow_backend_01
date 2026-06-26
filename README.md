# TaskFlow API

API REST para gestión de tareas, construida con **Express 5 + TypeScript 6 + PostgreSQL**.

## Stack tecnológico

| Tecnología  | Versión |
|-------------|---------|
| Node.js     | ^20     |
| Express     | 5.x     |
| TypeScript  | 6.x     |
| PostgreSQL  | 16.x    |
| pg (driver) | 8.x     |

## Proyecto actual (Clase 1)

### Estructura

```
src/
├── config/
│   └── database.ts      # Pool de conexiones a PostgreSQL
├── routes/
│   └── health.ts        # Endpoint GET /health
└── index.ts             # Punto de entrada: Express + middlewares
```

### Lo implementado

1. **Servidor Express** con TypeScript, tipado estricto y hot-reload via `ts-node-dev`.
2. **Conexión a PostgreSQL** usando `pg.Pool` con validación al arranque.
3. **Endpoint `GET /health`** — retorna estado del servidor y verifica conectividad con la BD ejecutando `SELECT NOW()`.
4. **Ruta raíz `GET /`** — informativa, lista los endpoints disponibles.
5. **Manejo de 404** para rutas no encontradas.
6. **Variables de entorno** mediante `dotenv` (`PORT`, `DATABASE_URL`, `NODE_ENV`).

### Comandos disponibles

```bash
npm run dev     # Desarrollo con hot-reload
npm run build   # Compilar a JS en dist/
npm start       # Producción: node dist/index.js
```

### Inicio rápido

```bash
cp .env.example .env   # Configurar DATABASE_URL
npm install
npm run dev
```
