# TechersGPT - Separated Applications Guide

Your TechersGPT platform has been separated into 4 independent applications that can be run individually:

## 📱 The Four Applications

### 1. **Admin Web App** (Port 5001)
For platform administrators to manage the system.

### 2. **Customer Web App** (Port 5002)  
For customers to get technical support.

### 3. **Service Provider Web App** (Port 5003)
For technicians/service providers to manage their jobs.

### 4. **Mobile Apps**
- Customer Mobile App (iOS/Android)
- Provider Mobile App (iOS/Android)

## 🚀 How to Run Each App

### Backend Server (Required for all apps)
First, start the backend server:
```bash
npm run dev
```
The backend runs on port 5000 and handles API requests for all apps.

### Admin Portal
```bash
./start-admin.sh
```
Or manually:
```bash
vite --config apps/admin/vite.config.ts
```
Access at: **http://localhost:5001**

### Customer Portal
```bash
./start-customer.sh
```
Or manually:
```bash
vite --config apps/customer/vite.config.ts
```
Access at: **http://localhost:5002**

### Service Provider Portal
```bash
./start-provider.sh
```
Or manually:
```bash
vite --config apps/provider/vite.config.ts
```
Access at: **http://localhost:5003**

### Mobile Apps
See `/mobile-apps/SETUP_GUIDE.md` for instructions.

## 📦 Deploying to Your Own Hosting

Each app can be deployed to different hosting services:

### Building for Production

1. **Build Admin App**:
   ```bash
   vite build --config apps/admin/vite.config.ts
   ```
   Output: `dist/admin/`

2. **Build Customer App**:
   ```bash
   vite build --config apps/customer/vite.config.ts
   ```
   Output: `dist/customer/`

3. **Build Provider App**:
   ```bash
   vite build --config apps/provider/vite.config.ts
   ```
   Output: `dist/provider/`

4. **Build Backend**:
   ```bash
   esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
   ```
   Output: `dist/index.js`

### Deployment Options

#### Option 1: Deploy All to One Server (VPS/Heroku)
1. Build all apps
2. Upload entire project to server
3. Start backend: `node dist/index.js`
4. Serve each app's dist folder:
   - `/admin/` → `dist/admin/`
   - `/customer/` → `dist/customer/`
   - `/provider/` → `dist/provider/`

#### Option 2: Separate Deployments
Deploy each app to different domains/subdomains:

- **Admin**: `admin.yourdomain.com` → Upload `dist/admin/`
- **Customer**: `www.yourdomain.com` → Upload `dist/customer/`
- **Provider**: `provider.yourdomain.com` → Upload `dist/provider/`
- **Backend**: `api.yourdomain.com` → Upload backend code

#### Option 3: Mix & Match
- **Frontend Apps**: Vercel/Netlify (static hosting)
- **Backend**: Railway/Heroku (Node.js hosting)
- **Database**: Supabase (already using)

### Environment Variables Required

Set these on your hosting platform:
```
DATABASE_URL=your_supabase_connection_string
PGHOST=your_db_host
PGPORT=your_db_port
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
OPENAI_API_KEY=your_openai_key
SENDGRID_API_KEY=your_sendgrid_key
```

## 🎯 What Each App Contains

### Admin App (`apps/admin/`)
- User management
- Service provider management
- Pricing & commission rules
- Analytics & reports
- Content management
- System settings

### Customer App (`apps/customer/`)
- AI chat support
- Phone support booking
- Service provider marketplace
- Service tracking
- Profile management

### Provider App (`apps/provider/`)
- Job management
- Earnings tracking
- Customer messages
- Schedule & availability
- Profile & certifications

### Shared Code (`apps/shared/`)
- UI components (buttons, forms, etc.)
- Hooks (useAuth, useChat, etc.)
- Utilities & helpers
- API clients
- Styling (Tailwind CSS)

## 📝 Development Workflow

1. **Start backend**: `npm run dev` (always running)
2. **Start the app you're working on**:
   - Admin: `./start-admin.sh`
   - Customer: `./start-customer.sh`
   - Provider: `./start-provider.sh`
3. **Make changes** in `apps/[app-name]/src/` or `apps/shared/`
4. **Hot reload** happens automatically

## 🔧 Troubleshooting

### Port Already in Use
If you get port errors, stop the current process:
```bash
# Find process on port
lsof -i :5001  # or 5002, 5003
# Kill it
kill -9 <PID>
```

### Build Errors
Make sure all dependencies are installed:
```bash
npm install
```

### Database Connection
Ensure your DATABASE_URL is set correctly and database migrations are run:
```bash
npm run db:push --force
```

## 📚 Additional Resources

- Admin Portal: See `apps/admin/README.md`
- Customer Portal: See `apps/customer/README.md`
- Provider Portal: See `apps/provider/README.md`
- Mobile Apps: See `mobile-apps/SETUP_GUIDE.md`
- General Overview: See `apps/README.md`

## 🎉 Quick Start

**For development (run all together):**
1. Terminal 1: `npm run dev` (backend)
2. Terminal 2: `./start-admin.sh` (admin portal)
3. Terminal 3: `./start-customer.sh` (customer portal)
4. Terminal 4: `./start-provider.sh` (provider portal)

**For production deployment:**
1. Build all: See "Building for Production" above
2. Upload built files to your hosting
3. Set environment variables
4. Start the backend
5. Configure web server to serve static files

Your apps are now separated and ready to deploy anywhere! 🚀
