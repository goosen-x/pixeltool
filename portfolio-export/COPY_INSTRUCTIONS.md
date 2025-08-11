# Files to Copy from Original Project

Copy these files and directories from the PixelTool project to set up your portfolio:

## 1. Component Files

### Homepage Sections (copy entire directories):
```
components/homepage/SectionMain/
components/homepage/SectionTechStack/
components/homepage/SectionProjects/
components/homepage/SectionExperience/
components/homepage/SectionBlog/
components/homepage/SectionContact/
```

### Activities Page Components:
```
components/activities/GitHubActivity.tsx
```

### Contact Page Components:
```
components/contact/ContactForm.tsx
components/contact/ContactInfo.tsx
```

### Layout Components:
```
components/layout/Header/
components/layout/Footer/
components/layout/Container/
```

### Global Components:
```
components/global/SectionTitle.tsx
components/global/DownloadCV.tsx
components/global/LanguageSelect.tsx
components/global/ThemeToggle.tsx
components/global/ScrollToTop.tsx
components/global/BackgroundBeamsWrapper.tsx
components/global/BreadcrumbHeader.tsx
components/global/BtnGlyph.tsx
components/global/CryptoDonation.tsx
components/global/CryptoDonationModal.tsx
components/global/Globus.tsx
components/global/ModalDrawer.tsx
components/global/ScrollSpy.tsx
components/global/TracingBeams.tsx
components/global/index.ts
```

### UI Components (copy entire directory):
```
components/ui/
```

### Providers:
```
components/providers/theme-provider.tsx
```

## 2. Library Files

### Utilities:
```
lib/utils.ts
lib/utils/suppress-warnings.ts
lib/utils/bezier-easing.ts
lib/utils/color-converter.ts
```

### Constants:
```
lib/constants/socials.tsx
lib/constants/globe.json
lib/constants/blog.ts
```

### Fonts:
```
lib/fonts/fonts.ts
```

### Configuration:
```
lib/config/env.ts
lib/config/features.ts
```

### Hooks:
```
lib/hooks/useMediaQuery.tsx
lib/hooks/useThemeWithTransition.tsx
```

### Helpers:
```
lib/helpers/generateRandomColor.ts
lib/helpers/markdownToHtml.ts
```

### For Blog functionality (optional):
```
lib/actions/posts.ts
lib/db/blog.ts
lib/db/connection.ts
lib/db/schema.ts
lib/db/safe-query.ts
lib/types/post.ts
lib/types/database.ts
lib/types/author.ts
```

## 3. Public Assets

### Fonts:
```
public/fonts/Tektur-Regular.ttf
public/fonts/Tektur-Bold.ttf
```

### Images:
```
public/images/logo.png
public/images/mba-experience-3.png
public/images/mba-experience-2.png
public/images/dobrostok.png
public/images/dobrostok-2.png
public/images/inspro.png
public/images/mbloq.png
public/images/komponenta.png
public/images/digital-dyatel.png
public/images/natures.png
```

### CV Files:
```
public/cv/CV_Borisenko_Dmitry_Frontend_En.pdf
public/cv/CV_Borisenko_Dmitry_Frontend.pdf
```

## 4. Complete Message Files

Replace the basic message files with complete translations from:
```
messages/en.json
messages/ru.json
```

## 5. Additional Files

### Root layout file:
```
app/layout.tsx
```

### Error pages (optional):
```
app/error.tsx
app/not-found.tsx
```

## Quick Copy Commands

From the PixelTool project root, run these commands:

```bash
# Navigate to portfolio-export directory first
cd portfolio-export

# Copy components
cp -r ../components/homepage/* components/homepage/
cp -r ../components/layout/* components/layout/
cp -r ../components/ui/* components/ui/
cp -r ../components/providers/* components/providers/

# Copy specific global components
mkdir -p components/global
cp ../components/global/{SectionTitle,DownloadCV,LanguageSelect,ThemeToggle,ScrollToTop,BackgroundBeamsWrapper,BreadcrumbHeader,BtnGlyph,CryptoDonation,CryptoDonationModal,Globus,ModalDrawer,ScrollSpy,TracingBeams,index}.tsx components/global/ 2>/dev/null || :

# Copy lib files
cp ../lib/utils.ts lib/
cp -r ../lib/utils/* lib/utils/
cp -r ../lib/constants/* lib/constants/
cp -r ../lib/fonts/* lib/fonts/
cp -r ../lib/config/* lib/config/
cp -r ../lib/hooks/* lib/hooks/
cp -r ../lib/helpers lib/

# Copy messages
cp ../messages/*.json messages/

# Copy public assets
cp -r ../public/fonts/* public/fonts/
cp -r ../public/images/* public/images/
cp -r ../public/cv/* public/cv/
```

After copying, run:
```bash
npm install
npm run dev
```