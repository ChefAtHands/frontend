# frontend

React single-page application used by the ChefAtHands project.

Location
- Main source for the frontend UI is in `frontend/chefathands-frontend` (created with Create React App).

Quick start
- Prerequisites: Node.js (14+) and `npm` (or `yarn`).
- Install and run in development mode:

```powershell
cd frontend/chefathands-frontend
npm install
npm start
```

- Build for production:

```powershell
npm run build
```

Project structure (important files)
- `chefathands-frontend/package.json` — npm scripts and dependencies.
- `chefathands-frontend/src/` — React source files.
	- `api/` — small API client wrappers used across the UI (`auth.js`, `ingredients.js`, `recipes.js`).
	- `pages/` — React page components (LoginPage, DashboardPage, RecipePage, SignupPage, WelcomePage).
	- `App.js` — application root and router.
	- `index.js` — app bootstrap.

API clients
- The UI uses simple axios-based clients in `src/api/` to contact backend services. Current defaults are hard-coded in those files:
	- `src/api/auth.js` — base: `http://localhost:8080/api` (login, register)
	- `src/api/ingredients.js` — base: `http://localhost:8080/api/users` and `http://localhost:8080/api/ingredients`
	- `src/api/recipes.js` — recommendation base: `http://localhost:8080/api/recommendations`; recipe details base: `http://localhost:8085/api/recipes`

Environment / configuration
- By default the API base URLs are defined directly in the client files. For deployments, prefer providing environment-based configuration (for example, set `REACT_APP_API_URL` and read it from `process.env.REACT_APP_API_URL` in the API modules) or configure a reverse proxy / gateway to route paths to backend services.

Caching behavior
- `src/api/recipes.js` includes a small localStorage cache (`chef_recipe_cache_v1`) with a 24-hour TTL to reduce repeated calls to the recipe service.

Testing
- Run unit tests with:

```powershell
npm test
```

Notes for integrators
- If the frontend is served behind the `frontend-gateway` or a different gateway, update API base URLs or use relative paths so the gateway can proxy requests.
- When producing a production build, the output directory is `chefathands-frontend/build` which can be served by any static file server.

Files to inspect for further changes
- `chefathands-frontend/src/api/*.js` — to change service URLs
- `chefathands-frontend/src/pages/` — to update UI flows
