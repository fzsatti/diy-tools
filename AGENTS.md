# AGENTS.md — DIY Tools

## Project Overview

A React SPA that provides interactive math/utility calculators with SVG visualizations. Deployed to GitHub Pages.

**Stack:**
- React 19 + TypeScript 6
- Vite 8 (build tool)
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- React Router v7 (client-side routing)
- PWA via `vite-plugin-pwa` (offline support, installable)
- ESLint 10 with flat config + typescript-eslint

**No testing framework exists.** Do not add one unless explicitly requested.

---

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | `tsc -b && vite build` — type-check project references, then bundle |
| `npm run lint` | `eslint .` — lint all TS/TSX files |
| `npm run preview` | Preview production build locally |

- Run `npm run build` after completing any implementation to verify no type errors.
- Run `npm run lint` after changes to verify no lint violations.

---

## Project Structure

```
diy-tools/
├── .github/workflows/deploy.yml   # CI: deploys dist/ to gh-pages on push to main
├── index.html                     # SPA shell, includes GitHub Pages redirect hack
├── vite.config.ts                 # Vite + React + Tailwind + PWA config
├── tsconfig.json                  # Root project references (tsconfig.app.json + tsconfig.node.json)
├── tsconfig.app.json              # Strict TS config for src/ (noUnusedLocals, verbatimModuleSyntax)
├── tsconfig.node.json             # TS config for vite.config.ts only
├── eslint.config.js               # Flat ESLint config
├── public/                        # Static assets served as-is
│   ├── favicon.svg
│   ├── pwa-192x192.png/.svg
│   ├── pwa-512x512.png/.svg
│   └── 404.html                   # GitHub Pages SPA fallback
├── scripts/
│   └── generate-icons.mjs         # Converts SVG PWA icons to PNG via sharp
└── src/
    ├── main.tsx                   # Entry: createRoot + BrowserRouter + basename from BASE_URL
    ├── App.tsx                    # Route definitions (all wrapped in Layout)
    ├── index.css                  # Tailwind import + minimal resets
    ├── assets/                    # Unused: react.svg, vite.svg, hero.png
    ├── components/
    │   └── Layout.tsx             # Sticky header + mobile hamburger nav + <Outlet/>
    └── pages/
        ├── Dashboard.tsx          # Landing page with tool cards
        ├── PythagorasCalculator.tsx
        ├── CircleChordCalculator.tsx
        └── RuleOfThree.tsx
```

---

## Routing

All routes are defined in `src/App.tsx`. Every page is wrapped in the `<Layout />` component.

| Path | Component | Nav Icon |
|------|-----------|----------|
| `/` | Dashboard | ◈ |
| `/pythagoras` | PythagorasCalculator | △ |
| `/circle-chord` | CircleChordCalculator | ◉ |
| `/rule-of-three` | RuleOfThree | ∷ |

When **adding a new page**:
1. Create file at `src/pages/NewTool.tsx`
2. Import and add route in `src/App.tsx`
3. Add nav entry in `src/components/Layout.tsx` (both desktop and mobile)
4. Add a card in `src/pages/Dashboard.tsx`
5. Add to both `navItems` arrays and the Dashboard grid

---

## Architecture & Patterns

### Component Style
- **All components use `export default function ComponentName()`** — no arrow function default exports.
- All are **functional components** with hooks.
- No class components anywhere in the project.

### State Management
- Pure React hooks only — `useState`, `useCallback`, `useMemo`.
- No external state library (no Redux, Zustand, etc.).
- Input values are always stored as **strings** in state, parsed to numbers via `parseNum()` at render time. This allows typing decimal points and partial input without NaN issues.

### Shared Helpers (currently duplicated)
The functions `parseNum` and `fmt` are **copy-pasted** into all three calculator pages:
```typescript
function parseNum(s: string): number {
  const n = parseFloat(s)
  return isNaN(n) || n <= 0 ? 0 : n
}

function fmt(n: number): string {
  return parseFloat(n.toFixed(6)).toString()
}
```
If asked to refactor, extract to `src/lib/` or `src/utils/`.

