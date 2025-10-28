# TechersGPT - Separated Applications

This directory contains 4 separated applications that can be run independently:

## Directory Structure

```
apps/
├── admin/          # Admin Portal Web App
├── customer/       # Customer Portal Web App  
├── provider/       # Service Provider Portal Web App
├── shared/         # Shared components, hooks, and utilities
└── mobile-apps/    # Mobile apps (already in root/mobile-apps/)
```

## Running the Apps

Each app runs on a different port:

- **Admin Portal**: Port 5001
  ```bash
  npm run dev:admin
  ```

- **Customer Portal**: Port 5002
  ```bash
  npm run dev:customer
  ```

- **Service Provider Portal**: Port 5003
  ```bash
  npm run dev:provider
  ```

- **Backend Server**: Port 5000 (shared by all apps)
  ```bash
  npm run dev:server
  ```

## Run All Apps Together

```bash
# Start backend + all 3 web apps
npm run dev:all
```

## Building for Production

```bash
# Build all apps
npm run build:all

# Build individual apps
npm run build:admin
npm run build:customer
npm run build:provider
```

## Access URLs (Development)

- Admin Portal: http://localhost:5001
- Customer Portal: http://localhost:5002
- Service Provider Portal: http://localhost:5003
- Backend API: http://localhost:5000

## Shared Code

All apps share common code from `apps/shared/`:
- Components (UI elements, forms, etc.)
- Hooks (custom React hooks)
- Services (API clients, business logic)
- Utilities (helper functions)
- Data (constants, mock data)

Changes to shared code affect all apps.

## Mobile Apps

Mobile apps are located in `/mobile-apps/` (root level):
- Customer App: `/mobile-apps/customer-app/`
- Provider App: `/mobile-apps/provider-app/`

See `/mobile-apps/SETUP_GUIDE.md` for mobile setup instructions.
