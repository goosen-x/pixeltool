# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) for
senior-level development on this repository.

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run lint             # ESLint check
npm run typecheck        # TypeScript validation

# Quality Checks
npm run translations:check    # Validate all translations
npm run check:all            # Run security, imports, bundle checks
npm run format               # Auto-fix formatting
npm run test                 # Run test suite

# Database
npx tsx lib/scripts/migrate-posts.ts     # Migrate posts to DB
npx tsx lib/scripts/check-supabase.ts    # Verify DB connection
```

## 🏗️ Architecture & Best Practices

### Project Structure

```
portfolio/
├── app/[locale]/         # Next.js App Router with i18n
│   ├── (main)/          # Homepage routes
│   ├── (tools)/         # Widget/tool routes
│   └── (other)/         # Blog, contact, etc.
├── components/          # React components
│   ├── widgets/         # Reusable widget components
│   ├── ui/              # shadcn/ui components
│   └── global/          # App-wide components
├── lib/                 # Core utilities
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   └── db/              # Database layer
└── messages/            # i18n translations
```

### Critical Architectural Decisions

1. **Server Components First**
   - Default to RSC for better performance
   - Use `'use client'` only when needed (interactivity, hooks)
   - Fetch data in server components when possible

2. **Type Safety is Mandatory**

   ```typescript
   // ❌ NEVER use 'any'
   const data: any = fetch()

   // ✅ Always define types
   interface WidgetData {
   	id: string
   	title: string
   	// ...
   }
   const data: WidgetData = fetch()
   ```

3. **Internationalization Pattern**

   ```typescript
   // Always use translations
   import { useTranslations } from 'next-intl'
   const t = useTranslations('widgets.myWidget')

   // Never hardcode text
   // ❌ <h1>My Widget</h1>
   // ✅ <h1>{t('title')}</h1>
   ```

4. **Component Patterns**

   ```typescript
   // Use composition and base components
   import { WidgetContainer, WidgetInput, WidgetResult } from '@/components/widgets/base'

   export default function MyWidget() {
     return (
       <WidgetContainer>
         <WidgetInput>...</WidgetInput>
         <WidgetResult>...</WidgetResult>
       </WidgetContainer>
     )
   }
   ```

## 🛡️ Code Standards & Quality Gates

### Pre-commit Checks (BLOCKING)

1. **Translation Validation** - All translations must be complete
2. **TypeScript Check** - No type errors allowed
3. **Build Verification** - Project must build successfully

### Code Style Rules

- **Imports**: Use absolute imports with `@/` prefix
- **Components**: PascalCase for components, camelCase for utilities
- **Files**: kebab-case for file names
- **Exports**: Use barrel exports (index.ts) in component folders

### Security Guidelines

- **Never commit secrets** - Use environment variables
- **Validate all inputs** - Use Zod schemas
- **Sanitize user content** - Prevent XSS attacks
- **Check dependencies** - Run `npm audit` regularly

## 📋 Common Workflows

### Adding a New Widget/Tool

1. **Create widget constant** in `/lib/constants/widgets.ts`
2. **Add translations** to both `/messages/en.json` and `/messages/ru.json`
3. **Create page component** in
   `/app/[locale]/(tools)/tools/[widget-name]/page.tsx`
4. **Use widget base components** from `/components/widgets/base/`
5. **Add custom hook** if needed in `/lib/hooks/widgets/`
6. **Test thoroughly** - check both languages, dark mode, mobile view

### Working with Translations

```bash
# After adding translations:
npm run generate:types        # Generate TypeScript types
npm run validate:translations # Check completeness
```

Common translation structure:

```json
{
	"widgets": {
		"myWidget": {
			"title": "Widget Title",
			"description": "Widget description",
			"useCase": "Use case description"
			// Widget-specific fields...
		}
	}
}
```

### Database Operations

```typescript
// Always use the Supabase adapter
import { supabase } from '@/lib/supabase/client'

// Use type-safe queries
const { data, error } = await supabase
	.from('posts')
	.select('*')
	.eq('published', true)
	.order('date', { ascending: false })
