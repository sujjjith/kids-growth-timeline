# Research: Azure Full-Stack Migration

**Feature**: 001-azure-fullstack-migration
**Date**: 2026-04-14

## Research Tasks Resolved

### R-001: Backend Framework Selection

- **Decision**: NestJS 11 with TypeORM
- **Rationale**: NestJS provides opinionated structure (modules, controllers, services), built-in Passport.js integration for auth, class-validator for DTOs, and first-class TypeScript support. TypeORM is NestJS-native with PostgreSQL support and decorator-based entity definitions.
- **Alternatives considered**: Express.js (too unstructured for 10 entity modules), Fastify (less ecosystem for auth/validation), Prisma (adds code generation step; TypeORM is simpler for direct entity definitions)

### R-002: Authentication Strategy

- **Decision**: Google OAuth 2.0 via `passport-google-oauth20` + JWT session tokens
- **Rationale**: User explicitly wants Gmail login. Passport.js has a mature Google strategy. JWT tokens (stored in localStorage) avoid server-side session storage, keeping the backend stateless for scale-to-zero.
- **Alternatives considered**: Session cookies (requires session store, problematic with scale-to-zero), Firebase Auth (external dependency, overkill), Azure AD B2C (enterprise-focused, complex setup for personal project)
- **Flow**: Frontend redirects to `/api/auth/google` → Google consent → callback to `/api/auth/google/callback` → backend creates/finds user → issues JWT → redirects to frontend with token in URL fragment → frontend stores token and uses in Authorization header

### R-003: Infrastructure as Code

- **Decision**: Bicep modules
- **Rationale**: User chose "whichever is easy" — Bicep is native to Azure, no external tooling required, simpler syntax than ARM templates, and integrates with `az deployment` directly.
- **Alternatives considered**: Terraform (more portable but requires state management; overkill for single-cloud personal project), Pulumi (good but extra runtime dependency), ARM templates (verbose)

### R-004: Frontend Data Layer Migration

- **Decision**: Replace OSDK hooks with React Query + Axios
- **Rationale**: The app already uses React Query patterns via OSDK. Replacing `useOsdkObjects()` with custom `useQuery()` hooks backed by Axios keeps the same reactive data pattern. Axios provides interceptors for JWT injection.
- **Alternatives considered**: SWR (less feature-rich than React Query for mutations), fetch API (no interceptor pattern, more boilerplate)

### R-005: Photo Storage

- **Decision**: Azure Blob Storage with SAS token URLs
- **Rationale**: Cheapest Azure storage option (Standard LRS). Backend generates time-limited SAS URLs for reads. Uploads go through the backend (multipart form) to validate type/size and record metadata in PostgreSQL.
- **Alternatives considered**: Store photos in PostgreSQL (bad for binary data, bloats DB), Azure CDN (unnecessary for single-user)

### R-006: Container Orchestration

- **Decision**: Azure Container Apps (Consumption plan) with Azure Container Registry (Basic tier)
- **Rationale**: Container Apps provides scale-to-zero (min replicas = 0), built-in ingress, managed TLS, and consumption billing. Basic ACR is $0.167/day (~$5/mo). Docker image built in CI and pushed to ACR.
- **Alternatives considered**: Azure App Service (no scale-to-zero on free tier for containers), AKS (massive overkill), Azure Functions (doesn't suit a full NestJS API)

### R-007: Database Choice

- **Decision**: Azure Database for PostgreSQL Flexible Server, B1ms SKU
- **Rationale**: B1ms is the cheapest production-capable tier (~$12/mo). Flexible Server supports automatic backups, SSL, and connection pooling. TypeORM handles migrations and schema sync.
- **Alternatives considered**: Azure SQL (more expensive at comparable tiers), Cosmos DB (overkill for relational data with joins), Supabase (external dependency)

### R-008: CI/CD Pipeline Design

- **Decision**: Three GitHub Actions workflows (frontend, backend, infra)
- **Rationale**: Separate workflows allow independent deployments. Frontend uses the Azure Static Web Apps deploy action. Backend builds Docker, pushes to ACR, and updates Container App revision. Infra workflow runs Bicep deployment only when `infra/` files change.
- **Alternatives considered**: Single monolithic workflow (slower, deploys everything on any change), Azure DevOps Pipelines (unnecessary when already on GitHub)

### R-009: Timeline Event Auto-Generation

- **Decision**: Backend creates timeline events in service layer when any entity is created
- **Rationale**: Each entity service (education, activities, etc.) calls `timelineService.create()` after creating the entity. This ensures timeline consistency without requiring the frontend to make two API calls.
- **Alternatives considered**: Database triggers (harder to maintain, opaque), frontend double-post (fragile, race conditions), event-based (overkill for a personal app)

## All NEEDS CLARIFICATION items: Resolved

No outstanding unknowns remain.
