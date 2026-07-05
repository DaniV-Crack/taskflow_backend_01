# TaskFlow API

API REST para gestión de tareas, construida con **Express 5 + TypeScript 6 + PostgreSQL + Prisma**. Incluye autenticación JWT, validación con Zod y documentación Swagger.

## Stack tecnológico

| Tecnología     | Versión |
|----------------|---------|
| Node.js        | ^20     |
| Express        | 5.x     |
| TypeScript     | 6.x     |
| PostgreSQL     | 16.x    |
| Prisma         | 7.x     |
| Swagger        | 3.x     |
| Zod            | 4.x     |

## Estructura del proyecto

```
src/
├── config/
│   ├── database.ts       # Pool pg (solo health check)
│   ├── prisma.ts         # Cliente Prisma singleton con adapter-pg
│   └── swagger.ts        # Configuración OpenAPI/Swagger
├── controllers/
│   ├── auth.controller.ts
│   ├── comments.controller.ts
│   ├── projects.controller.ts
│   ├── tasks.controller.ts
│   └── users.controller.ts
├── middleware/
│   ├── auth.middleware.ts     # JWT global (excluye register/login)
│   └── validate.middleware.ts # Validación con Zod
├── routes/
│   ├── health.ts         # GET /health
│   ├── auth.ts           # /api/auth
│   ├── users.ts          # /api/users
│   ├── projects.ts       # /api/projects
│   ├── tasks.ts          # /api/tasks
│   └── comments.ts       # /api/comments
├── schemas/
│   ├── auth.schemas.ts   # Zod: register, login
│   └── task.schemas.ts   # Zod: create, update
├── services/
│   ├── auth.service.ts
│   ├── comments.service.ts
│   ├── projects.service.ts
│   ├── tasks.service.ts
│   └── users.service.ts
├── types/
│   ├── auth.types.ts
│   ├── comments.types.ts
│   ├── projects.types.ts
│   ├── tasks.types.ts
│   └── users.types.ts
├── utils/
│   └── api-response.ts   # Formato uniforme de respuesta
└── index.ts              # Punto de entrada: Express + middlewares
```

## Variables de entorno

| Variable         | Descripción                              |
|------------------|------------------------------------------|
| `PORT`           | Puerto del servidor (default: 3000)      |
| `DATABASE_URL`   | Conexión a PostgreSQL                    |
| `NODE_ENV`       | `development` / `production`             |
| `JWT_SECRET`     | Secreto para firmar tokens (mín. 32 caracteres) |
| `JWT_EXPIRES_IN` | Duración del token (default: `7d`)       |

## Endpoints

### Sistema

| Método | Ruta       | Auth | Descripción                        | Códigos HTTP         |
|--------|------------|------|------------------------------------|----------------------|
| GET    | `/health`  | No   | Estado del servidor y BD           | 200, 500             |
| GET    | `/api-docs`| No   | Swagger UI                         | 200                  |

### Autenticación (`/api/auth`)

| Método | Ruta         | Auth | Descripción                  | Códigos HTTP              |
|--------|--------------|------|------------------------------|---------------------------|
| POST   | `/register`  | No   | Registrar nuevo usuario      | 201, 400, 409, 500        |
| POST   | `/login`     | No   | Iniciar sesión               | 200, 400, 401, 500        |
| GET    | `/me`        | Sí   | Perfil del usuario autenticado | 200, 401               |

### Usuarios (`/api/users`)

| Método | Ruta      | Auth | Descripción             | Códigos HTTP                          |
|--------|-----------|------|-------------------------|---------------------------------------|
| GET    | `/`       | Sí   | Listar usuarios         | 200, 500                              |
| GET    | `/:id`    | Sí   | Obtener usuario por ID  | 200, 404, 400, 500                    |
| POST   | `/`       | Sí   | Crear usuario           | 201, 400, 409, 500                    |
| PUT    | `/:id`    | Sí   | Actualizar usuario      | 200, 400, 404, 409, 500               |
| DELETE | `/:id`    | Sí   | Eliminar usuario        | 200, 404, 400, 500                    |

### Proyectos (`/api/projects`)