```

## ⚠️ Critical Warnings

### Performance Pitfalls

- **Large bundles**: Check with `npm run check:bundle`
- **Unnecessary client components**: Audit `'use client'` usage
- **Missing image optimization**: Use Next.js Image component
- **Unoptimized fonts**: Use `next/font` for loading

### Common Mistakes to Avoid

1. **Direct DOM manipulation** - Use React state instead
2. **Inline styles** - Use Tailwind classes
3. **Hardcoded values** - Use constants and config files
4. **Missing error boundaries** - Add error handling
5. **Ignoring TypeScript errors** - Fix them immediately

## 🔧 Advanced Configuration

### Environment Variables

```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_YANDEX_METRIKA_ID=
NEXT_PUBLIC_SITE_URL=
```

### VSCode Settings (Recommended)

```json
{
	"editor.formatOnSave": true,
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	},
	"typescript.preferences.importModuleSpecifier": "non-relative"
}
```

### Git Hooks Configuration

- **pre-commit**: Runs validation checks
- **pre-push**: Runs full test suite (if configured)
- **commit-msg**: Validates commit message format

## 📊 Analytics & Monitoring

### Yandex Metrika Goals

The project tracks user interactions automatically:

- Widget usage (`tool_used`)
- Feature interactions (`feature_clicked`)
- Navigation events (`page_navigated`)

### Performance Monitoring

- Core Web Vitals are tracked
- Bundle size limits are enforced
- Build time optimizations are in place

## 🚨 Emergency Procedures

### Build Failures

```bash
# Clear caches and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Translation Errors

```bash
# Regenerate types and validate
npm run generate:types
npm run validate:translations
```

### Database Issues

```bash
# Check connection and schema
npx tsx lib/scripts/verify-supabase-setup.ts
```

## 📚 Additional Resources

- **Widget Creation Guide**: `/docs/WIDGET_CREATION_GUIDE.md`
- **Translation System**: `/docs/TRANSLATIONS.md`
- **Database Setup**: `/docs/SUPABASE_SETUP.md`
- **Pre-commit Checks**: `/docs/PRE_COMMIT_CHECKS.md`

## 🎯 Development Philosophy

1. **User Experience First** - Fast, accessible, intuitive
2. **Type Safety Always** - Catch errors at compile time
3. **Performance Matters** - Measure and optimize
4. **Code Quality** - Maintainable, documented, tested
5. **Progressive Enhancement** - Works everywhere, better on modern browsers

Remember: Write code as if the person maintaining it is a violent psychopath who
knows where you live. That person might be you in 6 months.

---

## 🚀 Senior Developer Configuration Complete!

Your project is now configured with enterprise-level development tools:

### ✅ Completed Setup:

- **`.clinerules`** - Comprehensive coding standards and patterns
- **`.claude/settings.local.json`** - Advanced Claude Code configuration with
  hooks
- **Enhanced Git Hooks** - Pre-commit with auto-fixes and validation
- **Commit Message Validation** - Conventional commits with widget-specific
  checks
- **VSCode Integration** - Complete IDE setup with recommended extensions
- **Performance & Accessibility Checks** - Automated quality assurance
- **EditorConfig & ESLint** - Consistent code formatting and quality

### 🎯 Widget Development Standards:

When creating new widgets, ensure:

- ✅ **Bilingual translations** (EN/RU) with complete key coverage
- ✅ **Keyboard shortcuts** using useWidgetKeyboard hook
- ✅ **Mobile responsive design** with touch-friendly interactions
- ✅ **SEO optimization** with proper metadata and structured data
- ✅ **Analytics tracking** for user interactions
- ✅ **Consistent design patterns** following existing components
- ✅ **Performance optimization** with proper loading states
- ✅ **Accessibility compliance** with WCAG guidelines

### 📋 Quick Commands:

```bash
# Development
npm run dev              # Start with auto-reload
npm run build           # Production build with checks
npm run quality         # Full quality check
npm run deploy-check    # Pre-deployment validation

# Code Quality
npm run lint-fix        # Auto-fix ESLint issues
npm run format          # Format all code
npm run check:all       # Run all checks (security, performance, a11y)
npm run typecheck       # TypeScript validation

# Widget Development
npm run new-widget      # Create new widget template
npm run translations:check  # Validate all translations
```

This configuration ensures your development workflow meets senior-level
standards with automated quality checks, comprehensive validation, and best
practices enforcement.
