# Changelog — Session 2026-04-28

All changes made to `momspops/frontend/src/` during this session.

---

## 1. Tailwind v4 `text-base` Collision Fix

> [!IMPORTANT]
> Tailwind v4 resolves `text-base` as `color: var(--color-base)` (the background color token), NOT as `font-size: 1rem`. This made any element with `text-base` invisible — text became the same color as the background. The pattern `bg-charcoal text-base` was used on buttons throughout the app, making them invisible in light mode.

### Files fixed (6 total)

| File | Element | Before | After |
|---|---|---|---|
| [distill/page.tsx](file:///home/tp99h/momspops/frontend/src/app/distill/page.tsx#L74) | Select Files button | `bg-charcoal text-base` | `bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900` |
| [UnsavedModal.tsx](file:///home/tp99h/momspops/frontend/src/components/UnsavedModal.tsx#L44) | Save button | `bg-charcoal text-base` | `bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900` |
| [manage/page.tsx](file:///home/tp99h/momspops/frontend/src/app/chat/%5Bid%5D/manage/page.tsx#L111) | Save button | `bg-charcoal text-base` | `bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900` |
| [profile/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/profile/page.tsx#L84) | Save button | `bg-charcoal text-base` | `bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900` |
| [notifications/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/notifications/page.tsx#L123) | Save button | `bg-charcoal text-base` | `bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900` |
| [appearance/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/appearance/page.tsx#L99) | Save button | (already fixed earlier) | Same pattern |

> [!WARNING]
> **Do NOT use `text-base` anywhere in this codebase.** Use `text-[1rem]` for font-size or explicit color classes like `text-white`, `text-primary`, etc.

---

## 2. Dark Mode Heading Visibility Fix

### [settings/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/page.tsx)

All section headings inside accordion panels used `text-stone-700` — a hardcoded light-mode color that's near-invisible on dark backgrounds.

**Changed:** `text-stone-700` → `text-primary` on 5 headings:
- Profile Information (line 56)
- Subscription Tier (line 70)
- Data Export (line 109)
- Display & Theme (line 159)
- Alerts & Quiet Hours (line 194)

---

## 3. Ambient Shader — Added then Removed

### What happened
1. **Store migration**: `useSettingsStore` was updated to add `ShaderStrength` type (`"off" | "subtle" | "warm" | "vivid"`) replacing the boolean `ambientShader`
2. **GlobalProviders**: Multiple attempts to render breathing orbs (behind content with transparency, then on top with blend modes) — none produced visible results due to Tailwind v4's inability to decompose `rgb(var(--bg-base))` for opacity modifiers
3. **Final decision**: Shader was fully removed

### Current state
- **`ShaderStrength` type still exists** in [useSettingsStore.ts](file:///home/tp99h/momspops/frontend/src/store/useSettingsStore.ts) — the store field `shaderStrength` and action `setShaderStrength` remain but are unused
- **No shader UI** in the appearance page
- **No shader rendering** in GlobalProviders
- **Shader keyframes still exist** in [globals.css](file:///home/tp99h/momspops/frontend/src/app/globals.css) (`ambient-pulse`, `breathing`) — harmless but unused

> [!NOTE]
> If shader is revisited, the root cause was that `bg-base/75` in Tailwind v4 does NOT produce an alpha channel when `--color-base` is defined as `rgb(var(--bg-base))`. The inline style `rgb(var(--bg-base) / 0.7)` also failed to render transparency in practice. A working approach would likely need a `<canvas>` or WebGL shader, not CSS blurred divs.

---

## 4. Appearance Page — Shader Section Removed

### [appearance/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/appearance/page.tsx)

**Before**: 3 sections — App Theme, Text Size, Ambient Background (segmented control: Off/Subtle/Warm/Vivid)
**After**: 2 sections — App Theme, Text Size

Removed:
- `ShaderStrength` import
- `SHADER_LEVELS` constant
- `localShader` state + `gShader` selector
- `shaderSlide` position calculator
- Entire "Ambient Shader Strength" `<section>`
- Shader-related `isDirty` check

---

## 5. GlobalProviders — Cleaned Up

### [GlobalProviders.tsx](file:///home/tp99h/momspops/frontend/src/components/GlobalProviders.tsx)

**Removed:** All shader-related code:
- `ShaderStrength` import
- `SHADER_CONFIG` / `ORB_OPACITY` constants
- `shaderStrength` store selector
- Conditional orb rendering `<div>` block
- Background opacity inline styles on content wrapper

**Kept:** Text size scaling via root `fontSize`, ThemeProvider, MaterialIconsLoader, content wrapper with `bg-base`.

---

## 6. Animation System — New

### [globals.css](file:///home/tp99h/momspops/frontend/src/app/globals.css)

Added 4 new keyframes and 8 new utility classes:

#### Keyframes
| Name | Effect |
|---|---|
| `fade-in-up` | `opacity: 0 → 1`, `translateY(12px) → 0` |
| `slide-down` | `opacity: 0 → 1`, `translateY(-8px) scaleY(0.96) → 0 scaleY(1)` |
| `scale-up` | `opacity: 0 → 1`, `scale(0.95) → 1` |
| `fade-in` | `opacity: 0 → 1` |

#### Utilities
| Class | Duration | Use case |
|---|---|---|
| `animate-fade-in-up` | 0.56s | Page content entrance |
| `animate-slide-down` | 0.42s | Accordion panel reveal |
| `animate-scale-up` | 0.42s | Modal/dialog entrance |
| `animate-fade-in` | 0.42s | Backdrop/overlay fade |
| `btn-press` | 0.2s | Universal button feedback: `active:scale(0.97)` + hover shadow |
| `stagger-1` to `stagger-5` | 70ms increments | Cascade delay for list items |

All animations use `cubic-bezier(0.22, 1, 0.36, 1)` (spring easing) and are GPU-accelerated (transform + opacity only).

### Files where animations were applied (12 total)

| File | What was animated |
|---|---|
| [BottomNav.tsx](file:///home/tp99h/momspops/frontend/src/components/BottomNav.tsx) | `btn-press` on nav items, `active:scale-95` on icons |
| [UnsavedModal.tsx](file:///home/tp99h/momspops/frontend/src/components/UnsavedModal.tsx) | `animate-fade-in` backdrop, `animate-scale-up` dialog, `btn-press` buttons |
| [Paywall.tsx](file:///home/tp99h/momspops/frontend/src/components/Paywall.tsx) | Full redesign (see section 7) |
| [page.tsx (auth)](file:///home/tp99h/momspops/frontend/src/app/page.tsx) | Staggered `animate-fade-in-up`, `btn-press` on auth buttons |
| [library/page.tsx](file:///home/tp99h/momspops/frontend/src/app/library/page.tsx) | Staggered sections + persona cards, `btn-press` on links |
| [settings/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/page.tsx) | `animate-slide-down` on 6 accordion panels, `btn-press` on all buttons/links |
| [appearance/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/appearance/page.tsx) | `animate-fade-in-up` main, `btn-press` save + back |
| [distill/page.tsx](file:///home/tp99h/momspops/frontend/src/app/distill/page.tsx) | Staggered sections, `btn-press` Select Files |
| [profile/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/profile/page.tsx) | `animate-fade-in-up` main, `btn-press` all buttons |
| [notifications/page.tsx](file:///home/tp99h/momspops/frontend/src/app/settings/notifications/page.tsx) | `animate-fade-in-up` main, `btn-press` save + back |
| [chat/page.tsx](file:///home/tp99h/momspops/frontend/src/app/chat/%5Bid%5D/page.tsx) | `btn-press` on back, tier, mic, attach, send buttons |
| [manage/page.tsx](file:///home/tp99h/momspops/frontend/src/app/chat/%5Bid%5D/manage/page.tsx) | `animate-fade-in-up` main, `btn-press` all buttons |

---

## 7. Paywall — Full Redesign

### [Paywall.tsx](file:///home/tp99h/momspops/frontend/src/components/Paywall.tsx)

Complete rewrite from a static 3-column layout to an interactive, premium tier selector.

#### Visual additions
- **Decorative glow**: Soft rose gradient blur behind the header
- **Ornamental divider**: "Choose your chapter" with flanking lines
- **Gradient overlays per card**: Sand, rose, sage tints that appear on hover
- **Glowing borders**: Each tier has accent-colored borders that intensify on selection
- **Bottom selection indicator**: Gradient bar on active card
- **Tier icons**: `edit_note` (Echoes), `mic` (Voice), `auto_awesome` (Presence) with filled style

#### Content additions
- **Feature bullet points** with `check_circle` icons:
  - Echoes (4): Written entries, guided prompts, 1 persona, text legacy
  - Voice (5): +Audio, conversation, 3 personas, voice calibration
  - Presence (6): +Unlimited, vault, media, priority, early access
- **Taglines**: "Begin preserving", "Hear them again", "The complete archive"
- **Reassurance text**: "Cancel anytime · No commitments"

#### Interaction additions
- **Selectable cards**: Clicking a tier selects it (default: Voice)
- **Dynamic CTA**: Button text updates to "Begin with {TierName}"
- **Arrow icon** on CTA slides right on hover
- **Staggered card entrance** with animation delays

#### Bug fix
- Replaced `bg-charcoal` with `bg-stone-900 dark:bg-stone-100` on CTA button (same `text-base` collision fix)

---

## Quick Reference: Naming Conventions

> [!CAUTION]
> **Avoid these Tailwind classes** in this codebase — they collide with theme tokens:
> - `text-base` → use `text-[1rem]` or explicit color like `text-white`
> - `bg-charcoal` → use `bg-stone-900`
> - `bg-base` with opacity modifier (`bg-base/75`) → does NOT work; the token can't be decomposed for alpha

**Safe button pattern:**
```tsx
className="bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
```
