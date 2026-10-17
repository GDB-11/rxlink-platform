# rxlink-platform

Platform admin frontend (SvelteKit 2, Svelte 5, Tailwind 4) for the shared catalog and partner registry. It talks **only** to `rxlink-catalog-api`; it never touches a database. Architecture: `rxlink-sv/docs/shared-catalog-and-platform-plan.md` §9; progress: `rxlink-sv/docs/phase-2-implementation-tracker.md` (Phase 8). Conventions: see `CLAUDE.md`.

```bash
pnpm install
# .env.development: PUBLIC_CATALOG_API_BASE_URL=http://localhost:5098  (non-secret, tracked)
pnpm dev      # the API's AllowedOrigins must include the dev origin
pnpm check && pnpm lint
```

Status: 8.7 — login (+ MFA challenge), session guard (15 min idle / 8 h absolute), MFA enrolment at `/seguridad`. Catalog CRUD, CSV import and the partner registry come in 8.8–8.10. `ui`/`theme`/`auth`/`mfa` pieces were copied from `rxlink-sv` on purpose (no shared package until drift hurts).
