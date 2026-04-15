# Tasks: Azure Full-Stack Migration

**Input**: Design documents from `/specs/001-azure-fullstack-migration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Included per constitution (VI. Test Coverage) — backend unit tests per service, frontend integration tests for critical flows.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1-US7)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo initialization, project scaffolding, and configuration

- [ ] T001 Create root `package.json` with npm workspaces config for `frontend/` and `backend/`
- [ ] T002 [P] Move existing `src/`, `public/`, `index.html`, `vite.config.ts`, `tsconfig*.json` into `frontend/` and create `frontend/package.json` with existing dependencies (minus all `@osdk/*` and `@palantir/*` packages)
- [ ] T003 [P] Scaffold NestJS project in `backend/` with `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`, `package.json` (NestJS 11, TypeORM, passport, class-validator, @nestjs/config, pg, uuid)
- [ ] T004 [P] Create `backend/Dockerfile` (multi-stage build: builder with npm ci + build, runner with node:20-alpine)
- [ ] T005 [P] Create `infra/` directory with `main.bicep` orchestrator and placeholder modules in `infra/modules/` (static-web-app.bicep, container-app.bicep, container-registry.bicep, postgresql.bicep, storage.bicep, key-vault.bicep) and `infra/parameters/dev.bicepparam`
- [ ] T006 [P] Create `.github/workflows/frontend.yml` (build SPA, deploy to Static Web Apps on push to main)
- [ ] T007 [P] Create `.github/workflows/backend.yml` (build Docker, push ACR, update Container App on push to main)
- [ ] T008 [P] Create `.github/workflows/infra.yml` (deploy Bicep on changes to `infra/`)
- [ ] T009 Delete Palantir-specific files: `src/client.ts`, `src/AuthCallback.tsx`, `ontology/`, `container-config.json`, `templateConfig.json`, and remove `@osdk/*`/`@palantir/*` from dependencies
- [ ] T010 Create `frontend/.env.example` and `backend/.env.example` with documented environment variables
- [ ] T011 Update root `eslint.config.mjs` for monorepo paths

**Checkpoint**: Monorepo builds (npm install from root), both packages compile independently

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 Create `backend/src/app.module.ts` with TypeOrmModule (PostgreSQL config from env), ConfigModule, and all feature module imports
- [ ] T013 Create `backend/src/main.ts` with NestJS bootstrap, CORS config (FRONTEND_URL), validation pipe (class-validator), and `/api` global prefix
- [ ] T014 [P] Create `backend/src/common/guards/jwt-auth.guard.ts` (extends AuthGuard('jwt'))
- [ ] T015 [P] Create `backend/src/common/decorators/current-user.decorator.ts` (extracts user from request)
- [ ] T016 [P] Create `backend/src/common/dto/pagination.dto.ts` (page, limit query params with defaults)
- [ ] T017 Create User entity at `backend/src/auth/user.entity.ts` per data-model.md (id UUID PK, email, displayName, avatarUrl, googleId unique, timestamps)
- [ ] T018 Create KidProfile entity at `backend/src/kids/kid.entity.ts` per data-model.md (id UUID PK, userId FK → User, firstName, lastName, dateOfBirth, gender, nickname, notes, timestamps; cascade delete children)
- [ ] T019 Create `frontend/src/api/client.ts` — Axios instance with baseURL from `VITE_API_URL`, request interceptor to attach JWT from localStorage, 401 response interceptor to redirect to login
- [ ] T020 Create `frontend/src/api/auth.ts` — helper functions: `getToken()`, `setToken(token)`, `removeToken()`, `isAuthenticated()`, `getAuthUrl()` returning `/api/auth/google`

**Checkpoint**: Backend starts, connects to PostgreSQL, creates users/kids tables. Frontend Axios client configured.

---

## Phase 3: User Story 1 — Sign in with Google (Priority: P1) 🎯 MVP

**Goal**: Users can authenticate with Google and see a personalized landing with their account info

**Independent Test**: Sign in via Google → JWT issued → frontend stores token → `/api/auth/me` returns profile

### Backend Auth

- [ ] T021 Create `backend/src/auth/auth.module.ts` importing PassportModule, JwtModule (secret from env, expiresIn 7d), and registering strategies
- [ ] T022 Create `backend/src/auth/google.strategy.ts` — PassportStrategy(Strategy, 'google') with clientID/clientSecret/callbackURL from env, scope ['email', 'profile'], validate() finds or creates User
- [ ] T023 Create `backend/src/auth/jwt.strategy.ts` — PassportStrategy(Strategy, 'jwt') extracting JWT from Bearer header, validate() returns { userId, email }
- [ ] T024 Create `backend/src/auth/auth.service.ts` — methods: `validateGoogleUser(profile)` (find or create), `login(user)` (sign JWT), `getProfile(userId)`
- [ ] T025 Create `backend/src/auth/auth.controller.ts` — `GET /auth/google` (GoogleAuthGuard), `GET /auth/google/callback` (GoogleAuthGuard → sign JWT → redirect to FRONTEND_URL/auth/callback?token=), `GET /auth/me` (JwtAuthGuard → return user profile)

### Frontend Auth

- [ ] T026 Create `frontend/src/pages/Login.tsx` — centered card with "Sign in with Google" button linking to `VITE_API_URL/auth/google`
- [ ] T027 Create `frontend/src/pages/AuthCallback.tsx` — extracts `token` from URL query, stores via `setToken()`, redirects to `/dashboard`
- [ ] T028 Update `frontend/src/router.tsx` — add routes for `/login`, `/auth/callback`, protect `/dashboard/*` routes with auth check (redirect to `/login` if no token)
- [ ] T029 Update `frontend/src/main.tsx` — wrap app with `QueryClientProvider` from `@tanstack/react-query`
- [ ] T030 Update `frontend/src/Home.tsx` — if authenticated redirect to `/dashboard`, else show Login

### Backend Tests

- [ ] T031 [P] Create `backend/test/auth.service.spec.ts` — test validateGoogleUser (create new, find existing), login (returns valid JWT)

**Checkpoint**: User can sign in with Google, receives JWT, frontend stores it, subsequent API calls are authenticated

---

## Phase 4: User Story 2 — Manage Kid Profiles (Priority: P1)

**Goal**: CRUD operations for kid profiles, dynamic sidebar listing kids

**Independent Test**: Create a kid → see them in sidebar and dashboard → edit name → see update

### Backend Kids

- [ ] T032 Create `backend/src/kids/dto/create-kid.dto.ts` — validated DTO (firstName IsNotEmpty MaxLength(100), dateOfBirth IsDate, gender IsIn(['Male','Female','Other']), lastName/nickname/notes optional)
- [ ] T033 Create `backend/src/kids/dto/update-kid.dto.ts` — PartialType of create DTO
- [ ] T034 Create `backend/src/kids/kids.service.ts` — CRUD methods scoped by userId: `findAll(userId)`, `findOne(id, userId)`, `create(userId, dto)`, `update(id, userId, dto)`, `remove(id, userId)`
- [ ] T035 Create `backend/src/kids/kids.controller.ts` — REST endpoints per contracts/api.md: GET/POST /kids, GET/PUT/DELETE /kids/:id, all JwtAuthGuard protected
- [ ] T036 Create `backend/src/kids/kids.module.ts` — imports TypeOrmModule.forFeature([KidProfile])

### Frontend Kids

- [ ] T037 Create `frontend/src/api/hooks/useKids.ts` — React Query hooks: `useKids()` (GET /kids), `useKid(id)`, `useCreateKid()`, `useUpdateKid()`, `useDeleteKid()` with query invalidation
- [ ] T038 Update `frontend/src/components/AppLayout.tsx` — replace hardcoded kid list with `useKids()` hook, render dynamic sidebar with kid names/avatars, add "+Add Child" button, add user avatar/logout in header
- [ ] T039 Update `frontend/src/pages/Dashboard.tsx` — replace `useOsdkObjects` with `useKids()` hook, compute age from dateOfBirth, show kid cards with stats (fetch counts from respective endpoints)

### Backend Tests

- [ ] T040 [P] Create `backend/test/kids.service.spec.ts` — test CRUD operations, userId scoping (cannot access other user's kids)

**Checkpoint**: Kids appear dynamically in sidebar and dashboard, new kids can be created/edited

---

## Phase 5: User Story 3 — Add and Browse Records (Priority: P1)

**Goal**: CRUD for all 6 record categories with auto-generated timeline events

**Independent Test**: Create an education record → see it in kid's Education tab and in the timeline

### Backend Entities (parallelizable — different files)

- [ ] T041 [P] Create `backend/src/education/education.entity.ts` per data-model.md
- [ ] T042 [P] Create `backend/src/activities/activity.entity.ts` per data-model.md
- [ ] T043 [P] Create `backend/src/competitions/competition.entity.ts` per data-model.md
- [ ] T044 [P] Create `backend/src/camps/camp.entity.ts` per data-model.md
- [ ] T045 [P] Create `backend/src/trips/trip.entity.ts` per data-model.md (note: userId FK, kidId nullable for family trips)
- [ ] T046 [P] Create `backend/src/growth/growth-measurement.entity.ts` per data-model.md
- [ ] T047 [P] Create `backend/src/timeline/timeline-event.entity.ts` per data-model.md (userId FK, kidId nullable)

### Backend Timeline Service (dependency for all other services)

- [ ] T048 Create `backend/src/timeline/timeline.service.ts` — `createFromEntity(userId, kidId, date, title, category, entityId)`, `removeByEntityId(entityId)`
- [ ] T049 Create `backend/src/timeline/timeline.module.ts` — imports TypeOrmModule.forFeature([TimelineEvent]), exports TimelineService

### Backend DTOs (parallelizable)

- [ ] T050 [P] Create `backend/src/education/dto/create-education.dto.ts` and `update-education.dto.ts`
- [ ] T051 [P] Create `backend/src/activities/dto/create-activity.dto.ts` and `update-activity.dto.ts`
- [ ] T052 [P] Create `backend/src/competitions/dto/create-competition.dto.ts` and `update-competition.dto.ts`
- [ ] T053 [P] Create `backend/src/camps/dto/create-camp.dto.ts` and `update-camp.dto.ts`
- [ ] T054 [P] Create `backend/src/trips/dto/create-trip.dto.ts` and `update-trip.dto.ts`
- [ ] T055 [P] Create `backend/src/growth/dto/create-growth.dto.ts` and `update-growth.dto.ts`

### Backend Services (parallelizable — each injects TimelineService)

- [ ] T056 [P] Create `backend/src/education/education.service.ts` — CRUD scoped by userId via kidId ownership check; on create calls TimelineService.createFromEntity()
- [ ] T057 [P] Create `backend/src/activities/activities.service.ts` — same pattern
- [ ] T058 [P] Create `backend/src/competitions/competitions.service.ts` — same pattern
- [ ] T059 [P] Create `backend/src/camps/camps.service.ts` — same pattern
- [ ] T060 [P] Create `backend/src/trips/trips.service.ts` — scoped by userId directly (trips endpoint is at /api/trips, not nested under kids)
- [ ] T061 [P] Create `backend/src/growth/growth.service.ts` — same pattern as education

### Backend Controllers (parallelizable)

- [ ] T062 [P] Create `backend/src/education/education.controller.ts` — GET/POST /kids/:kidId/education, GET/PUT/DELETE /kids/:kidId/education/:id
- [ ] T063 [P] Create `backend/src/activities/activities.controller.ts` — GET/POST /kids/:kidId/activities, GET/PUT/DELETE /kids/:kidId/activities/:id
- [ ] T064 [P] Create `backend/src/competitions/competitions.controller.ts` — same pattern
- [ ] T065 [P] Create `backend/src/camps/camps.controller.ts` — same pattern
- [ ] T066 [P] Create `backend/src/trips/trips.controller.ts` — GET/POST /trips, GET/PUT/DELETE /trips/:id (user-level, not kid-nested)
- [ ] T067 [P] Create `backend/src/growth/growth.controller.ts` — same pattern

### Backend Modules (parallelizable)

- [ ] T068 [P] Create `backend/src/education/education.module.ts` — imports TypeOrmModule.forFeature([EducationRecord]), TimelineModule
- [ ] T069 [P] Create `backend/src/activities/activities.module.ts` — same pattern
- [ ] T070 [P] Create `backend/src/competitions/competitions.module.ts`
- [ ] T071 [P] Create `backend/src/camps/camps.module.ts`
- [ ] T072 [P] Create `backend/src/trips/trips.module.ts`
- [ ] T073 [P] Create `backend/src/growth/growth.module.ts`

### Frontend Hooks (parallelizable)

- [ ] T074 [P] Create `frontend/src/api/hooks/useEducation.ts` — React Query hooks for education CRUD
- [ ] T075 [P] Create `frontend/src/api/hooks/useActivities.ts`
- [ ] T076 [P] Create `frontend/src/api/hooks/useCompetitions.ts`
- [ ] T077 [P] Create `frontend/src/api/hooks/useCamps.ts`
- [ ] T078 [P] Create `frontend/src/api/hooks/useTrips.ts`
- [ ] T079 [P] Create `frontend/src/api/hooks/useGrowth.ts`

### Frontend Pages

- [ ] T080 Update `frontend/src/pages/KidProfile.tsx` — replace all `useOsdkObjects` calls with React Query hooks (useEducation, useActivities, etc.), keep existing tab UI and category styling
- [ ] T081 Update `frontend/src/components/QuickAddDialog.tsx` — replace all `useOsdkAction` calls with React Query mutations (useCreateKid, useCreateEducation, etc.), same form fields and validation

### Backend Tests

- [ ] T082 [P] Create `backend/test/education.service.spec.ts` — test CRUD + timeline event auto-creation
- [ ] T083 [P] Create `backend/test/trips.service.spec.ts` — test family vs individual trips, userId scoping

**Checkpoint**: All 6 record categories work end-to-end. Quick-add creates records and auto-generates timeline events.

---

## Phase 6: User Story 4 — Timeline View (Priority: P2)

**Goal**: Chronological timeline with kid/category filtering and the pulsing "Today" marker

**Independent Test**: With multiple records across kids and categories, timeline renders grouped by month with filters working

### Backend

- [ ] T084 Create `backend/src/timeline/timeline.controller.ts` — GET /timeline with query params: kidId (optional), category (optional), page, limit; JwtAuthGuard protected; scoped by userId

### Frontend

- [ ] T085 Create `frontend/src/api/hooks/useTimeline.ts` — React Query hook with filter params: `useTimeline({ kidId?, category?, page?, limit? })`
- [ ] T086 Update `frontend/src/pages/Timeline.tsx` — replace `useOsdkObjects` with `useTimeline()` hook, keep existing month grouping, spine design, category colored dots, kid avatars, and pulsing "Today" marker

**Checkpoint**: Timeline filters by kid and category, grouped chronologically with "Today" marker

---

## Phase 7: User Story 5 — Growth Charts (Priority: P2)

**Goal**: Line charts for height and weight over time, individual and combined views

**Independent Test**: Add growth measurements → see chart data points → toggle between kids

### Frontend

- [ ] T087 Update `frontend/src/pages/GrowthCharts.tsx` — replace `useOsdkObjects` with `useGrowth()` and `useKids()` hooks, keep existing Recharts line chart config, kid color coding, and stat cards

**Checkpoint**: Growth charts render with real data, combined view shows both kids' lines

---

## Phase 8: User Story 6 — Photo Uploads (Priority: P3)

**Goal**: Optional photo attachments on any record, stored in Azure Blob Storage

**Independent Test**: Create a record with a photo attached → see thumbnail in record details

### Backend

- [ ] T088 Create `backend/src/photos/photo.entity.ts` per data-model.md
- [ ] T089 Create `backend/src/photos/photos.service.ts` — upload to Blob Storage (Azure Storage SDK), generate SAS URLs for reads, validate type/size
- [ ] T090 Create `backend/src/photos/photos.controller.ts` — POST /kids/:kidId/photos (multipart), GET /kids/:kidId/photos, DELETE /kids/:kidId/photos/:id
- [ ] T091 Create `backend/src/photos/photos.module.ts`

### Frontend

- [ ] T092 Create `frontend/src/api/hooks/usePhotos.ts` — React Query hooks for photo upload/list/delete
- [ ] T093 Update `frontend/src/components/QuickAddDialog.tsx` — add optional file input for photo, upload after record creation, show preview

**Checkpoint**: Photos upload to blob storage, thumbnails display with records

---

## Phase 9: User Story 7 — CI/CD Pipelines (Priority: P2)

**Goal**: Automated build + deploy on push to main

**Independent Test**: Merge to main → GitHub Actions runs → frontend deployed to SWA, backend to Container Apps

- [ ] T094 Finalize `.github/workflows/frontend.yml` — npm ci, npm run build, deploy with azure/static-web-apps-deploy action, configured with SWA deployment token secret
- [ ] T095 Finalize `.github/workflows/backend.yml` — docker build, az acr login, docker push, az containerapp update
- [ ] T096 Finalize `.github/workflows/infra.yml` — az deployment group create with Bicep, trigger on infra/ path changes only

**Checkpoint**: Push to main triggers successful deployments

---

## Phase 10: Bicep Infrastructure

**Purpose**: Complete Azure infrastructure definitions

- [ ] T097 [P] Implement `infra/modules/static-web-app.bicep` — Free tier, location, output hostname
- [ ] T098 [P] Implement `infra/modules/container-registry.bicep` — Basic SKU, admin enabled
- [ ] T099 [P] Implement `infra/modules/postgresql.bicep` — Flexible Server B1ms, SSL enforced, firewall rules for Container Apps subnet
- [ ] T100 [P] Implement `infra/modules/storage.bicep` — Standard LRS, "photos" container, CORS for SWA origin
- [ ] T101 [P] Implement `infra/modules/key-vault.bicep` — secrets for DB password, JWT secret, Google OAuth credentials
- [ ] T102 Implement `infra/modules/container-app.bicep` — Consumption environment, min 0 / max 1 replicas, ingress enabled, env vars from Key Vault refs, ACR image
- [ ] T103 Implement `infra/main.bicep` — orchestrate all modules, pass outputs between them (ACR login server → Container App, PG connection string → Container App env, Storage connection → Container App env)
- [ ] T104 Create `infra/parameters/dev.bicepparam` — resource group name, location, admin passwords

**Checkpoint**: `az deployment group validate` passes for all Bicep files

---

## Phase 11: Polish & Cross-Cutting

- [ ] T105 Update `frontend/src/components/AppLayout.tsx` — add user avatar + logout button in top-right using `/api/auth/me` response
- [ ] T106 Add empty states: Dashboard (no kids → "Add your first child"), Timeline (no events → prompt), Growth Charts (no data → prompt)
- [ ] T107 Update `frontend/vite.config.ts` — add proxy for `/api` to `http://localhost:3000` in dev mode
- [ ] T108 [P] Create `backend/.env.example` with all required env vars documented
- [ ] T109 Update root `README.md` — project overview, local dev setup, Azure deployment instructions

---

## Dependencies

```text
Phase 1 (Setup) → Phase 2 (Foundation)
Phase 2 → Phase 3 (Auth/US1)
Phase 3 → Phase 4 (Kids/US2)
Phase 4 → Phase 5 (Records/US3)  [needs kids to exist]
Phase 5 → Phase 6 (Timeline/US4) [needs records to generate events]
Phase 5 → Phase 7 (Charts/US5)   [needs growth data]
Phase 5 → Phase 8 (Photos/US6)   [needs records to attach to]
Phase 1 → Phase 9 (CI/CD)        [can start after setup]
Phase 1 → Phase 10 (Bicep)       [can start after setup]
Phase 10 → Phase 9               [CI/CD needs infra definitions]
All → Phase 11 (Polish)
```

## Parallel Execution Opportunities

- **Phase 1**: T002-T008 all parallelizable (different directories/files)
- **Phase 2**: T014-T016 parallelizable (different files in common/)
- **Phase 5**: Massive parallelism — T041-T047 (entities), T050-T055 (DTOs), T056-T061 (services), T062-T067 (controllers), T068-T073 (modules), T074-T079 (frontend hooks)
- **Phase 10**: T097-T101 parallelizable (independent Bicep modules)

## Implementation Strategy

1. **MVP (Phase 1-4)**: Monorepo + auth + kid management → delivers a working authenticated app with dynamic kid profiles
2. **Core Value (Phase 5-7)**: Records + timeline + charts → delivers full feature parity with Palantir version
3. **Enhancement (Phase 8)**: Photo uploads → new capability not in original
4. **Operations (Phase 9-10)**: CI/CD + infra → production readiness
5. **Polish (Phase 11)**: UX refinements and documentation

## Summary

- **Total tasks**: 109
- **US1 (Auth)**: 11 tasks (T021-T031)
- **US2 (Kids)**: 9 tasks (T032-T040)
- **US3 (Records)**: 43 tasks (T041-T083) — largest phase due to 6 entity types
- **US4 (Timeline)**: 3 tasks (T084-T086)
- **US5 (Charts)**: 1 task (T087)
- **US6 (Photos)**: 6 tasks (T088-T093)
- **US7 (CI/CD)**: 3 tasks (T094-T096)
- **Infra**: 8 tasks (T097-T104)
- **Setup/Foundation/Polish**: 25 tasks
- **Parallel opportunities**: 65+ tasks can run in parallel within their phase