### Calculator Pattern
Each calculator page follows the same pattern:
1. Title + description header
2. Input fields (`lg:grid-cols-2` grid with SVG viz on the right)
3. SVG visualization panel (always `viewBox="0 0 320 320"` with `rect` background)
4. Result display (indigo box) or validation message (amber box)
5. Formula breakdown section at the bottom

---

## Styling Conventions

**Tailwind CSS v4 via `@tailwindcss/vite`** — no separate config file, no `@theme` blocks currently used.

### Design Tokens
| Token | Value |
|-------|-------|
| Primary brand | indigo (`#4338ca`, `#6366f1`, `#4f46e5`) |
| Background | `bg-gray-50` |
| Cards | `bg-white rounded-2xl border border-gray-200 p-6` |
| Inputs | `rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200` |
| Results | `bg-indigo-50 rounded-xl p-4 border border-indigo-200` |
| Warnings | `bg-amber-50 rounded-xl p-4 border border-amber-200` |
| Info panels | `bg-gray-50 rounded-xl p-4 font-mono` |

### Layout
- `min-h-screen bg-gray-50` as root background
- Header: `sticky top-0 z-30 bg-white border-b border-gray-200`
- Content: `max-w-7xl mx-auto px-4 py-6`
- Two-column grids at `lg:grid-cols-2`, single column below
- Cards use `hover:border-indigo-300 hover:shadow-md transition-all` for interaction

---

## TypeScript Rules

From `tsconfig.app.json`:
- `strict: true` (implicit)
- `noUnusedLocals: true` — unused vars are errors
- `noUnusedParameters: true` — unused params are errors
- `erasableSyntaxOnly: true` — enums/namespaces are forbidden, use `type`/`const` objects
- `verbatimModuleSyntax: true` — imports must use `import type` for type-only imports
- `noFallthroughCasesInSwitch: true`

Always use `import type { ... }` for type-only imports.

---

## Deployment

- **GitHub Actions** (`.github/workflows/deploy.yml`): triggers on push to `main`
- Builds with `BASE_URL: /diy-tools/` (important for sub-path deployment)
- Deploys `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages@v4`
- The `BASE_URL` env var is read by `vite.config.ts` and passed to React Router's `basename`
- The `index.html` contains a path rewriting hack for SPA routing on GitHub Pages (the `~and~` encoding trick)

---

## Adding a New Tool (Step-by-Step)

1. **Create the page component** at `src/pages/NewTool.tsx`:
   ```tsx
   import { useState, useMemo } from 'react'

   function parseNum(s: string): number {
     const n = parseFloat(s)
     return isNaN(n) || n <= 0 ? 0 : n
   }

   function fmt(n: number): string {
     return parseFloat(n.toFixed(6)).toString()
   }

   export default function NewTool() {
     return (
       <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">Tool Name</h1>
           <p className="text-gray-500 text-sm mt-1">Description and formula.</p>
         </div>
         <div className="grid lg:grid-cols-2 gap-6">
           <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
             {/* Inputs */}
           </div>
           <div className="bg-white rounded-2xl border border-gray-200 p-6">
             {/* SVG visualization */}
           </div>
         </div>
         <div className="bg-white rounded-2xl border border-gray-200 p-6">
           {/* Formula breakdown */}
         </div>
       </div>
     )
   }
   ```

2. **Register the route** in `src/App.tsx`:
   ```tsx
   import NewTool from './pages/NewTool'
   // ... inside <Route element={<Layout />}>
   <Route path="/new-tool" element={<NewTool />} />
   ```

3. **Add navigation** in `src/components/Layout.tsx` — add to `navItems` array with a unicode icon.

4. **Add dashboard card** in `src/pages/Dashboard.tsx` — copy an existing `<Link>` card block.

5. Follow the existing calculator patterns for inputs, SVG viz, and formula display.

---

## Known Issues / Technical Debt

- `parseNum` and `fmt` are duplicated in 3 files — extract to shared utility module if refactoring.
- `hero.png` exists in `src/assets/` but is unused.
- No tests exist. If testing is requested, install vitest + @testing-library/react.
- The `public/icons.svg` sprite is present but not referenced in any code.
- PWA manifest id equals the base path — this is correct for sub-path deployment but means local dev uses `/` while production uses `/diy-tools/`.
