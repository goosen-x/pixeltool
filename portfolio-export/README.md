# Personal Portfolio Project

This is a standalone portfolio website extracted from the PixelTool project.

## Setup Instructions

### 1. Initialize the project

```bash
npm install
```

### 2. Copy required files from the original project

You need to copy the following directories and files:

#### Components:
- `components/homepage/` - All section components
- `components/layout/` - Header and Footer
- `components/global/` - Global components
- `components/ui/` - UI library components
- `components/providers/` - Theme provider

#### Library files:
- `lib/utils/`
- `lib/constants/`
- `lib/fonts/`
- `lib/config/`
- `lib/hooks/`
- `lib/actions/posts.ts`
- `lib/db/` (for blog functionality)
- `lib/types/`

#### Internationalization:
- `i18n/`
- `messages/`
- `middleware.ts`

#### Public assets:
- `public/fonts/`
- `public/images/`
- `public/cv/`

### 3. Environment variables

Create a `.env.local` file with necessary environment variables if you want blog functionality.

### 4. Update portfolio content

1. Update personal information in message files (`messages/en.json`, `messages/ru.json`)
2. Replace images in `public/images/`
3. Update CV files in `public/cv/`
4. Modify content in homepage sections

## Project Structure

```
portfolio-personal/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── activities/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   └── globals.css
├── components/
│   ├── homepage/
│   ├── layout/
│   ├── global/
│   ├── ui/
│   └── providers/
├── lib/
├── messages/
├── public/
├── i18n/
├── middleware.ts
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## Build

```bash
npm run build
npm run start
```