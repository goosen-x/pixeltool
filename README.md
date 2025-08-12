# Dmitry Borisenko's Portfolio

Welcome to my personal portfolio website! This project showcases my skills,
experience, and projects as a fullstack developer.

![screen-gif](/public/images/readme.gif)

## 🌟 Features

- Responsive design for optimal viewing on all devices
- Internationalization support for English and Russian
- Interactive sections for About Me, Experience, Skills, and Projects
- Dark mode support
- 3D animations and interactive elements
- Optimized performance with Next.js

## 🛠 Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Three.js / React Three Fiber
- next-intl for internationalization
- Vercel for deployment

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/goosen-x/next-portfolio
   cd portfolio
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add any necessary
   environment variables.

### Running the Development Server

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the
result.

## 🌐 Internationalization

This project supports multiple languages:

- English (default)
- Russian

Language files are located in the `messages` directory. To add a new language,
create a new JSON file in this directory and update the language switcher
component.

## 📁 Project Structure

- `app/`: Next.js pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions and custom hooks
- `i18n/`: Internationalization configuration
- `messages/`: Internationalization JSON files
- `public/`: Static assets (images, fonts, etc.)

## 🚢 Deployment

This project is set up for easy deployment on Vercel. Simply connect your GitHub
repository to Vercel, and it will automatically deploy your main branch.

For other hosting platforms, build the project using:

```
npm run build
# or
yarn build
```

Then start the production server:

```
npm start
# or
yarn start
```

## 🤝 Contributing

While this is a personal portfolio project, I'm open to suggestions and
improvements. Feel free to open an issue or submit a pull request.

## 📞 Contact

Dmitry Borisenko -
[dmitryborisenko.msk@gmail.com](mailto:dmitryborisenko.msk@gmail.com)

Project Link: [https://www.pixeltool.pro](https://www.pixeltool.pro)

---

Thank you for checking out my portfolio project! I hope you find it interesting
and informative.
