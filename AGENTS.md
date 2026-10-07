# DysLearn Project Guidelines & Conventions

## 1. Tech Stack (JavaScript Only - No TypeScript)
- **Frontend**: React (JavaScript `.jsx`), Vite, React Router, plain CSS modules/stylesheets.
- **Backend**: Node.js, Express.js (JavaScript `.js`), MongoDB (Mongoose) with fallback memory store.
- **Strict Rule**: Do **not** use TypeScript. Keep all code in pure modern JavaScript (`.js` and `.jsx`).

## 2. Folder Structure & Organization
- Follow the existing folder structure strictly:
  - `client/src/components/<ComponentName>/<ComponentName>.jsx` + `<ComponentName>.css`
  - `client/src/pages/<PageName>/<PageName>.jsx` + `<PageName>.css`
  - `client/src/services/` for API service layers
  - `client/src/context/` for React contexts
  - `client/src/locales/` for i18n translations
  - `server/controllers/`, `server/models/`, `server/routes/`, `server/services/`, `server/middleware/`
- Do not reorganize, rename, or move existing folders or files.
- Place new components, pages, and utilities in their respective directories.

## 3. Styling Convention
- Every new page and component **must** have its own dedicated CSS file (e.g., `ComponentName.css` alongside `ComponentName.jsx`).
- Import the CSS file directly into the corresponding `.jsx` file (e.g. `import './ComponentName.css';`).
- Do not merge all styles into a single file or write inline CSS.

## 4. Modularity & Architecture
- Maintain clear separation of concerns between presentation, state/context, and backend APIs.
- Build self-contained, reusable components and modular page views.
