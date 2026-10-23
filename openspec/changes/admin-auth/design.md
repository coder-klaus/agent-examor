## Decisions

1. **Single shared admin password** — no multi-user; compared with `timingSafeEqual` to env value.
2. **Signed cookie session** — HMAC over expiry timestamp using `ENCRYPTION_KEY` (or dedicated secret); 7-day TTL; `SameSite=Lax`, `httpOnly`.
3. **Learner exceptions** — Web app unchanged: today/practice queue + grade POST stay public.
4. **Default password** — `ADMIN_PASSWORD` defaults to `huaerjie001` when unset (dev convenience); production MUST set env override.

## Non-Goals

- Web learner login
- OAuth / multi-tenant users
