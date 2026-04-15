# Quickstart: Azure Full-Stack Migration

**Feature**: 001-azure-fullstack-migration
**Date**: 2026-04-14

## Prerequisites

- Node.js 20+ and npm 10+
- Docker Desktop (for backend local dev with container)
- Azure CLI (`az`) authenticated
- PostgreSQL 16 running locally (or Docker container)
- Google Cloud Console project with OAuth credentials configured

## Setup

### 1. Install dependencies

```bash
# From repository root
npm install          # Installs root + all workspace packages
```

### 2. Environment variables

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kids_growth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
JWT_SECRET=<random-32-char-string>
FRONTEND_URL=http://localhost:5173
AZURE_STORAGE_CONNECTION_STRING=<optional-for-photos>
AZURE_STORAGE_CONTAINER=photos
PORT=3000
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Database setup

```bash
# Start PostgreSQL (Docker option)
docker run -d --name kids-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kids_growth -p 5432:5432 postgres:16

# TypeORM auto-syncs schema in development (synchronize: true)
```

### 4. Run locally

```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 5. Access the app

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Auth flow: Click "Sign in with Google" → Google consent → redirected back with JWT

## Azure Deployment

### First-time infrastructure

```bash
# Deploy Bicep infrastructure
az deployment group create \
  --resource-group kids-growth-rg \
  --template-file infra/main.bicep \
  --parameters @infra/parameters/dev.bicepparam
```

### Deploy backend

```bash
cd backend
docker build -t kids-growth-api .
az acr login --name <acr-name>
docker tag kids-growth-api <acr-name>.azurecr.io/kids-growth-api:latest
docker push <acr-name>.azurecr.io/kids-growth-api:latest
az containerapp update --name kids-growth-api --resource-group kids-growth-rg \
  --image <acr-name>.azurecr.io/kids-growth-api:latest
```

### Deploy frontend

```bash
cd frontend
npm run build
# Static Web Apps deployment is handled by GitHub Actions
```

## Verification

1. Visit the frontend URL → see Google sign-in button
2. Sign in → redirected to dashboard
3. Add a child → appears in sidebar
4. Add an education record → appears in kid profile and timeline
5. Check Growth Charts with sample data → line charts render
