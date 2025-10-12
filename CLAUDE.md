# CLAUDE.md

делай в режиме паранойи This file provides comprehensive guidance to Claude Code
(claude.ai/code) for senior-level development on this repository.

## 🚀 Quick Start Commands

```bash
# Development
yarn dev                 # Start dev server (port 3000)
yarn dev:clean           # Clear cache and start dev server
yarn dev:no-cache        # Start dev server with all caching disabled
yarn build               # Production build
yarn lint                # ESLint check
yarn typecheck           # TypeScript validation
yarn clean               # Clear Next.js cache

# Quality Checks
yarn check:all           # Run security, imports, bundle checks
yarn format              # Auto-fix formatting
yarn test                # Run test suite

# Database
yarn tsx lib/scripts/migrate-posts.ts     # Migrate posts to DB
yarn tsx lib/scripts/check-supabase.ts    # Verify DB connection
```

## 🏗️ Architecture & Best Practices

### Project Structure

```
portfolio/
├── app/                 # Next.js App Router
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

3. **Component Patterns**

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

1. **TypeScript Check** - No type errors allowed
2. **Build Verification** - Project must build successfully

### Code Style Rules

- **Imports**: Use absolute imports with `@/` prefix
- **Components**: PascalCase for components, camelCase for utilities
- **Files**: kebab-case for file names
- **Exports**: Use barrel exports (index.ts) in component folders

### Security Guidelines

- **Never commit secrets** - Use environment variables
- **Validate all inputs** - Use Zod schemas
- **Sanitize user content** - Prevent XSS attacks
- **Check dependencies** - Run `yarn audit` regularly

## 📋 Common Workflows

### Adding a New Widget/Tool

**NEW: Use the Enhanced Widget Creation System**

1. **Use the widget creation hook** - `useWidgetCreation` provides:
   - State management (inputs, results, loading, errors)
   - Built-in validation system
   - Analytics tracking
   - Copy/download/share functionality
   - Consistent error handling

2. **Follow the widget creation guide** - See `/docs/WIDGET_CREATION_GUIDE.md`

3. **Use the template** - Copy from
   `/app/[locale]/(tools)/tools/_template/page.tsx`

4. **Step-by-step process**:
   - Add widget definition to `/lib/constants/widgets.ts`
   - Copy template to new widget folder
   - Update widget configuration (ID, icon, gradient)
   - Implement widget-specific logic
   - Test thoroughly (dark mode, mobile)

5. **Widget Template Structure**:

   ```typescript
   const widget = useWidgetCreation({
     widgetId: 'my-widget',
     enableAnalytics: true,
     enableFavorites: true,
     defaultState: { inputs: {...}, custom: {...} },
     validationRules: { field: (value) => validation }
   })
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

- **Large bundles**: Check with `yarn check:bundle`
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
yarn install
yarn build
```

### Database Issues

```bash
# Check connection and schema
yarn tsx lib/scripts/verify-supabase-setup.ts
```

## 📚 Additional Resources

- **Widget Creation Guide**: `/docs/WIDGET_CREATION_GUIDE.md`
- **Database Setup**: `/docs/SUPABASE_SETUP.md`

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

- ✅ **Mobile responsive design** with touch-friendly interactions
- ✅ **SEO optimization** with proper metadata and structured data
- ✅ **Analytics tracking** for user interactions
- ✅ **Consistent design patterns** following existing components
- ✅ **Performance optimization** with proper loading states
- ✅ **Accessibility compliance** with WCAG guidelines

### 📋 Quick Commands:

```bash
# Development
yarn dev              # Start with auto-reload
yarn build           # Production build with checks
yarn quality         # Full quality check
yarn deploy-check    # Pre-deployment validation

# Code Quality
yarn lint-fix        # Auto-fix ESLint issues
yarn format          # Format all code
yarn check:all       # Run all checks (security, performance, a11y)
yarn typecheck       # TypeScript validation

# Widget Development
yarn new-widget      # Create new widget template
```

This configuration ensures your development workflow meets senior-level
standards with automated quality checks, comprehensive validation, and best
practices enforcement.

- укажи что сайт должен быть на русском языке
