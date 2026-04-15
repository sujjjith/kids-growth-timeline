# Kid Chronicle

A beautifully crafted family growth tracker for parents to document and celebrate their children's milestones — education, activities, competitions, camps, trips, and physical growth — all in one place.

Built with a **Storybook Editorial** design philosophy: structured enough to hold years of data, warm enough to feel like opening a treasured notebook.

![Node](https://img.shields.io/badge/Node-%3E%3D22.9-339933?logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Google OAuth Setup](#google-oauth-setup)
- [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Design System](#design-system)
- [Roadmap](#roadmap)

---

## Features

- **Multi-child profiles** — Track multiple children from a single account
- **Unified timeline** — A living, category-coded timeline of all events across children with a pulsing "today" marker
- **Six content domains:**
  - **Education** — Schools, grades, achievements
  - **Activities** — Extracurriculars, hobbies, classes
  - **Competitions** — Contests, awards, placements
  - **Summer Camps** — Programs, sessions, experiences
  - **Vacation Trips** — Family travel memories
  - **Growth & Health** — Height/weight tracking with visual charts
- **Interactive growth charts** — Line charts for height and weight trends over time (Recharts)
- **Dashboard overview** — Summary counts, recent events, and quick access to all children
- **Quick-add dialog** — Inline record creation from any page
- **Google OAuth** — Secure single sign-on with email allowlist
- **Multi-tenant** — All data scoped by authenticated user
- **Responsive** — Desktop sidebar layout + mobile-friendly top bar

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Dev server & build tool |
| TypeScript 5.9 | Type safety |
| TailwindCSS 4 | Utility-first styling |
| Radix UI / shadcn/ui | Headless accessible components |
| React Router 6 | Client-side routing |
| TanStack React Query 5 | Server state & data fetching |
| Axios | HTTP client |
| React Hook Form + Zod | Form handling & validation |
| Recharts | Growth data visualization |
| Lucide React | Icon library |
| Sonner | Toast notifications |

### Backend

| Technology | Purpose |
|---|---|
| NestJS 11 | Server framework |
| TypeORM 0.3 | Database ORM |
| PostgreSQL 16 | Relational database |
| Passport | Authentication middleware |
| passport-google-oauth20 | Google OAuth2 strategy |
| passport-jwt | JWT bearer strategy |
| class-validator | DTO validation |
| class-transformer | Object transformation |

### Infrastructure

| Technology | Purpose |
|---|---|
| Podman + podman-compose | Container runtime (PostgreSQL) |
| npm Workspaces | Monorepo management |

---

## Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────┐
│                 │  /api  │                 │       │              │
│   React SPA     │──────▸│   NestJS API    │──────▸│  PostgreSQL  │
│   (Vite :5173)  │       │   (:3000)       │       │  (:5433)     │
│                 │◂──────│                 │◂──────│              │
└─────────────────┘       └────────┬────────┘       └──────────────┘
                                   │
                          ┌────────▼────────┐
                          │  Google OAuth   │
                          │  (consent flow) │
                          └─────────────────┘
```

**Auth flow:** Browser → Google consent screen → callback to backend → JWT issued → stored in frontend → sent as `Authorization: Bearer` header on every API request.

---

## Project Structure

```
kids-growth-timeline-hub/
├── package.json              # Root — npm workspaces config
├── docker-compose.yml        # PostgreSQL container (Podman-compatible)
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── main.tsx          # App entry point
│   │   ├── router.tsx        # Route definitions
│   │   ├── client.ts         # Axios instance + auth interceptor
│   │   ├── pages/
│   │   │   ├── Login.tsx         # Google OAuth login page
│   │   │   ├── Dashboard.tsx     # Overview & recent events
│   │   │   ├── KidProfile.tsx    # Per-child detail view (tabbed)
│   │   │   ├── Timeline.tsx      # Unified filterable timeline
│   │   │   └── GrowthCharts.tsx  # Height/weight line charts
│   │   ├── components/
│   │   │   ├── AppLayout.tsx     # Sidebar + content shell
│   │   │   ├── QuickAddDialog.tsx
│   │   │   └── ui/              # shadcn/ui primitives
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities & constants
│   │   └── styles/globals.css   # Tailwind + custom tokens
│   └── vite.config.ts           # Vite config (proxy, aliases)
│
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── main.ts           # Bootstrap, CORS, global prefix /api
│   │   ├── app.module.ts     # Root module (9 feature modules)
│   │   ├── auth/             # Google OAuth + JWT + email allowlist
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── google.strategy.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── user.entity.ts
│   │   ├── kids/             # Child profiles (CRUD)
│   │   ├── education/        # Education records
│   │   ├── activities/       # Activities records
│   │   ├── competitions/     # Competitions records
│   │   ├── camps/            # Camp records
│   │   ├── trips/            # Trip records
│   │   ├── growth/           # Growth measurements
│   │   └── timeline/         # Unified timeline aggregation
│   └── .env                  # Environment config (not committed)
│
└── docs/
    └── design.md             # Full design specification
```

---

## Prerequisites

- **Node.js** ≥ 22.9
- **npm** ≥ 10
- **Podman** (or Docker) — for PostgreSQL
- **Google Cloud Console** account — for OAuth credentials

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd kids-growth-timeline-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL

```bash
# Pull the image (use --tls-verify=false if behind corporate proxy)
podman pull --tls-verify=false docker.io/library/postgres:16-alpine

# Start the container
podman-compose up -d
# or: python3 -m podman_compose up -d
```

Verify it's running:

```bash
podman ps
# Should show postgres:16-alpine on 0.0.0.0:5433->5432
```

### 4. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values (see Environment Variables below)
```

### 5. Set up Google OAuth

See [Google OAuth Setup](#google-oauth-setup) below.

### 6. Start the app

```bash
# Both frontend and backend:
npm run dev

# Or individually:
npm run dev:backend   # NestJS on http://localhost:3000
npm run dev:frontend  # Vite on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

Create `backend/.env` with the following:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/kidchronicle` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `383070...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-...` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI | `http://localhost:3000/api/auth/google/callback` |
| `ALLOWED_EMAILS` | Comma-separated emails allowed to sign in. Empty = allow all. | `user@gmail.com,spouse@gmail.com` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your-secret-key` |
| `FRONTEND_URL` | Frontend origin (for CORS & redirects) | `http://localhost:5173` |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage (optional for local) | |
| `AZURE_STORAGE_CONTAINER` | Blob container name | `photos` |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Backend port | `3000` |

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services → OAuth consent screen**
4. Select **External** user type → Create
5. Fill in App name, support email → Save
6. Go to **Credentials → Create Credentials → OAuth client ID**
7. Application type: **Web application**
8. Add Authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
9. Copy the **Client ID** and **Client Secret** into `backend/.env`

> **Tip:** In testing mode, you must add test users under the OAuth consent screen. Add the same emails you put in `ALLOWED_EMAILS`.

---

## Running the App

```bash
# Terminal 1 — Database
podman-compose up -d

# Terminal 2 — Backend (auto-creates tables on first run)
npm run dev:backend

# Terminal 3 — Frontend
npm run dev:frontend
```

The backend auto-creates all database tables via TypeORM `synchronize` in development mode. No migrations needed for local dev.

---

## Available Scripts

Run from the project root:

| Command | Description |
|---|---|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start Vite dev server (port 5173) |
| `npm run dev:backend` | Start NestJS in watch mode (port 3000) |
| `npm run build` | Build both workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Run tests in all workspaces |
| `npm run type-check` | TypeScript type-check all workspaces |

---

## API Routes

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <jwt>`.

### Auth

| Method | Route | Description |
|---|---|---|
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | OAuth callback (issues JWT) |
| GET | `/api/auth/me` | Get current user profile |

### Kids

| Method | Route | Description |
|---|---|---|
| GET | `/api/kids` | List all kids |
| GET | `/api/kids/:id` | Get kid by ID |
| POST | `/api/kids` | Create a kid |
| PUT | `/api/kids/:id` | Update a kid |
| DELETE | `/api/kids/:id` | Delete a kid |

### Education, Activities, Competitions, Camps (per-kid resources)

| Method | Route Pattern | Description |
|---|---|---|
| GET | `/api/kids/:kidId/{resource}` | List records |
| GET | `/api/kids/:kidId/{resource}/:id` | Get by ID |
| POST | `/api/kids/:kidId/{resource}` | Create record |
| PUT | `/api/kids/:kidId/{resource}/:id` | Update record |
| DELETE | `/api/kids/:kidId/{resource}/:id` | Delete record |

Where `{resource}` is one of: `education`, `activities`, `competitions`, `camps`, `growth`

### Trips (user-level, not per-kid)

| Method | Route | Description |
|---|---|---|
| GET | `/api/trips` | List trips |
| GET | `/api/trips/:id` | Get trip by ID |
| POST | `/api/trips` | Create trip |
| PUT | `/api/trips/:id` | Update trip |
| DELETE | `/api/trips/:id` | Delete trip |

### Timeline

| Method | Route | Description |
|---|---|---|
| GET | `/api/timeline` | Unified timeline (supports filters) |

---

## Design System

Kid Chronicle follows a **Storybook Editorial** aesthetic — a parent's tool that celebrates childhood.

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Background | Warm Parchment | `#FAF4ED` |
| Text & Structure | Deep Walnut | `#3B2F2F` |
| Accent | Saffron Flame | `#E8913A` |

### Category Colors

| Category | Color | Hex |
|---|---|---|
| Education | Slate Blue | `#4A7FB5` |
| Activities | Sage Green | `#5B9A6F` |
| Competitions | Burnt Orange | `#D4793A` |
| Summer Camps | Golden | `#C4A43E` |
| Vacation Trips | Soft Violet | `#8B6BAE` |
| Growth/Health | Dusty Rose | `#D4697A` |

### Typography

- **Display:** Fraunces (Google Fonts) — headers, names, milestones
- **Body:** Source Sans 3 (Google Fonts) — data, labels, forms

### Signature Detail

The **Living Timeline Spine** — a continuous vertical line with category-coded dots and a pulsing saffron "heartbeat" dot at today's position, making the record feel alive and ongoing.

---

## Roadmap

- [x] Phase 1–7: Core app (auth, kids, education, activities, competitions, camps, trips, growth, timeline, dashboard, charts)
- [ ] Phase 8: Photo uploads via Azure Blob Storage
- [ ] Phase 9: CI/CD pipeline
- [ ] Phase 10: Azure infrastructure (Bicep/Terraform)
- [ ] Phase 11: Polish, testing, and production hardening

---

## License

Private — not licensed for redistribution.
