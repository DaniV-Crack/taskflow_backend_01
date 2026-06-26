# taskflow-api

## Quick start
- **Dev server (hot-reload):** `npm run dev` — uses `ts-node-dev --respawn --transpile-only src/index.ts`
- **Build:** `npm run build` — outputs to `dist/`
- **Production start:** `npm start` — runs `node dist/index.js`

## Environment
- Copy `.env.example` to `.env` and adjust `DATABASE_URL` for local PostgreSQL
- Required vars: `PORT`, `DATABASE_URL`, `NODE_ENV`
- App loads `.env` automatically via `dotenv.config()` in `src/index.ts`

## Architecture
- Entrypoint: `src/index.ts` — creates Express app, registers middleware (cors, json, urlencoded), mounts routes, starts server
- Routes directory: `src/routes/` — exports Express `Router` instances
- DB config: `src/config/database.ts` — `pg.Pool` from `DATABASE_URL`
- Only route currently: `GET /health` (queries `SELECT NOW()` against DB)
- All user-facing messages in Spanish

## Notable versions
- Express 5.x, TypeScript 6.x — verify API compatibility if adding middleware/patterns

## Missing (not yet set up)
- **Testing:** `npm test` is a placeholder; no test framework installed
- **Linting:** No ESLint configured
- **Formatting:** No Prettier configured
- **CI/CD:** No pipelines configured
