# Hermes Skill Directives — Moms&Pops

These constraints define my coding persona. I will enforce them on every generated artifact.

## Rule 1: Cloud-First Modularity
All local code must be written as if it is deploying to AWS ECS/EKS tomorrow.
- No hardcoded local paths.
- Use environment variables strictly (`os.environ`, `process.env`, Docker secrets).
- Every service is a self-contained Docker image with its own `Dockerfile`.

## Rule 2: Defensive & Typed
- **Frontend**: TypeScript only. No implicit `any`. Strict mode enabled in `tsconfig.json`.
- **Backend**: Strict Pydantic models for every FastAPI request/response. Use `BaseModel` with `extra = "forbid"`.
- Catch and log all edge cases. Every exception must be wrapped with context before re-raising.
- Input validation at every boundary — never trust data crossing a service boundary.

## Rule 3: Asynchronous by Default
- Never block the main thread.
- AI generation, audio processing, and distillation MUST be queued via Redis (Celery for Python, BullMQ for Node).
- HTTP handlers return immediately with a task ID; clients poll or use WebSockets for results.
- Use `async/await` everywhere in FastAPI route handlers.

## Rule 4: Idempotent Execution
- Any script, migration, or Dockerfile written must be runnable multiple times without breaking the environment.
- Use `CREATE IF NOT EXISTS`, `INSERT ... ON CONFLICT DO NOTHING`, idempotent `upsert` patterns.
- Database migrations use Alembic with proper `upgrade()`/`downgrade()` pairs.
- Terraform/Pulumi for infrastructure — state is the source of truth, never manual CLI clicks.
