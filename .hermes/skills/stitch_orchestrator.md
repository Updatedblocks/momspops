# Stitch Orchestrator — Safe UI Generation SOP

## Purpose
Automate UI generation via the Stitch MCP API (https://stitch.googleapis.com/mcp) while maintaining zero-break safety for existing logic-heavy components.

## Connection
- **URL:** `https://stitch.googleapis.com/mcp`
- **Auth:** Header `X-Goog-Api-Key: <STITCH_API_KEY>`
- **Format:** JSON-RPC 2.0 over HTTP POST
- **Method:** All tool invocations use `tools/call` with `name` and `arguments` params

## Available Tools
- `list_projects` — discover projects
- `list_screens` — list screens in a project (needs `projectId`)
- `get_screen` — get screen details + code (needs `name`, `projectId`, `screenId`)
- `generate_screen_from_text` — generate new screen from prompt (needs `projectId`, `prompt`, optional `deviceType`, `modelId`)
- `edit_screens` — edit existing screens (needs `projectId`, `prompt`, `selectedScreenIds`)
- `create_design_system` — create design system (needs `designSystem` object, optional `projectId`)
- `apply_design_system` — apply design system to screens

## The Golden Rule: Safe Merge
Stitch generates **presentational UI only**. It does NOT know about:
- Zustand store (`useSettingsStore`)
- Supabase auth, RLS, triggers
- Next.js App Router conventions (`"use client"`, `useRouter`)
- Vercel env vars
- Our custom hooks

**Never** overwrite an existing `page.tsx` with raw Stitch output. Instead:
1. Generate UI in isolation
2. Extract JSX structure + Tailwind classes
3. Manually merge into existing logic containers
4. Keep imports, hooks, and state management intact

## Context Payload Requirements
Every Stitch prompt MUST include:
- `bg-[#FDFBF7]` canvas, `text-[#2C2C2C]` text (per DESIGN.md)
- `font-serif` for headings, `font-sans` for body
- `rounded-2xl` or `rounded-3xl` cards with `shadow-[0_4px_20px_rgba(0,0,0,0.03)]`
- Faded Rose `#C49A9A` accents
- No neon, no glowing borders, no dark mode default
- Generous spacing: `p-6` or `p-8`, `gap-6`

## Error Recovery
If Stitch returns "Requested entity was not found":
1. **CRITICAL: Use NUMERIC-ONLY project ID.** `"11193248202368489125"` — NOT `"projects/11193248202368489125"`. The `list_projects` response includes a `projects/` prefix on `name`, but `generate_screen_from_text` expects the bare numeric string.
2. Verify the project is `TEXT_TO_UI_PRO` type — `PROJECT_DESIGN` projects (from `create_project`) cannot receive generated screens.
3. Prefer reusing the existing "Intimate Chat Interface" project (ID: `11193248202368489125`) which already has our DESIGN.md tokens baked into its theme.

## Manual Fallback
When Stitch generation is unavailable, build UI manually using:
- `frontend/src/app/globals.css` semantic tokens
- `DESIGN.md` for design constraints
- Existing component patterns as reference
- Apply the same safe-merge discipline
