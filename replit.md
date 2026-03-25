# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Backend API**: Python 3.11 + FastAPI + uvicorn (located in `artifacts/python-api/`)
- **Database**: PostgreSQL (managed via raw psycopg2 in Python backend; schema auto-created on startup)
- **Validation**: Pydantic v2 models
- **Frontend**: React + Vite (react-query, framer-motion, react-hook-form, tailwind)

> Note: The TypeScript Express backend (`artifacts/api-server/src`) is kept as a rollback reference but is no longer the active backend. The active backend is `artifacts/python-api/`.

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── local-services/     # LocalServices.com React+Vite frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Application: LocalServices.com

Hyperlocal service marketplace for Bidholi, Dehradun (UPES area).

### Pages
- `/` — Homepage with service categories and hero section
- `/services/:category` — Sub-services for a category (repairs, cleaning, painting)
- `/book` — Service booking form
- `/pg-hostel` — PG, Hostel & Room listings with search/filter
- `/vendor-submit` — Vendor/partner submission form
- `/admin` — Admin panel (password: `admin123`) to manage bookings, listings, submissions

### API Endpoints
- `POST /api/bookings` — Create booking
- `GET /api/bookings` — List all bookings
- `DELETE /api/bookings/:id` — Delete booking
- `POST /api/listings` — Create listing
- `GET /api/listings?type=&minPrice=&maxPrice=` — List listings with filters
- `DELETE /api/listings/:id` — Delete listing
- `POST /api/vendor-submit` — Vendor submission
- `GET /api/vendor-submissions` — List vendor submissions
- `DELETE /api/vendor-submissions/:id` — Delete vendor submission

### Database Tables
- `bookings` — Service booking records
- `listings` — PG/Hostel/Room listing records
- `vendor_submissions` — Vendor partner submissions

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/`.

- `src/routes/bookings.ts` — Booking CRUD
- `src/routes/listings.ts` — Listing CRUD with filters
- `src/routes/vendorSubmissions.ts` — Vendor submission CRUD

### `artifacts/local-services` (`@workspace/local-services`)

React + Vite frontend for LocalServices.com. Served at `/`.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

Schema files:
- `src/schema/bookings.ts`
- `src/schema/listings.ts`
- `src/schema/vendorSubmissions.ts`
