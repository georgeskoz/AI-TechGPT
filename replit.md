# TechersGPT - AI-Powered Technical Support Chat Application

## Overview
TechersGPT is a full-stack web application providing AI-powered technical support via a chat interface. It integrates a React frontend, Express backend, PostgreSQL database, and OpenAI's GPT-4. The platform features a multi-role interface (Customer, Service Provider, Administrator) with distinct settings and functionalities for each role. It offers portal-based authentication, domain-specific technical support across various categories, and a comprehensive marketplace for service providers. The vision is to streamline technical assistance, enhance user experience, and create an efficient ecosystem for both users seeking help and professionals offering it.

## User Preferences
Preferred communication style: Simple, everyday language.
Navigation preferences: 
- Chat page (/chat) should be the default home page route (/)
- TechGPT logo and Home button should navigate to chat page (/chat) instead of main page
- Added dedicated Chat button beside Home button for easy access to chat page from all pages

## System Architecture

### UI/UX Decisions
- **Multi-Role Interface**: Three-button switcher for Customer (blue), Service Provider (green), and Administrator (purple) views, each with distinct dashboards and functionality.
- **Styling**: Modern, professional design using Radix UI components with shadcn/ui styling and Tailwind CSS.
- **Visual Cues**: Consistent use of icons, color coding, and clear formatting for readability and intuitive navigation.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Branding**: Rebranded from TechGPT to TechersGPT, focusing on text-based branding.

### Technical Implementations
- **Frontend**: React with TypeScript, Vite, Wouter for routing, React Query for server state, React Hook Form with Zod for form handling.
- **Backend**: Node.js with Express.js, TypeScript, PostgreSQL with Drizzle ORM (Neon serverless), and Connect-pg-simple for session management.
- **AI Integration**: OpenAI GPT-4 for intelligent chat responses, AI-powered triage, feature discovery, and policy generation.
- **Authentication & Authorization**: Strict portal-based authentication with role-based access control, separate databases for customers and service providers, and secure session management.
- **Real-time Communication**: WebSocket integration for real-time chat, job dispatch, and notifications.
- **Dynamic Pricing**: Advanced algorithms for phone support and service requests considering factors like time, urgency, and distance.
- **Service Request Workflow**: Comprehensive 9-step booking flow for technicians with real-time matching, notifications, and automatic reassignment.
- **Invoice Management**: System for service providers to modify invoices with hardware items and services, including real-time tax calculation.
- **Admin Panel**: Comprehensive dashboard with 5-tier hierarchy, user/service provider/job management, financial reporting, analytics, and content management (coupons, notifications, email, policies).
- **Data Persistence**: File-based persistent storage for user data as a fallback to PostgreSQL.
- **Image Handling**: Profile picture upload with automatic image compression to prevent storage issues.

### Feature Specifications
- **AI-Powered Chat**: Domain-specific AI behavior across 9 technical categories with intelligent escalation to human support.
- **Live Support System**: AI-first approach with seamless human handoff, real-time chat, and case management.
- **Technician Marketplace**: Multi-step registration, comprehensive dashboard for service providers (earnings, job management), and real-time job matching.
- **Customer Portal**: Streamlined navigation for support services, issue categorization, and tracking.
- **Diagnostic Tools**: Management system for automated technical troubleshooting tools.
- **Policy Management**: AI-assisted generation and management of legal documents (Privacy, Refund, Cancellation, T&C).
- **Financial Systems**: Comprehensive earnings tracking for service providers, dynamic pricing, payout management, and North American tax management.
- **Notification System**: Real-time WebSocket notifications for job dispatch and system alerts.

## External Dependencies
- **Database**: Supabase PostgreSQL (migrated from local JSON files), Drizzle ORM.
- **AI/ML**: OpenAI (GPT-4).
- **UI Libraries**: Radix UI, shadcn/ui, Tailwind CSS, Lucide React (icons), cmdk (command palette).
- **State Management/Routing**: @tanstack/react-query, Wouter.
- **Form Handling/Validation**: React Hook Form, Zod.
- **Utilities**: date-fns.
- **Build Tools**: Vite, TypeScript, tsx, ESBuild.
- **Version Control**: GitHub integration via Replit connector.

## Recent Updates (October 2025)

### Database Migration to Supabase
- **Status**: Connected to Supabase PostgreSQL
- **Connection**: Using pooler connection for better performance
- **Data**: Service providers, customers, and users successfully connected

### Service Provider Portal (In Development)
- **Location**: `provider-portal/` directory
- **Status**: Prototype stage with complete UI structure
- **Features**:
  - Authentication (login/register) - ✅ Working
  - Dashboard with stats - ⚠️ Prototype (mock data)
  - Jobs management - ⚠️ Prototype (mock data)
  - Earnings tracking - ⚠️ Prototype (mock data)
  - Profile management - ⚠️ Prototype (mock data)
  - Messaging system - ⚠️ Prototype (mock data)
- **Next Steps**: 
  - Add authentication middleware to provider endpoints
  - Connect to real serviceProviderStorage
  - Integrate into main app OR deploy separately
- **See**: PROVIDER_PORTAL_STATUS.md for detailed status

### Mobile Applications (October 2025)
- **Status**: ✅ Complete and ready to deploy
- **Location**: `mobile-apps/` directory
- **Technology**: Expo + React Native for iOS/Android
- **Apps Available**:
  1. **Customer App** (`customer-app/`) - For users seeking technical support
     - Home dashboard with quick actions
     - AI chat support interface
     - Service categories browser
     - Profile management
  2. **Provider App** (`provider-app/`) - For service providers managing jobs
     - Earnings dashboard with stats
     - Job management (Active/Pending/Completed)
     - Earnings tracker with transactions
     - Availability toggle and profile settings
- **Features**: Single codebase deployment, bottom tab navigation, modern UI
- **Setup**: See `mobile-apps/SETUP_GUIDE.md` for complete instructions
- **Testing**: Use Expo Go app for instant testing on real devices
- **Publishing**: Ready for App Store and Google Play submission

### GitHub Integration
- Repository: georgeskoz/techersgpt-support-platform
- Connector: Installed and configured
- Manual push required for code sync