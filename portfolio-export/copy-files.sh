#!/bin/bash

# Copy homepage sections
cp -r ../components/homepage/* components/homepage/

# Copy layout components
cp -r ../components/layout/* components/layout/

# Copy global components needed for portfolio
cp ../components/global/SectionTitle.tsx components/global/
cp ../components/global/DownloadCV.tsx components/global/
cp ../components/global/LanguageSelect.tsx components/global/
cp ../components/global/ThemeToggle.tsx components/global/
cp ../components/global/ScrollToTop.tsx components/global/
cp ../components/global/BackgroundBeamsWrapper.tsx components/global/
cp ../components/global/BreadcrumbHeader.tsx components/global/
cp ../components/global/BtnGlyph.tsx components/global/
cp ../components/global/CryptoDonation.tsx components/global/
cp ../components/global/CryptoDonationModal.tsx components/global/
cp ../components/global/Globus.tsx components/global/
cp ../components/global/ModalDrawer.tsx components/global/
cp ../components/global/ScrollSpy.tsx components/global/
cp ../components/global/TracingBeams.tsx components/global/
cp ../components/global/index.ts components/global/

# Copy UI components
cp -r ../components/ui/* components/ui/

# Copy providers
cp -r ../components/providers/* components/providers/

# Copy lib files
cp -r ../lib/utils/* lib/utils/
cp -r ../lib/constants/* lib/constants/
cp -r ../lib/fonts/* lib/fonts/
cp -r ../lib/config/* lib/config/
cp -r ../lib/hooks/* lib/hooks/
cp ../lib/actions/posts.ts lib/actions/
cp -r ../lib/db/* lib/db/
cp -r ../lib/types/* lib/types/

# Copy i18n setup
cp -r ../i18n/* i18n/

# Copy messages (translations)
cp -r ../messages/* messages/

# Copy middleware
cp ../middleware.ts .

# Copy public assets
cp -r ../public/fonts/* public/fonts/
cp -r ../public/images/* public/images/
cp -r ../public/cv/* public/cv/

echo "Files copied successfully!"