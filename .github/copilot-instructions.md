# Copilot Instructions for Encantos do Forno

## Project Overview

Restaurant management system with **queue management**, **table reservations**, **menu catalog**, and **scheduling**. Monorepo with separate `backend/` (Express + Sequelize) and `frontend/` (React + Vite + Tailwind).

## Architecture

### Backend (Node.js/Express)

```
backend/
├── server.js          # Entry point - DB init, middleware, routes, cleanup jobs
├── routes/            # Express routers (clean routes export via index.js)
├── services/          # Business logic (BaseService pattern for CRUD)
├── Data/Tables/       # Sequelize models with instance methods
├── Data/associations.js  # Model relationships (Queue ↔ Tables ↔ Employees)
├── middleware/        # Auth (JWT), rate limiting, error handling
└── API/               # Additional routes (GET.js, POST.js, DELETE.js, EDIT.js)
```

### Frontend (React 19)

```
frontend/src/
├── App.jsx            # Router with ProtectedRoute for /admin/*
├── context/AuthContext.jsx  # JWT auth state (localStorage)
├── services/api.js    # Centralized API client
├── hooks/useApi.js    # Fetch hook with retry, timeout, polling
└── pages/admin/       # Admin dashboard (protected)
```

## Key Patterns

### Service Layer Pattern

Services in `backend/services/` encapsulate business logic. Extend `BaseService` for standard CRUD:

```javascript
// Example: backend/services/productService.js
const BaseService = require('./baseService');
const Product = require('../Data/Tables/Products');
class ProductService extends BaseService {
    constructor() {
        super(Product);
    }
    // Add domain-specific methods here
}
```

### Response Handler

Always use `responseHandler` from `backend/utils/responseHandler.js`:

```javascript
const { responseHandler } = require('../utils/responseHandler');
// Success: responseHandler.success(res, data, 'message')
// Created: responseHandler.created(res, data)
// Error:   responseHandler.error(res, error)
// Not found: responseHandler.notFound(res, 'message')
```

### Authentication

-   JWT tokens (7-day expiry) via `middleware/auth.js`
-   `authenticate` middleware for protected routes
-   `requireAdmin` middleware for admin-only operations
-   Frontend stores token in `localStorage`, verified via `/api/auth/me`

### Queue Service (Complex Domain)

`backend/services/queueService.js` is the most complex service:

-   Uses **Sequelize transactions** with `SERIALIZABLE` isolation for concurrent operations
-   Status flow: `waiting` → `called` → `seated` | `no_show` | `cancelled`
-   Auto-cleanup jobs run every 15 minutes (configured in `server.js`)
-   Daily stats aggregation at midnight

## Database (PostgreSQL via Sequelize)

-   Connection: `DATABASE_URL` env var in `backend/.env`
-   Models define instance methods (e.g., `Queue.prototype.markAsCalled()`)
-   Associations in `backend/Data/associations.js` - always import models before calling `setupAssociations()`
-   Sync with `{ alter: true }` - safe for adding columns

## Commands

```bash
# Backend (from backend/)
npm run backend          # Runs with --watch (auto-reload)

# Frontend (from frontend/)
npm run dev              # Vite dev server
npm run build            # Production build
npm run lint             # ESLint check
```

## API Conventions

-   All endpoints prefixed with `/api/`
-   Public queue endpoints: `/api/queue/info`, `POST /api/queue`, `/api/queue/status/:identifier`
-   Protected endpoints require `Authorization: Bearer <token>` header
-   Response format: `{ success: boolean, data?: any, message?: string, error?: string }`

## Frontend State Management

-   No Redux - uses React Context (`AuthContext`) and local state
-   `useApi` hook handles loading states, retries, and error classification
-   `usePolling` hook for real-time queue updates

## Environment Variables

**Backend** (`backend/.env`):

-   `DATABASE_URL` - PostgreSQL connection string
-   `JWT_SECRET` - Token signing key
-   `PORT` - Server port (default: 3000)

**Frontend** (`.env` or inline):

-   `VITE_API_URL` - Backend URL (default: `http://localhost:3000`)

## Code Style

-   Portuguese for user-facing strings and comments
-   English for code identifiers
-   JSDoc comments on service methods
-   Centralized exports via `index.js` files in `routes/`, `services/`, `middleware/`

## 🚨 Regras de Deploy e Ambiente (Adicionado para Produção)

1. **PROIBIDO Localhost Hardcoded:**
   - Nunca sugira ou escreva `http://localhost:3000` diretamente em arquivos do Frontend (Contexts, Pages, Components).
   - Sempre utilize a importação centralizada: `import { API_CONFIG } from '@/config/constants'` (ou caminho relativo).

2. **Configuração de CORS:**
   - Ao criar ou alterar o `server.js`, garanta que o middleware CORS esteja configurado para permitir explicitamente os métodos `PUT` e `DELETE`, pois alguns navegadores/proxies bloqueiam essas requisições sem a configuração correta de `Access-Control-Allow-Methods`.

3. **Arquitetura de API:**
   - O Frontend (Vercel) comunica-se com o Backend (Railway). Sempre assuma latência de rede e trate erros de conexão (ex: try/catch com feedback visual) em vez de apenas logar no console.