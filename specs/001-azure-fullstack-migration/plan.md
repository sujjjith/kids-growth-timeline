# Implementation Plan: Azure Full-Stack Migration

**Branch**: `001-azure-fullstack-migration` | **Date**: 2026-04-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-azure-fullstack-migration/spec.md`

## Summary

Migrate an existing Palantir OSDK-powered React SPA to a self-hosted Azure full-stack architecture. The frontend remains React 19 / Vite / TailwindCSS but replaces OSDK data hooks with React Query backed by a new NestJS REST API. The backend uses TypeORM with PostgreSQL for persistence and Azure Blob Storage for photo uploads. Authentication switches from Palantir OAuth to Google OAuth 2.0 via Passport.js with JWT session tokens. Infrastructure is defined as Bicep modules and deployed via GitHub Actions CI/CD.

## Technical Context

**Language/Version**: TypeScript 5.9 (frontend and backend)
**Primary Dependencies**: React 19, Vite 7, TailwindCSS 4, Radix UI, Recharts, React Query 5 (frontend); NestJS 11, TypeORM, Passport.js, class-validator (backend)
**Storage**: PostgreSQL 16 (Azure Flexible Server B1ms), Azure Blob Storage (Standard LRS)
**Testing**: Jest + React Testing Library (frontend), Jest (backend unit tests)
**Target Platform**: Azure Static Web Apps (frontend SPA), Azure Container Apps (backend Docker container)
**Project Type**: web-application (SPA + REST API)
**Performance Goals**: Dashboard load < 3s, API responses < 500ms p95, cold start < 15s
**Constraints**: < $25/month Azure cost, scale-to-zero backend, free-tier frontend hosting
**Scale/Scope**: Single-user household (1-5 kids), ~10 screens, ~25 API endpoints

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                         | Status  | Evidence                                                                         |
| --------------------------------- | ------- | -------------------------------------------------------------------------------- |
| I. Monorepo Structure             | ✅ PASS | npm workspaces with `frontend/` and `backend/` packages                          |
| II. API-First                     | ✅ PASS | All OSDK calls replaced with REST endpoints; frontend uses React Query           |
| III. Security-by-Default          | ✅ PASS | Google OAuth + JWT; userId-scoped queries; env vars for secrets; CORS whitelist  |
| IV. Cost-Conscious Infrastructure | ✅ PASS | Free SWA, consumption Container Apps, B1ms PG, Basic ACR, Standard LRS blob      |
| V. Simplicity & YAGNI             | ✅ PASS | Direct TypeORM repositories; flat NestJS modules; no shared package              |
| VI. Test Coverage                 | ✅ PASS | Jest unit tests per service; RTL integration tests for critical flows; CI gating |
| VII. Design System Fidelity       | ✅ PASS | Only data layer changes; preserve palette, fonts, timeline spine, layout         |

No violations. All principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/001-azure-fullstack-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (REST API contracts)
│   └── api.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
frontend/                          # React 19 SPA (moved from src/)
├── public/
├── src/
│   ├── api/                       # NEW: API client layer (replaces OSDK)
│   │   ├── client.ts              # Axios instance with JWT interceptor
│   │   ├── auth.ts                # Google OAuth flow helpers
│   │   └── hooks/                 # React Query hooks per entity
│   │       ├── useKids.ts
│   │       ├── useEducation.ts
│   │       ├── useActivities.ts
│   │       ├── useCompetitions.ts
│   │       ├── useCamps.ts
│   │       ├── useTrips.ts
│   │       ├── useGrowth.ts
│   │       ├── useTimeline.ts
│   │       └── usePhotos.ts
│   ├── components/                # EXISTING: migrated from src/components/
│   │   ├── AppLayout.tsx          # MODIFIED: dynamic kid sidebar from API
│   │   ├── QuickAddDialog.tsx     # MODIFIED: calls REST instead of OSDK
│   │   └── ui/                    # UNCHANGED: all Radix/Shadcn components
│   ├── hooks/                     # EXISTING: use-mobile.ts
│   ├── lib/                       # EXISTING: constants.ts, utils.ts
│   ├── pages/                     # EXISTING: migrated from src/pages/
│   │   ├── Dashboard.tsx          # MODIFIED: React Query instead of OSDK
│   │   ├── GrowthCharts.tsx       # MODIFIED: React Query instead of OSDK
│   │   ├── KidProfile.tsx         # MODIFIED: React Query instead of OSDK
│   │   └── Timeline.tsx           # MODIFIED: React Query instead of OSDK
│   ├── styles/                    # EXISTING: globals.css
│   ├── Home.tsx                   # MODIFIED: auth-aware landing
│   ├── main.tsx                   # MODIFIED: QueryClientProvider wrapping
│   └── router.tsx                 # MODIFIED: auth guard routes
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json

backend/                           # NEW: NestJS 11 API
├── src/
│   ├── auth/                      # Google OAuth + JWT
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── google.strategy.ts
│   │   └── jwt.strategy.ts
│   ├── kids/                      # Kid profiles CRUD
│   │   ├── kids.module.ts
│   │   ├── kids.controller.ts
│   │   ├── kids.service.ts
│   │   └── kid.entity.ts
│   ├── education/                 # Education records
│   │   ├── education.module.ts
│   │   ├── education.controller.ts
│   │   ├── education.service.ts
│   │   └── education.entity.ts
│   ├── activities/                # Activities
│   │   ├── activities.module.ts
│   │   ├── activities.controller.ts
│   │   ├── activities.service.ts
│   │   └── activity.entity.ts
│   ├── competitions/              # Competitions
│   │   ├── competitions.module.ts
│   │   ├── competitions.controller.ts
│   │   ├── competitions.service.ts
│   │   └── competition.entity.ts
│   ├── camps/                     # Summer camps
│   │   ├── camps.module.ts
│   │   ├── camps.controller.ts
│   │   ├── camps.service.ts
│   │   └── camp.entity.ts
│   ├── trips/                     # Vacation trips
│   │   ├── trips.module.ts
│   │   ├── trips.controller.ts
│   │   ├── trips.service.ts
│   │   └── trip.entity.ts
│   ├── growth/                    # Growth measurements
│   │   ├── growth.module.ts
│   │   ├── growth.controller.ts
│   │   ├── growth.service.ts
│   │   └── growth-measurement.entity.ts
│   ├── timeline/                  # Timeline events (auto-generated)
│   │   ├── timeline.module.ts
│   │   ├── timeline.controller.ts
│   │   ├── timeline.service.ts
│   │   └── timeline-event.entity.ts
│   ├── photos/                    # Photo uploads (Blob Storage)
│   │   ├── photos.module.ts
│   │   ├── photos.controller.ts
│   │   ├── photos.service.ts
│   │   └── photo.entity.ts
│   ├── common/                    # Shared guards, decorators, DTOs
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── dto/
│   │       └── pagination.dto.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── *.spec.ts
├── Dockerfile
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
└── package.json

infra/                             # NEW: Bicep IaC
├── main.bicep                     # Orchestrator
├── modules/
│   ├── static-web-app.bicep
│   ├── container-app.bicep
│   ├── container-registry.bicep
│   ├── postgresql.bicep
│   ├── storage.bicep
│   └── key-vault.bicep
└── parameters/
    └── dev.bicepparam

.github/
├── workflows/
│   ├── frontend.yml               # Build & deploy SPA to Static Web Apps
│   ├── backend.yml                # Build Docker, push ACR, deploy Container Apps
│   └── infra.yml                  # Bicep deployment
└── agents/                        # Spec Kit agents (already present)

package.json                       # Root: npm workspaces config
```

**Structure Decision**: Option 2 (Web application) — frontend/ and backend/ packages in an npm workspaces monorepo. The existing `src/` moves into `frontend/src/`, and `backend/` is a new NestJS project. `infra/` holds Bicep modules at the root level.

## Complexity Tracking

No constitution violations — table not needed.