| Método | Ruta      | Auth | Descripción               | Códigos HTTP                          |
|--------|-----------|------|---------------------------|---------------------------------------|
| GET    | `/`       | Sí   | Listar proyectos          | 200, 500                              |
| GET    | `/:id`    | Sí   | Obtener proyecto por ID   | 200, 404, 400, 500                    |
| POST   | `/`       | Sí   | Crear proyecto            | 201, 400, 404, 500                    |
| PUT    | `/:id`    | Sí   | Actualizar proyecto       | 200, 400, 404, 500                    |
| DELETE | `/:id`    | Sí   | Eliminar proyecto         | 200, 404, 400, 500                    |

### Tareas (`/api/tasks`)

| Método | Ruta                    | Auth | Descripción                | Códigos HTTP                          |
|--------|-------------------------|------|----------------------------|---------------------------------------|
| GET    | `/project/:projectId`   | Sí   | Listar tareas de un proyecto | 200, 400, 401, 500                 |
| GET    | `/:id`                  | Sí   | Obtener tarea por ID       | 200, 400, 401, 404, 500              |
| POST   | `/`                     | Sí   | Crear tarea (solo owner del proyecto) | 201, 400, 401, 403, 404, 500 |
| PUT    | `/:id`                  | Sí   | Actualizar tarea           | 200, 400, 401, 403, 404, 500         |
| DELETE | `/:id`                  | Sí   | Eliminar tarea (solo owner) | 200, 400, 401, 403, 404, 500       |

### Comentarios (`/api/comments`)

| Método | Ruta                 | Auth | Descripción                    | Códigos HTTP                          |
|--------|----------------------|------|--------------------------------|---------------------------------------|
| GET    | `/task/:taskId`      | Sí   | Listar comentarios de una tarea | 200, 401, 500                      |
| POST   | `/`                  | Sí   | Crear comentario               | 201, 401, 404, 500                   |
| DELETE | `/:id`               | Sí   | Eliminar comentario (solo autor) | 200, 401, 403, 404, 500            |

## Códigos HTTP utilizados

| Código | Significado           | Uso                                               |
|--------|-----------------------|---------------------------------------------------|
| 200    | OK                    | Respuestas exitosas GET/PUT/DELETE                |
| 201    | Created               | Creación exitosa POST                             |
| 400    | Bad Request           | Campos faltantes, UUID inválido, validación Zod   |
| 401    | Unauthorized          | Token ausente, inválido o expirado                |
| 403    | Forbidden             | Sin permisos para la operación                    |
| 404    | Not Found             | Recurso no encontrado                             |
| 409    | Conflict              | Email duplicado (P2002)                           |
| 500    | Internal Server Error | Error inesperado del servidor                     |

## Modelo de datos (Prisma)

```
User (users)
├── id: String (UUID, PK)
├── name: String
├── email: String (único)
├── passwordHash: String
├── createdAt: DateTime
├── ownedProjects: Project[]      (1:N)
├── assignedTasks: Task[]        (1:N)
└── comments: Comment[]          (1:N)

Project (projects)
├── id: String (UUID, PK)
├── name: String
├── description: String?
├── ownerId: String (FK → User)
├── createdAt: DateTime
└── tasks: Task[]                 (1:N, cascade delete)

Task (tasks)
├── id: String (UUID, PK)
├── title: String
├── description: String?
├── status: TaskStatus (TODO | IN_PROGRESS | DONE | CANCELLED)
├── projectId: String (FK → Project, cascade delete)
├── assignedTo: String? (FK → User, SET NULL)
├── createdAt: DateTime
└── comments: Comment[]           (1:N, cascade delete)

Comment (comments)
├── id: String (UUID, PK)
├── content: String
├── taskId: String (FK → Task, cascade delete)
├── userId: String (FK → User, cascade delete)
└── createdAt: DateTime
```

## Reglas de autorización

- **Tareas:** Solo el owner del proyecto puede crear/eliminar tareas. El owner o el usuario asignado pueden actualizar el estado.
- **Comentarios:** Solo el autor del comentario puede eliminarlo.
- **Autenticación global:** Todos los endpoints bajo `/api` requieren JWT, excepto `POST /api/auth/register` y `POST /api/auth/login`.

## Inicio rápido

```bash
cp .env.example .env   # Configurar DATABASE_URL y JWT_SECRET
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
