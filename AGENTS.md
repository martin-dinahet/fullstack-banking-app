# AGENTS.md

## Available Skills

The model should **always proactively load and use** relevant skills when working on matching tasks. Available skills are listed in the system prompt. Check available skills there and load them via the `skill` tool before working on matching tasks.

## Architecture

- **Frontend**: Vite + React 19 + TypeScript (`/frontend`)
- **Backend**: Symfony 8.0 + PHP 8.4 + Doctrine ORM (`/backend`)
- **Infra**: Docker Compose + Nginx reverse proxy

## Commands

### Frontend (cd frontend)
```sh
npm run dev       # dev server (localhost:5173)
npm run typecheck
npm run lint
npm run test      # Vitest
npm run build
```

### Backend (Docker)
```sh
make dev         # start dev environment
make dev-d       # detached mode
make down        # stop containers
make logs        # tail all logs
make migrate    # run migrations
make migrate-new
make fixtures   # load fixtures
```

The backend uses PHP 8.4 (latest). Run Symfony console via:
```sh
docker compose exec backend php /var/www/html/bin/console <command>
```

## CI

Frontend only. Runs: `npm run lint` -> `npm run typecheck` -> `npm run test`

## Key Files

- `frontend/biome.json` - lint/format config
- `compose.yaml`, `compose.dev.yaml` - Docker config
- `/backend/config/packages/` - Symfony packages

## Frontend Architecture

**Feature-based structure** (`src/features/<feature>/`):
- `components/` - React components
- `api/` - API fetch functions
- `hooks/` - TanStack Query hooks

Currently only `health` feature exists - add new features following this pattern.

**Routing**: React Router 7, single route at `/`. Add routes in `main.tsx`.

## Data Layer

The frontend uses **TanStack Query** for data fetching with this pattern:

### 1. API Fetch Function (`features/<feature>/api/<name>.api.ts`)
```ts
import { fetchClient } from "@/lib/api-fetch";

export interface ResponseType { /* ... */ }

export async function fetchData(): Promise<ResponseType> {
  return fetchClient<ResponseType>("/api/endpoint");
}
```

### 2. Query Hook (`features/<feature>/hooks/use-<name>.ts`)
```ts
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../api/name.api";

export const dataKeys = {
  all: ["data"] as const,
  list: () => [...dataKeys.all, "list"] as const,
};

export function useData() {
  return useQuery({
    queryKey: dataKeys.list(),
    queryFn: fetchData,
  });
}
```

### 3. Use in Component
```ts
const { data, isLoading, error } = useData();
```

### Key Files

- `lib/query-client.ts` - QueryClient with default options (staleTime: 1min, retry: 2)
- `lib/api-fetch.ts` - `fetchClient` wrapper that:
  - Always includes `credentials: "include"` (cookies)
  - Always sets `Content-Type: application/json`
  - Throws on non-OK responses
  - Parses response as JSON

- `main.tsx` - Wraps app with `QueryClientProvider`

**Pages**: `src/pages/` - route components

**Shared UI**: `src/components/ui/` - shadcn components

## Backend Architecture

- **Controllers**: `src/Controller/` - AuthController, CategoryController, OperationController, HealthController
- **Entities**: `src/Entity/` - User, Category, Operation (Doctrine ORM)
- **Repositories**: `src/Repository/`

## Tech Stack

- React 19, React Router 7, TanStack Query
- shadcn/ui, Tailwind CSS 4
- Biome for lint/format
- Vitest for testing
- LexikJWT for authentication