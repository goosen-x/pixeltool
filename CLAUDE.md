# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # Start development server at http://localhost:3000
npm run build  # Create production build
npm run start  # Run production server
npm run lint   # Run ESLint for code quality checks
```

## Database Setup

This project uses **Neon PostgreSQL** (via Vercel Postgres) for blog data storage.

### Setup Steps:
1. **Create Vercel Postgres database** in your Vercel dashboard
2. **Copy environment variables** from Vercel to your `.env.local`
3. **Run database schema** in Neon Console (SQL Editor):
   ```sql
   -- Copy and run the contents of lib/db/schema.sql
   ```
4. **Migrate existing posts** (optional):
   ```bash
   npx tsx lib/scripts/migrate-posts.ts
   ```

## Architecture Overview

This is a modern Next.js 15 portfolio website with internationalization support for English and Russian. The project uses the App Router architecture with TypeScript and Tailwind CSS v4.

### Key Architectural Decisions

1. **Internationalization First**: All routes are prefixed with locale (`/[locale]/`). The middleware handles automatic locale detection and routing. Messages are stored in `/messages/{locale}.json`.

2. **Component Organization**:
   - `/components/homepage/` - Feature-specific sections (SectionMain, SectionTechStack, etc.)
   - `/components/global/` - Reusable components across pages
   - `/components/ui/` - shadcn/ui design system components
   - Each component folder typically has an `index.ts` barrel export

3. **3D Visualizations**: The project uses React Three Fiber and Three.js for interactive 3D elements, particularly globe visualizations using `cobe` and `three-globe`.

4. **Styling Strategy**: 
   - Tailwind CSS v4 (latest version) for utility-first styling
   - CSS variables for design tokens
   - Dark mode support built-in
   - Custom Tektur font family

5. **Form Handling**: React Hook Form with Zod validation for type-safe forms.

### Important Patterns

- **Server Components by Default**: Leverage Next.js App Router's server components
- **Locale-Aware Components**: Always consider internationalization when modifying components
- **Type Safety**: Full TypeScript coverage - avoid `any` types
- **Component Exports**: Use barrel exports (index.ts) for cleaner imports

### Key Files to Understand

- `/middleware.ts` - Handles internationalization routing
- `/app/[locale]/layout.tsx` - Root layout with providers and i18n setup
- `/lib/config/env.config.ts` - Environment variable configuration
- `/components/homepage/` - Main portfolio sections architecture

### Testing & Quality

Currently no test suite is configured. Use `npm run lint` to ensure code quality before committing changes.