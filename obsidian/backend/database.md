---
tags: [backend, stable]
updated: 2026-09-17
---

# Database

**This project has no database, and should not gain one casually.**

Strapi owns the data. It runs outside this repo with its own database, its own
admin and its own access control. This app is a read-only consumer over HTTP
([[cms]]).

There is no ORM, no migration directory, no connection string, no schema in
`src/`. `API_URL` is the only data credential the app holds.

## If a database is ever genuinely needed

The question to answer first is **why Strapi cannot hold it**. Strapi already has
collections, localisation, media, an admin UI and the client's editors. A second
data store means a second source of truth and a second thing to back up.

Legitimate cases: high-write data Strapi should not carry (form submissions at
volume, analytics events), or something with a schema Strapi cannot express.

If one is added, the `database` skill (`/data`) walks the decision. Non-negotiables
whatever the choice:

- **Pooled connection for the app runtime, direct connection for migrations.**
  Running migrations through a transaction-mode pooler is the classic failure —
  prepared statements are not supported.
- **Row-level security on any table holding user data**, with an index on every
  column a policy filters.
- **Service/secret keys bypass RLS.** Server-only, never behind `NEXT_PUBLIC_`,
  never imported into a client component.
- **Generated types are generated** — regenerate after every schema change, never
  hand-edit, never cast rows to a hand-written interface.
- **Authorisation lives in the data layer and the endpoint**, not in middleware
  or the UI. `src/middleware.ts` does locale routing and must stay that way.
- **Never point local development at production.** A schema push rewrites it.
- Media goes to object storage, never into the repo.

Adding one requires an ADR in [[decisions-log]] and entries in [[tech-stack]] and
[[environment-variables]].

## Forms today

Contact submissions are **not stored**. They go to Resend as email and to
Telegram as a message ([[api-architecture]]). If the client ever asks "where are
the old enquiries?", the answer today is "in the inbox" — that is the most likely
reason this note stops being accurate.

## Related

[[cms]] · [[api-architecture]] · [[decisions-log]] · [[environment-variables]]
