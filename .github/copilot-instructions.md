# Personal Finance Dashboard - Copilot Instructions

## Project Overview
A "Should I buy/do this now?" dashboard combining market signals with personal finance data to provide Yes/No/Wait recommendations.

## Technology Stack
- **Frontend**: React 18, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **APIs**: Alpha Vantage, Metals-API, Twelve Data (to be integrated)

## Project Structure
```
frontend/ - React frontend with components, pages, hooks
backend/  - Node.js/Express backend with routes, controllers, utilities
```

## Key Development Guidelines

### Frontend
- Use functional components with React hooks
- Maintain Tailwind CSS for styling (use gold color palette for theme)
- Keep API calls in separate utility files or custom hooks
- Component structure: Dashboard → Pages → Components

### Backend
- RESTful API design
- Controllers handle business logic
- Routes define endpoints
- Utils contain helper functions and API integrations
- Error handling middleware in place

### API Integration
- Mock data currently used in MVP
- Real APIs to be integrated:
  - Alpha Vantage (forex, stock data)
  - Metals-API (gold, silver prices)
  - Twelve Data (market data)

## Running the Project
```bash
# Backend (port 5001)
cd backend && npm run dev

# Frontend (port 3000, in new terminal)
cd frontend && npm run dev
```

## Environment Variables
See `.env` files in `backend/` and `frontend/` directories.

## MVP Features (Complete)
✅ Metal signals (Gold, Silver, Diamond)
✅ Finance health score calculator
✅ Travel cost estimator

## Next Steps
- [ ] Integrate real APIs for metal prices
- [ ] Add fixed deposit and ETF signals
- [ ] Implement user authentication
- [ ] Add database for user data persistence

## Code Style
- Use ES6 modules
- Follow naming conventions: camelCase for functions/variables, PascalCase for components
- Add comments for complex logic
- Keep functions small and focused

## Common Tasks
- **Add new signal type**: Create route → Controller → Signal generator
- **Add new component**: Create in `src/components/` → Import in Dashboard
- **Add new API endpoint**: Create route file → Controller → Register in index.js
