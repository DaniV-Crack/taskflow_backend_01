# TaskFlow API

API REST para gestión de tareas, construida con **Express 5 + TypeScript 6 + PostgreSQL + Prisma**.

## Stack tecnológico

| Tecnología     | Versión |
|----------------|---------|
| Node.js        | ^20     |
| Express        | 5.x     |
| TypeScript     | 6.x     |
| PostgreSQL     | 16.x    |
| Prisma         | 7.x     |
| Swagger        | 3.x     |

## Estructura del proyecto

```
src/
├── config/
│   ├── database.ts       # Pool de conexiones a PostgreSQL (legacy)
│   ├── prisma.ts         # Cliente Prisma singleton con adapter-pg
│   └── swagger.ts        # Configuración de OpenAPI/Swagger
├── controllers/
│   ├── users.controller.ts
│   └── projects.controller.ts
├── routes/
│   ├── health.ts         # GET /health
│   ├── users.ts          # CRUD /api/users
│   └── projects.ts       # CRUD /api/projects
├── services/
│   ├── users.service.ts
│   └── projects.service.ts
├── types/
│   ├── users.types.ts
│   └── projects.types.ts
└── index.ts              # Punto de entrada: Express + middlewares
```

## Endpoints

### Salud

| Método | Ruta      | Descripción                        | Códigos HTTP               |
|--------|-----------|------------------------------------|----------------------------|
| GET    | `/health` | Estado del servidor y conectividad BD | 200, 500                 |

### Usuarios (`/api/users`)

| Método | Ruta      | Descripción          | Códigos HTTP                          |
|--------|-----------|----------------------|---------------------------------------|
| GET    | `/`       | Listar usuarios      | 200, 500                              |
| GET    | `/:id`    | Obtener usuario por ID | 200, 404, 400, 500                  |
| POST   | `/`       | Crear usuario        | 201, 400, 409, 500                    |
| PUT    | `/:id`    | Actualizar usuario   | 200, 400, 404, 409, 500               |
| DELETE | `/:id`    | Eliminar usuario     | 204, 404, 400, 500                    |

### Proyectos (`/api/projects`)

| Método | Ruta      | Descripción           | Códigos HTTP                          |
|--------|-----------|-----------------------|---------------------------------------|
| GET    | `/`       | Listar proyectos      | 200, 500                              |
| GET    | `/:id`    | Obtener proyecto por ID | 200, 404, 400, 500                  |
| POST   | `/`       | Crear proyecto        | 201, 400, 404, 500                    |
| PUT    | `/:id`    | Actualizar proyecto   | 200, 400, 404, 500                    |
| DELETE | `/:id`    | Eliminar proyecto     | 204, 404, 400, 500                    |

### Documentación

| Método | Ruta         | Descripción               |
|--------|--------------|---------------------------|
| GET    | `/api-docs`  | Swagger UI (OpenAPI 3.0) |

## Códigos HTTP utilizados

| Código | Significado               | Uso                                              |
|--------|---------------------------|--------------------------------------------------|
| 200    | OK                        | Respuestas exitosas GET/PUT                      |
| 201    | Created                   | Creación exitosa POST                            |
| 204    | No Content                | Eliminación exitosa DELETE                       |
| 400    | Bad Request               | Campos faltantes, UUID inválido (P2023)          |
| 404    | Not Found                 | Recurso no encontrado, ruta inexistente          |
| 409    | Conflict                  | Email duplicado (P2002)                          |
| 500    | Internal Server Error     | Error inesperado del servidor                    |

## Modelo de datos (Prisma)

- **User** — id (UUID), name, email (único), passwordHash, createdAt
- **Project** — id (UUID), name, description, ownerId → User, createdAt
- **Task** — id (UUID), title, description, status (TODO/IN_PROGRESS/DONE/CANCELLED), projectId → Project, assignedTo → User, createdAt
- **Comment** — id (UUID), content, taskId → Task, userId → User, createdAt

## Inicio rápido

```bash
cp .env.example .env   # Configurar DATABASE_URL
npm install
npx prisma migrate dev # Ejecutar migraciones
npm run dev            # Desarrollo con hot-reload
```

## Comandos

```bash
npm run dev     # Desarrollo con hot-reload (ts-node-dev)
npm run build   # Compilar a JS en dist/
npm start       # Producción: node dist/index.js
```
