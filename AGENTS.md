# CasinoLynora — Development Guidelines

## Tech Stack
- Next.js 16 with App Router (React 19)
- TypeScript (strict mode)
- Tailwind CSS v4
- Zod for validation

## Build & Test Commands
- `npm run dev` — Start development server
- `npm run build` — Production build (used for type checking)
- `npm run lint` — ESLint
- `npm start` — Start production server

## Project Structure
```
src/
  app/              # Next.js App Router pages
  components/       # Reusable React components
    layout/         # Header, Footer
    casino/         # CasinoCard, RatingDisplay, AffiliateCTA, etc.
    matchmaker/     # Questionnaire, MatchResults
    compare/        # ComparisonTable
    ui/             # Button, Badge, Container
  lib/
    types/          # TypeScript types (Casino, Preferences, MatchResult)
    data/           # Casino seed data + data access layer
    engine/         # Matching engine with configurable weights
    ai/             # AI abstraction layer (provider pattern)
    utils/          # Formatting utilities
```

## Key Architecture Decisions
1. **Data Layer**: All casino data is structured and typed. Data access is abstracted via `casinoDb` accessor.
2. **Matching Engine**: Deterministic scoring with configurable weights. NOT reliant on LLM.
3. **AI Layer**: Provider pattern — swap AI providers without changing app code. Currently uses stub provider.
4. **Affiliate System**: AffiliateCTA component receives `affiliateOffers` array, resolves by GEO.
5. **SEO**: Server components with metadata, structured data (Review schema), sitemap, robots.txt.

## Code Conventions
- Use Server Components by default. Add `"use client"` only when needed.
- Import from `@/lib/types` for shared types.
- Import from `@/components/ui/` for base UI components.
- Use `cn()` utility for conditional classnames.
- All demo data is clearly marked as DEMO/TEST DATA.

## Important Rules
- NEVER hardcode casino information in UI components
- NEVER fabricate casino data, reviews, or testimonials
- ALWAYS show affiliate disclosure where applicable
- ALWAYS include `rel="noopener noreferrer sponsored"` on external links
- The AI layer must NEVER invent information — only reason over structured data

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
