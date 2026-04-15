<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0 (initial ratification)
- Added principles: Monorepo Structure, API-First, Security-by-Default,
  Cost-Conscious Infrastructure, Simplicity & YAGNI, Test Coverage,
  Design System Fidelity
- Added sections: Technology Stack, Development Workflow
- Templates requiring updates: ✅ constitution.md (this file)
- Follow-up TODOs: none
-->

# Kids Growth Timeline Hub Constitution

## Core Principles

### I. Monorepo Structure

The project MUST be organized as an npm workspaces monorepo with two packages:

- `frontend/` — React 19 SPA (Vite, TailwindCSS, Radix UI, Recharts)
- `backend/` — NestJS API (TypeORM, PostgreSQL, Passport.js)

Each package MUST build, lint, and test independently. Shared types
between frontend and backend MUST be defined in backend DTOs and
replicated as TypeScript interfaces in the frontend API layer — no
shared package required for a personal project.

### II. API-First

All data access MUST flow through RESTful endpoints served by the
NestJS backend. The React frontend MUST NOT access the database
directly. Every endpoint MUST:

- Accept and return JSON
- Use DTOs validated with `class-validator`
- Be protected by a JWT auth guard (except `/api/auth/*` routes)
- Follow the pattern: `GET/POST /api/{resource}`,
  `GET/PUT/DELETE /api/{resource}/:id`

### III. Security-by-Default

- Authentication MUST use Google OAuth 2.0 via Passport.js, issuing
  JWT tokens for session management
- All entity queries MUST be scoped to the authenticated user's
  `userId` — no cross-tenant data leaks
- File uploads MUST be validated for type and size before storage
- Secrets (JWT_SECRET, GOOGLE_CLIENT_SECRET, DB passwords) MUST
  NEVER appear in source code; use environment variables and Azure
  Key Vault references in production
- CORS MUST whitelist only the Static Web App origin in production

### IV. Cost-Conscious Infrastructure

This is a personal/family project. Infrastructure choices MUST
prioritize free or minimal-cost Azure tiers:

- Azure Static Web Apps: Free tier
- Azure Container Apps: Consumption plan (scale-to-zero, min 0 / max 1)
- Azure Database for PostgreSQL: Flexible Server B1ms
- Azure Blob Storage: Standard LRS
- Azure Container Registry: Basic tier

All infrastructure MUST be defined as Bicep modules and deployed
via GitHub Actions. No manual Azure Portal provisioning.

### V. Simplicity & YAGNI

- Do not add abstractions, helpers, or patterns unless they serve
  an immediate, concrete need
- Prefer direct TypeORM repository calls in services over generic
  repository patterns
- Prefer a flat module structure in NestJS (one module per entity)
  over deeply nested hierarchies
- The frontend migration MUST preserve existing UI components and
  design system — change only the data layer (OSDK → REST/React Query)

### VI. Test Coverage

- Backend: Each NestJS service MUST have unit tests for core CRUD
  operations using Jest
- Frontend: Critical user flows (login, create kid, add record)
  SHOULD have integration tests with React Testing Library
- CI pipelines MUST run tests before deployment; failing tests
  block deployment

### VII. Design System Fidelity

The existing design system (Warm Parchment palette, Fraunces/Source
Sans 3 fonts, saffron accent, living timeline spine) MUST be preserved
during migration. UI changes are limited to:

- Replacing OSDK data hooks with React Query hooks
- Making the kid list dynamic (API-driven instead of hardcoded)
- Adding auth UI (Google login, user avatar, logout)
- Adding optional photo upload fields to the QuickAddDialog

## Technology Stack

| Layer              | Technology                        | Version |
| ------------------ | --------------------------------- | ------- |
| Frontend framework | React                             | 19.x    |
| Frontend build     | Vite                              | 7.x     |
| Frontend styling   | TailwindCSS 4, Radix UI, Shadcn   | latest  |
| Frontend state     | TanStack React Query              | 5.x     |
| Frontend routing   | React Router DOM                  | 6.x     |
| Backend framework  | NestJS                            | 11.x    |
| ORM                | TypeORM                           | 0.3.x   |
| Database           | PostgreSQL                        | 16      |
| Auth               | Passport.js (Google OAuth2 + JWT) | latest  |
| File storage       | Azure Blob Storage SDK            | latest  |
| IaC                | Bicep                             | latest  |
| CI/CD              | GitHub Actions                    | —       |
| Container runtime  | Docker (Node 20 Alpine)           | —       |

## Development Workflow

1. **Local development**: Docker Compose provides PostgreSQL.
   Frontend runs via `npm run dev` (Vite with API proxy to backend).
   Backend runs via `npm run start:dev` (NestJS watch mode).
2. **Feature branches**: All work on feature branches; merge to `main`
   via pull request.
3. **CI pipeline**: On push to any branch — lint, type-check, test.
   On merge to `main` — build and deploy (frontend to Static Web Apps,
   backend Docker image to ACR → Container Apps).
4. **Infrastructure changes**: Bicep modules in `infra/`. Changes
   deployed via a separate GitHub Actions workflow (manual trigger or
   push to `infra/**`).

## Governance

This constitution is the authoritative guide for all development
decisions in this project. It supersedes ad-hoc decisions and prior
Palantir-era conventions. Amendments MUST:

- Be documented with a version bump in this file
- Include a Sync Impact Report (HTML comment at top)
- Update dependent templates if principles change

**Version**: 1.0.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-14
