# ROUTE-IQ

Responsive school and college transport-management dashboard.

## Phase 0 — Frontend foundation
- Next.js App Router and TypeScript
- Responsive transport operations dashboard
- Interactive OpenStreetMap map
- Browser-simulated bus locations for demonstration
- Vehicle search, status indicators, route summary, sample activity feed, and mobile navigation

## Important limitations
This is a frontend demo only. Bus locations are simulated in the browser. Supabase authentication, database/RLS, secure server-side APIs, real GPS ingestion, and production realtime updates are not implemented. Do not use demo information for real transport operations.

## Run locally
Requires Node.js 20.9 or newer.
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Security
The frontend demo needs no secrets. When backend integration is added, use environment variables. Never commit service-role keys or private credentials.

## Planned stages
1. Frontend foundation and responsive demo.
2. Supabase schema, migrations, role model, and Row Level Security.
3. Secure authentication and role-specific admin, driver, and parent portals.
4. Server-side GPS ingestion endpoint and validated location updates.
5. Supabase Realtime integration and tests.
6. Deployment verification and security review.

Use free-tier services where possible. Do not provision paid resources or make destructive changes without approval.
