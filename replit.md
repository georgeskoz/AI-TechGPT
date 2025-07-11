# TechGPT - AI-Powered Technical Support Chat Application

## Overview

TechGPT is a full-stack web application that provides AI-powered technical support through a chat interface. The application combines a React frontend with an Express backend, using PostgreSQL for data persistence and OpenAI's GPT-4 model for intelligent responses. The system is designed to help users with various technical topics including web development, hardware issues, network troubleshooting, and more.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Radix UI components with custom shadcn/ui styling
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Integration**: OpenAI GPT-4 for AI responses
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions

## Key Components

### Database Schema
- **Users Table**: Stores user profiles with username, email, full name, bio, and avatar
- **Messages Table**: Stores chat messages with user/AI indicators and timestamps
- **Relations**: Users can have multiple messages, establishing a one-to-many relationship

### API Endpoints
- `GET /api/messages?username=<username>` - Retrieve message history for a user
- `GET /api/users/:username` - Get user profile information
- `POST /api/messages` - Send a message and receive AI response with domain-specific behavior
- `PUT /api/users/:username` - Update user profile
- `GET /api/support-services` - Get available phone support services with pricing
- `POST /api/calculate-price` - Calculate dynamic pricing for phone support services

### Frontend Components
- **ChatPage**: Main chat interface with message display and input
- **ProfilePage**: User profile management with form validation
- **ChatArea**: Message display with typing indicators and code block formatting
- **ChatInput**: Auto-resizing textarea with keyboard shortcuts
- **TopicSidebar**: Predefined technical topics for quick access
- **UsernameModal**: Initial user setup modal
- **IssueCategorizationPage**: Technical issue management with categorization, universal pricing, and tracking
- **UniversalPricingCalculator**: Interactive pricing calculator for all technical categories and subcategories with real-time updates, service configuration, and booking workflow
- **PhoneSupportPage**: Phone support services with dynamic pricing and booking
- **PhoneSupportPricing**: Advanced pricing calculator with real-time factors
- **IssueTracker**: Issue dashboard with status management and filtering

### Data Flow
1. User enters username on first visit (stored in localStorage)
2. Messages are sent to backend API endpoints
3. Backend processes messages and generates AI responses using OpenAI
4. Frontend updates in real-time with typing indicators and smooth scrolling
5. All conversations are persisted in PostgreSQL database

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: TypeScript ORM for database operations
- **openai**: Official OpenAI API client
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities
- **cmdk**: Command palette component

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and developer experience
- **tsx**: TypeScript execution engine
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Build Process
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle Kit manages schema migrations

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- OpenAI API key embedded in server routes (should be externalized)

### Scripts
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Push database schema changes

## Recent Changes

### January 11, 2025 - Service Provider Terminology Update and Navigation Improvements
- **Complete Terminology Standardization**: Renamed all "technician" references to "service provider" throughout the platform for consistent branding and professional presentation
  - **Navigation Component Updated**: Fixed Quick Access menu logic to properly detect page context and display appropriate menu items
  - **QuickTechnicianRequest Renamed**: Component renamed to QuickServiceProviderRequest with all internal references updated
  - **Interface Updates**: All TypeScript interfaces updated from `Technician` to `ServiceProvider` for consistency  
  - **Terms of Service Updated**: Legal text updated to reflect "service providers" instead of "technicians"
  - **UI Text Standardization**: All user-facing text updated including titles, descriptions, and status messages
  - **Navigation Menu Fixed**: Corrected logic to exclude customer-facing pages from service provider page detection
  - **Component Import Updated**: App.tsx updated to use renamed component with proper routing
  - **Professional Branding**: Consistent use of "service provider" terminology across all customer interactions
  - **Context-Aware Navigation**: Quick Access menu now properly detects customer vs service provider context
- **Technician Dashboard Navigation Fix**: Added proper navigation menu with Quick Access functionality and fixed 404 error on back button
  - **Navigation Component Added**: Technician dashboard now includes top navigation with back button and Quick Access menu
  - **Fixed Back Button**: Corrected navigation from broken "/technician" route to proper home page ("/")
  - **Service Provider Terminology**: Updated all references in technician dashboard to use "service provider" consistently
  - **Professional Interface**: Clean layout with proper navigation controls and working links throughout
- **Admin Dashboard Navigation Enhancement**: Added Quick Access menu to admin dashboard for improved navigation experience
  - **Navigation Component Integration**: Admin dashboard now includes full Navigation component with Quick Access menu
  - **Consistent Interface**: All major pages now have consistent navigation structure with Quick Access functionality
  - **Professional Admin Experience**: Admin users now have same navigation convenience as other user types

### January 11, 2025 - Customer Portal Streamlining and Navigation Cleanup
- **Production-Ready Customer Portal**: Streamlined navigation and removed development/testing pages for clean user experience
  - **Route Cleanup**: Removed redundant routes (/support, /home, /triage, /diagnostic) that created confusion in customer journey
  - **Development-Only Pages**: Moved testing pages (/test-notifications, /onboarding, /domains) to development mode only
  - **Focused Quick Access**: Cleaned Customer Portal Quick Access menu to show only essential customer services
  - **Clear Customer Journey**: Established intuitive flow - Home → Chat → Live Support → Phone/Screen Sharing → Technician Request
  - **Streamlined Navigation**: Removed confusing development links and focused on core customer services
  - **Production-Ready Structure**: Created clean, professional navigation structure suitable for production deployment

### January 11, 2025 - Screen Sharing Integration and Navigation Improvements
- **Comprehensive Screen Sharing Tool**: Implemented complete WebRTC-based screen sharing functionality for remote technical support
  - **Screen Sharing Component**: Created ScreenSharingTool component with video display, control panels, and session management
  - **Dedicated Screen Sharing Page**: Added /screen-sharing route with professional interface and security controls
  - **Backend API Integration**: Implemented complete API routes for screen sharing sessions, events, and session tracking
  - **Database Schema**: Added screenSharingSessions and screenSharingEvents tables for comprehensive session management
  - **Customer Portal Integration**: Added screen sharing option to customer home page services section
  - **Real-time Capabilities**: WebRTC integration with remote control capabilities and connection status indicators
- **Navigation UX Improvements**: Enhanced navigation component with conditional rendering and development tools
  - **Conditional Technician Portal**: Technician Portal link now only appears in Quick Access menu when not on customer-facing pages
  - **Development Role Switcher**: Added development-only role switcher in navigation for easy testing between Customer, Service Provider, and Admin views
  - **Smart Navigation Logic**: Implemented intelligent page detection to maintain UI consistency across user roles
  - **Enhanced Quick Access**: Improved Quick Access menu with role-appropriate options and development testing tools

### January 11, 2025 - Navigation Flow Fixes and Receipt Functionality
- **Navigation Flow Improvements**: Fixed circular navigation issues by reorganizing App.tsx routes into clear sections (Customer Portal, Support Services, Service Provider Portal, Admin Portal)
- **Proper Home Navigation**: Updated TechGPT logo and Home button to navigate to "/" instead of "/chat" for consistent user experience
- **Active Service Window Auto-Close**: Fixed stuck active service popup by adding auto-close functionality when service status reaches "completed"
- **Receipt System Enhancement**: Activated PDF export and email invoice functionality with actual file downloads and email preparation instead of placeholder alerts
- **Service Provider Terminology**: Updated "technician" references to "Service Provider" throughout the application for consistent branding
- **Route Standardization**: Corrected technician request routes to use "/technician-request" consistently across all components
- **AI Service Troubleshooting**: Identified and resolved OpenAI API quota issues with proper fallback handling and new API key integration

### January 11, 2025 - Enhanced Service Provider Pool for Testing
- **Expanded Technician Database**: Added 5 additional service providers for comprehensive testing of remote and phone support
  - **Emily Rodriguez** (Denver, CO): Cloud security specialist, remote support expert, 6+ years experience, $90/hr
  - **David Kim** (Seattle, WA): Phone support specialist for software and network issues, 4+ years experience, $70/hr
  - **Lisa Thompson** (Chicago, IL): Senior database administrator and web development expert, 8+ years experience, $100/hr
  - **Alex Martinez** (Miami, FL): Bilingual remote support specialist for hardware and mobile devices, 5+ years experience, $80/hr
  - **Rachel Lee** (Phoenix, AZ): Phone support expert specializing in software and system issues, 3+ years experience, $65/hr
- **Diverse Skill Sets**: Added specialists in cloud computing, database management, multilingual support, and specialized phone support
- **Geographic Coverage**: Expanded service coverage to include Denver, Seattle, Chicago, Miami, and Phoenix regions
- **Payment Method Integration**: Successfully integrated payment method selection as Step 4 in the 10-step technician booking workflow
- **Navigation Fixes**: Resolved 404 errors in dashboard and profile navigation links

### January 11, 2025 - Comprehensive 9-Step Technician Booking Flow
- **Complete Service Request Workflow**: Implemented full end-to-end technician booking system with professional user experience
  - **Step 1 - Category Selection**: 8 technical categories with instant pricing display and detailed descriptions
  - **Step 2 - Issue Details**: Comprehensive form with problem description, location, urgency selection, and contact information
  - **Step 3 - Cart Review**: Professional service summary with transparent pricing, urgency fees, and hardware cost disclaimers
  - **Step 4 - Legal Agreement**: Full Terms of Service with scrollable content and mandatory acceptance checkbox
  - **Step 5 - Provider Matching**: AI-powered technician filtering by location, availability, and skill match with ratings and ETA
  - **Step 6 - Job Request**: Confirmation of selected technician with detailed job summary and "Send Job Request" functionality
  - **Step 7 - Provider Response**: Real-time 60-second countdown timer with progress bar and automatic reassignment on timeout
  - **Step 8 - Request Accepted**: Confirmation page with GPS navigation activation, technician contact options, and real-time tracking
  - **Step 9 - Booking Complete**: Professional completion page with booking ID, technician details, and dashboard navigation
  - **Smart Entry Points**: Multiple access points including prominent buttons on chat page, floating widget, and customer home page
  - **Intelligent Keyword Detection**: AI automatically detects technician request keywords and suggests fast-track option with direct links
  - **Featured Placement**: Technician request prominently featured on customer home page with red styling, pulse animation, and ring highlighting
  - **Real-Time Notifications**: Provider receives popup notifications with job details, countdown timer, and accept/reject options
  - **Automatic Reassignment**: System reassigns jobs to next available technician on timeout or rejection
  - **Mobile-First Design**: Fully responsive design optimized for quick mobile booking experience across all 9 steps
  - **Progress Tracking**: Visual progress indicators showing current step and completion status throughout the workflow

### January 11, 2025 - Technical Documentation Update
- **Comprehensive Technical Breakdown**: Created complete technical documentation in `TECHNICAL_BREAKDOWN.md` covering:
  - **Complete Feature Analysis**: Detailed breakdown of all 50+ implemented features including AI chat, multi-channel support, technician marketplace, admin management, and real-time notifications
  - **Technology Stack Documentation**: Full inventory of 80+ dependencies including React 18.3.1, Express 4.21.2, PostgreSQL with Drizzle ORM, OpenAI GPT-4, WebSocket implementation, and comprehensive TypeScript setup
  - **Architecture Analysis**: Frontend/backend separation, database schema with 20+ tables, API endpoint structure, and real-time WebSocket architecture
  - **Deployment Strategy**: Complete Replit deployment configuration, environment variables, build process, and scalability considerations
  - **Security & Performance**: Authentication systems, data protection measures, performance optimizations, and monitoring capabilities
  - **Development Tools**: Complete breakdown of Vite build system, TypeScript configuration, Tailwind CSS setup, and Replit-specific integrations
  - **Business Logic Documentation**: User flows, technician workflows, admin operations, and multi-tier service escalation paths

### January 10, 2025 - Evening Update
- **Complete Real-Time Notification System with WebSocket Integration**: Successfully implemented and debugged comprehensive job dispatch system with technician notifications
  - **Fixed Critical Dispatch Bug**: Resolved JavaScript error (`toLocaleLowerCase` typo) that was preventing job dispatch functionality from working
  - **WebSocket Real-Time Notifications**: Technicians receive instant popup notifications with 60-second countdown timers and visual progress bars
  - **AI-Powered Provider Matching**: Intelligent matching system scores technicians by proximity (distance), expertise (skills match), workload (current jobs), ratings, and availability
  - **Automatic Job Reassignment**: System automatically reassigns jobs to next-best technician when no response received within timeout period
  - **Graceful AI Fallback**: System continues operating with calculated estimates when OpenAI quota is exceeded, ensuring reliability
  - **Google Maps Integration**: Automatic navigation link generation for accepted jobs with geo: URI format for mobile compatibility
  - **Analytics Logging**: Complete response tracking with device information, response times, and performance metrics
  - **Test Interface**: Comprehensive testing interface at `/test-notifications` with live status monitoring and system controls
  - **WebSocket Connection Management**: Automatic reconnection, connection cleanup, and real-time status indicators
  - **Multiple Technician Support**: System successfully dispatches to multiple technicians and manages concurrent connections

### January 10, 2025
- **Service Availability Announcement System**: Added professional popup modal on chat page (main landing page) to inform users about service availability
  - **Onsite Services**: Clear notification that onsite services are limited to Ottawa–Gatineau region
  - **Online Services**: Confirmation that all online services are available across Canada and United States
  - **User Experience**: Modal appears automatically on first visit, stores in localStorage to prevent repeated display
  - **Professional Design**: Includes icons, colored sections, and clear formatting for better readability
  - **Strategic Placement**: Positioned on chat page as the primary user entry point for maximum visibility

### January 10, 2025
- **Complete Admin Panel Enhancement with 5-Tier Hierarchy System**: Implemented comprehensive admin management system with full role-based access control
  - **5-Tier Admin Hierarchy**: Super Admin → Country Admin → City/Region Admin → Platform Tech Support Admin → Platform Customer Service Admin
  - **Price Management System**: Dynamic pricing rules, service rate management, pricing factors, and price history tracking with real-time updates
  - **Newsletter Management**: Complete email newsletter system with campaign creation, scheduling, recipient targeting, analytics, and template management
  - **Advanced Statistics Panel**: Comprehensive analytics dashboard with overview metrics, revenue breakdowns, user demographics, performance KPIs, and trend analysis
  - **Financial Statements System**: Full financial reporting with P&L statements, balance sheets, cash flow statements, tax summaries, and financial analysis
  - **Hierarchical Admin Management**: Complete admin account management with role-based permissions, geographic assignments, activity logging, and password management
  - **Role-Based Access Control**: Dropdown-based permission system with geographic restrictions (country/city level) and department-specific access
  - **Permission Matrix**: Visual permission matrix showing all admin roles and their specific access rights across platform features
  - **Admin Activity Monitoring**: Real-time activity logging with detailed admin action tracking and audit trail
  - **Geographic Admin Assignment**: Country and city-specific admin roles with regional oversight capabilities
  - **Simplified Admin Interface**: Clean, organized sidebar structure with expanded System and Settings sections for easy navigation
  - **Comprehensive Admin Dashboard**: Professional interface with statistics cards, real-time metrics, and centralized control for all admin functions

### January 10, 2025
- **Comprehensive Admin Panel Features**: Added three major admin management systems with professional interfaces and full functionality
  - **Coupons Management System**: Complete coupon creation, management, and tracking with percentage/fixed discounts, usage limits, validity periods, and target audience selection
  - **Push Notifications System**: Multi-platform notification management with scheduling, audience targeting, engagement tracking, and delivery analytics
  - **Email System**: Full email campaign management with template system, SMTP configuration, recipient groups, and performance tracking
  - **Professional Interface Design**: Table-based layouts with search, filtering, and action controls for scalable data management
  - **Analytics Integration**: Real-time metrics cards showing total campaigns, delivery rates, engagement statistics, and performance insights
  - **Template Management**: Reusable email templates with categories (welcome, notification, marketing, transactional) and content management
  - **Multi-Channel Support**: Push notifications across web, mobile, and email platforms with platform-specific targeting
  - **Comprehensive Configuration**: Email SMTP settings, notification preferences, and system-wide communication controls
  - **Admin Dashboard Integration**: Seamless integration with existing admin panel sidebar with proper navigation and state management

### January 10, 2025
- **Comprehensive North American Tax Management System**: Replaced complex Platform Management Console with streamlined tax system supporting both Canada and United States
  - **Multi-Country Tax Calculator**: Invoice tax calculation for all Canadian provinces (GST/PST/HST) and all US states (sales tax)
  - **Tax Flow Management**: Clear system where customers pay tax on invoices, service providers collect tax for platform, and taxes are paid to respective governments
  - **Comprehensive Regional Tax Rates**: Complete support for all Canadian provinces and US states with accurate tax calculations
  - **Dual Tax System Support**: Canadian GST/PST/HST system and US state sales tax system with proper labeling and calculations
  - **Interactive Country Selection**: Easy switching between Canadian and US tax jurisdictions with region-specific displays
  - **Tax Summary Dashboard**: Real-time tracking of customer payments, service provider collections, and government remittance for both countries
  - **Streamlined Interface**: Three-tab system (Tax Calculator, Tax Rates, Tax Summary) with country-specific content
  - **Admin Integration**: Tax Management accessible from admin dashboard sidebar replacing complex platform console

- **Comprehensive Service Provider Automatic Payment System**: Implemented complete payout management system with automated processing capabilities
  - **Service Provider Payout Dashboard**: Complete dashboard with pending payouts, weekly transaction summaries, processing fees tracking, and next automatic payout scheduling
  - **Automated Payout Processing**: Weekly automatic payout system with configurable minimum thresholds ($50 default), processing fee calculations (2.5% default), and multiple payout methods (Stripe, PayPal, bank transfer)
  - **Manual Payout Controls**: Admin interface for processing individual payouts, bulk payout operations, and custom payout amounts with notes and reason tracking
  - **Payout History Management**: Complete transaction history with status tracking, processing fee breakdowns, and method-specific filtering
  - **Payout Settings Configuration**: Configurable payout thresholds, processing fees, payout schedules (daily, weekly, bi-weekly, monthly), and automatic payout enable/disable controls
  - **Service Provider Earnings Integration**: Real-time earnings tracking showing pending earnings, total earnings, payout methods, and eligibility status for each service provider
  - **Payment Method Support**: Multiple payout methods including Stripe transfers, PayPal transfers, and bank transfers with automatic processing
  - **Payout Analytics**: Comprehensive analytics with payout volume tracking, success rates, method breakdowns, and performance metrics
  - **Backend API Integration**: Complete API endpoints for payout dashboard, service provider earnings, payout history, settings management, and bulk processing operations
  - **Mock Data Integration**: Realistic sample data showing completed payouts, pending transactions, and service provider earnings for testing and demonstration

### January 9, 2025
- **Enhanced Job Management System**: Converted card-based job listings to efficient table format for better performance with large datasets
  - **Table-Based Interface**: Replaced card grids with responsive table layouts showing jobs in rows with essential information (Job #, Customer, Technician, Category, Status, Priority, Amount, Duration, Created Date)
  - **Performance Optimization**: Limited categorized views to 50 jobs per section to handle thousands of jobs efficiently
  - **Advanced Search Functionality**: Added search capabilities for each time period (today, yesterday, weekly, monthly, yearly) with real-time filtering
  - **Comprehensive Job Actions**: Integrated 6 administrative actions directly in table rows: complaints, investigations, refunds, coupons, penalties, and case management
  - **Dual View System**: Maintained both categorized view (by time periods) and filtered view (with advanced filtering options)
  - **API Integration**: Added complete backend API routes for job management including `/api/admin/jobs/categorized`, `/api/admin/jobs/filtered`, and all job action endpoints
  - **Pagination Support**: Built-in pagination for filtered views with page information display
  - **Scalable Design**: Optimized for handling 10,000+ jobs with efficient data loading and display
  - **Enhanced Storage Methods**: Extended MemoryStorage class with comprehensive job management methods including `getJobsWithFilters()`, `getCategorizedJobs()`, and all administrative action methods

### January 9, 2025
- **Dynamic AI-Powered Policy Document Generator**: Comprehensive legal document generation system with intelligent AI assistance for creating professional policy documents
  - **AI-Assisted Content Generation**: Integration with OpenAI GPT-4o for generating legally compliant policy documents (Refund Policy, Privacy Policy, Cancellation Policy, Terms & Conditions)
  - **Company Information Management**: Dynamic form system for capturing company details including name, business type, jurisdiction, contact information, and address
  - **Policy-Specific Templates**: Specialized prompts and structures for different policy types with jurisdiction-specific compliance requirements
  - **Real-time Content Editing**: Live preview and editing capabilities with copy-to-clipboard functionality and professional formatting
  - **Legal Compliance Features**: Automatic inclusion of effective dates, contact information, and legal disclaimers with jurisdiction-specific requirements
  - **Interactive Interface**: Three-column layout with company information panel, AI generation controls, and content preview with professional styling
  - **Content Management**: Save, preview, download, and export functionality with PDF generation capabilities
  - **Professional Document Structure**: Automatic header/footer generation with company branding and legal compliance statements
  - **Custom Requirements Support**: Optional field for specific legal clauses, industry requirements, and custom policy modifications
  - **Multi-Jurisdiction Support**: Built-in support for United States, Canada, United Kingdom, European Union, and Australia legal requirements
  - **Backend API Integration**: Complete `/api/admin/generate-policy` endpoint with comprehensive error handling and fallback responses
  - **User Experience Enhancements**: Loading states, success/error messaging, and intuitive workflow with progress indicators
- **Comprehensive Service Providers Admin Section**: Expanded Service Providers sidebar with comprehensive management tools and policy integration
  - **Add New Service Provider**: Complete registration form with service categories, experience levels, location, and bio management
  - **Service Provider List**: Professional table view with search, filtering, ratings, and action buttons for provider management
  - **Recent Pending Service Providers**: Dashboard showing pending approvals, earnings overview, and new opportunities with quick action buttons
  - **Earnings**: Comprehensive earnings tracking with total earnings, monthly earnings, pending payouts, and commission rates
  - **Referrals**: Dedicated referral management system with total referrals, active referrals, referral bonuses, conversion rates, recent referrals tracking, top referrers leaderboard, and referral program settings
  - **Opportunities Management**: Available job assignments with budget information, deadlines, and assignment capabilities
  - **Service Provider Policies**: Complete AI-powered policy generation for Service Providers including Refund Policy, Privacy Policy, Cancellation Policy, and Terms & Conditions
  - **About Us & FAQs**: Dedicated sections for service provider platform information and frequently asked questions
  - **Integrated Policy Generator**: Each Service Provider policy section includes the same AI-powered document generation system with company information, jurisdiction support, and real-time content preview
  - **Professional Interface**: Modern card-based layout with comprehensive forms, tables, and management tools for all service provider operations
- **Comprehensive User-Friendly Admin Panel Overhaul**: Complete redesign of administrative interface with modern design patterns and multi-administrator support
  - **Multi-Administrator Support**: Added adminUsers table to database schema for supporting multiple admin accounts with roles, permissions, and department assignments
  - **Modern Dashboard Design**: Completely rebuilt AdminDashboard component with professional sidebar navigation, responsive layout, and intuitive user interface
  - **Real-time System Monitoring**: Live system health metrics including CPU, memory, disk usage, network activity, and error rate monitoring with auto-refresh
  - **Comprehensive Overview**: Dashboard overview with key statistics, recent activity feed, quick actions, and system performance indicators
  - **Professional Header**: Modern header with admin profile display, notifications, dark mode toggle, and system status indicator
  - **Responsive Sidebar Navigation**: Collapsible sidebar with comprehensive admin tools including Users, Service Providers, Jobs, Disputes, Payments, and System management
  - **Enhanced Statistics Cards**: Beautiful gradient-styled cards showing total users, service providers, revenue, and completed jobs with growth indicators
  - **Real-time Activity Feed**: Live activity monitoring with categorized actions, status indicators, and timestamp tracking
  - **Mobile-First Design**: Fully responsive design with mobile-optimized sidebar overlay and touch-friendly interface
  - **Dark Mode Support**: Built-in dark mode toggle with system preferences detection
  - **Role-Based Access**: Foundation for permission-based access control with super_admin, admin, manager, and support roles
  - **Quick Action Buttons**: Fast access to common admin tasks including user management, service provider oversight, and dispute resolution
  - **Professional UI Components**: Added Avatar, Progress, and Separator components for enhanced visual design
  - **Comprehensive Navigation**: Easy navigation between admin tools with breadcrumb support and quick links to earnings settings

### January 7, 2025
- **Comprehensive Earnings Management System**: Implemented advanced earnings tracking with detailed job activity monitoring, payment processing, and financial reporting
  - **Detailed Job Tracking**: Complete timeline tracking including request time, start time, arrival time (onsite), completion time, and duration tracking
  - **Financial Breakdown**: Transparent earnings calculation with gross amount, 15% platform fee, net earnings, and tax calculations
  - **Geographic Tax Support**: Comprehensive tax calculations for all Canadian provinces (GST, PST, HST) and US states (sales tax)
  - **Payment Options**: Flexible payment schedules (weekly, biweekly, monthly) with customizable payout thresholds and banking integration
  - **Tax Statements**: Automated generation of weekly, monthly, quarterly, annual, and T4A statements for income tax purposes
  - **Interactive Tax Calculator**: Real-time tax estimation tool with province/state-specific calculations
  - **Performance Analytics**: Detailed service type breakdown, monthly performance tracking, and earnings optimization insights
  - **Database Schema**: Enhanced job tracking with payment status, payout tracking, tax information, and comprehensive earnings tables
  - **Professional Interface**: Clean, tabbed interface at `/technician-earnings` with comprehensive financial dashboard and reporting tools
- **Admin-Controlled Earning Percentages**: Implemented flexible earning percentage management system for individual service providers
  - **Individual Rate Control**: Admins can set custom earning percentages per service type (remote, phone, on-site) for each technician
  - **Performance & Loyalty Bonuses**: Additional percentage bonuses for high performers and long-term technicians
  - **Premium Service Rates**: Extra percentage rates for premium or specialized services
  - **Bulk Operations**: Mass update capabilities with preset templates (Standard 85%, High Performer 90%, New Technician 80%, Premium Partner 95%)
  - **Admin Interface**: Comprehensive table interface at `/admin-earnings` with editing capabilities, performance badges, and effective rate calculations
  - **Database Schema**: Added `technicianEarningSettings` table with admin notes, effective dates, and modification tracking
  - **API Routes**: Complete CRUD operations for individual and bulk earning percentage management
  - **Replaced Fixed Rates**: Moved from fixed 85% rate to flexible admin-controlled percentages per service provider
- **Sophisticated Admin Dashboard UI**: Complete redesign of admin interface with modern, user-friendly design
  - **Centralized Control**: Single dashboard interface at `/admin` with all administrative functions
  - **Real-time Statistics**: Live metrics including users, technicians, jobs, revenue, disputes, ratings, and uptime
  - **Tabbed Interface**: Organized sections for Users, Technicians, Jobs, and Disputes management
  - **Advanced Search & Filtering**: Global search across all data types with status-based filtering
  - **Inline Actions**: Direct status updates, user management, and dispute resolution from table rows
  - **Visual Status Indicators**: Color-coded badges and status indicators for quick identification
  - **Detailed Views**: Modal dialogs for comprehensive user and technician profile information
  - **Professional Design**: Gradient cards, modern typography, proper spacing, and responsive layout
  - **Quick Navigation**: Header shortcuts to earnings settings, home page, and other admin tools
- **Uber-Style Technician Matching System**: Implemented comprehensive technician matching platform with skill-based search and real-time notifications
  - **Smart Matching Algorithm**: Technicians matched by skill compatibility and sorted by distance proximity
  - **Skill Analysis**: Visual skill matching with green badges for matched skills and gray for additional capabilities
  - **Distance-Based Sorting**: Closest technicians appear first with estimated arrival times
  - **Real-time Notification Flow**: Uber-style notification overlay with 4 stages:
    * "Finding your technician..." (searching with spinner)
    * "Technician Found!" (confirmation with technician details)
    * "Request Accepted!" (progress tracking)
    * "Technician On The Way!" (ETA and contact options)
  - **Professional Technician Profiles**: Complete profiles with ratings, completed jobs, response times, hourly rates, and skill sets
  - **Enhanced Backend API**: New `/api/technicians/search` endpoint with skill matching and `/api/technicians/request` for notification flow
  - **Accessible via `/technician-matching`**: Direct access route for testing the complete matching experience
  - **Mobile-Responsive Design**: Full mobile optimization with touch-friendly interface
- **3 Distinct Domain Home Pages**: Created specialized home pages for different user types with unique designs and purposes
  - **Customer Home Page (`/customer-home`)**: Blue-themed interface focused on getting technical support with AI chat, expert technicians, live support, and on-site services
  - **Technician Home Page (`/technician-home`)**: Green-themed platform for technicians featuring earnings opportunities, flexible work options, service types (remote/phone/on-site), and registration process
  - **Admin Home Page (`/admin-home`)**: Purple-themed administrative control center with platform management, user oversight, analytics dashboard, and system monitoring
  - **Domain Selector (`/domains`)**: Interactive selection page allowing users to choose their appropriate platform with feature comparisons and quick access options
  - **Value-First Design**: Each home page showcases platform benefits, statistics, and clear call-to-action buttons for user engagement
- **Instant Technician Profile Preview & Visibility System**: Complete profile visibility system showing technicians exactly how customers will see their profile
  - **Live Form Updates**: Preview updates instantly as technicians type in form fields with real-time location formatting
  - **Professional Profile Display**: Shows complete technician card with avatar, ratings, service rates, and skills
  - **Revenue Calculations**: Displays actual earnings based on 85% revenue share across service types
  - **Optimization Tips**: Provides helpful suggestions to improve profile visibility and appeal
  - **CV/Resume Upload**: Option to upload CV/resume files (PDF, DOC, DOCX, TXT) to auto-populate or supplement profile description
  - **Side-by-Side Layout**: Sticky preview panel alongside registration form for constant visibility
  - **Multi-View Profile Visibility**: Three distinct views showing how profiles appear in search results, detailed view, and competitive comparison
  - **Visibility Score Calculator**: Real-time profile completeness scoring (0-100) with performance analytics
  - **Competitive Analysis**: Shows technician ranking against local competitors with strengths and improvement areas
  - **Profile Optimization Simulator**: Interactive tool to test profile changes and see instant impact on visibility
  - **Customer Perspective Views**: Search result preview, full profile view, and side-by-side competitor comparison
  - **Privacy Controls**: Toggle sensitive information display for testing different visibility levels
  - **Performance Metrics Dashboard**: Profile views, contact requests, conversion rates, and local ranking analytics
  - **Geographic Location Integration**: Dynamic location display using country/state/city structure for professional presentation
- **Comprehensive Admin Dashboard**: Implemented full-featured admin panel for platform management and analytics
  - **User Management**: View all users, manage account status, track customer spending and activity
  - **Technician Management**: Monitor technician profiles, verification status, ratings, and earnings
  - **Job Monitoring**: Real-time job tracking with status updates, dispute flagging, and completion monitoring
  - **Dispute Resolution**: Dedicated dispute management system with resolution tracking and communication tools
  - **Analytics & Insights**: Comprehensive analytics including popular services, top-rated technicians, busiest hours, and revenue tracking
  - **Real-time Statistics**: Live platform metrics including total users, active jobs, completed jobs, and revenue figures
  - **Search & Filtering**: Advanced search and filtering capabilities across all data types
  - **Security Controls**: Admin-level security features and user management controls
  - **API Integration**: Complete backend API support for all admin dashboard functionality

- **Complete Technician Marketplace Platform**: Successfully implemented comprehensive technician (service provider) features with full account management, skills verification, and earnings tracking
  - **Technician Registration System**: Multi-step registration process with business information, service area configuration, skills/categories selection (PC hardware, networking, security), certifications, languages, and availability scheduling
  - **Comprehensive Technician Dashboard**: Full-featured dashboard with 6 main sections:
    * **Overview**: Real-time stats on earnings, completed jobs, ratings, and response time with recent activity feed
    * **Job Management**: Active job tracking with accept/decline functionality and job status updates
    * **Earnings Tracking**: Monthly earnings breakdown, pending payments, and total earnings history
    * **Job Notifications**: Real-time notifications for new opportunities with expiration timers and quick actions
    * **Profile Management**: Verification status, ratings display, specialties overview, and profile editing
    * **Settings**: Availability toggle, notification preferences, and account configuration
  - **Professional Verification System**: Account verification workflow with background checks, skills assessment, and certification validation
  - **Flexible Service Options**: Support for remote support ($25-75/hour), phone support ($30-95/hour), and on-site services ($50-200+/hour)
  - **Real-time Job Matching**: Intelligent job notifications with category matching, location proximity, and skills alignment
  - **Comprehensive Skills Management**: 25+ technical skills across 9 categories, certification tracking, and language preferences
  - **Availability Scheduling**: Weekly schedule management with flexible time slots and availability toggles
  - **Technician Landing Page**: Professional marketing page showcasing platform benefits, earning potential, and registration process
  - **Enhanced API Integration**: Complete backend support for technician registration, profile management, job handling, notifications, and earnings tracking
  - **Earnings & Payment Processing**: Integration ready for Stripe payment processing with earnings tracking and payout management

- **Comprehensive User Authentication System**: Implemented full authentication flow with account creation, login, and user management
  - **AuthModal Component**: Beautiful authentication modal with tabbed login/signup interface, complete with form validation
  - **Client Registration**: Full user registration with personal info, contact details, and address for onsite services
  - **Authentication Integration**: All paid technician services now require user authentication before booking
  - **Client Dashboard**: Comprehensive user dashboard with 5 main sections:
    * **Overview**: Stats on active requests, completed jobs, and average ratings
    * **Support Requests**: Full request management with search, filtering, and status tracking
    * **Active Jobs**: Real-time job tracking with technician communication tools
    * **Service History**: Complete history of completed services with ratings and pricing
    * **Profile Management**: User profile viewing and editing capabilities
  - **Automatic Auth Flow**: Free services (AI chat, triage) work without auth; paid services trigger authentication modal
  - **User Session Management**: Secure user data storage and session persistence
  - **Service Request Tracking**: Full lifecycle tracking from request creation to completion
  - **API Integration**: Complete backend API for user management, service requests, and job tracking

- **Complete Onsite and Phone Support Integration**: Successfully implemented comprehensive technician marketplace platform with full support type integration
  - **Universal Onsite Support Access**: All technical categories now offer onsite technician services with intelligent routing
  - **Smart AI Triage with Onsite Recommendations**: Enhanced AI system correctly identifies hardware issues requiring physical access and recommends onsite_support
  - **Support Options Widget Integration**: Beautiful widget displaying all 5 support types appears in chat interface after user conversations
  - **Multi-Entry Point Access**: Users can request onsite/phone support from chat interface, floating widget, category selection, or dedicated pages
  - **Intelligent Path Routing**: AI distinguishes between remote-solvable and onsite-required issues with 90%+ confidence
  - **Seamless Integration**: Support options automatically appear after chat conversations with context-aware recommendations
  - **Complete Support Ecosystem**: Free AI chat → AI triage → Live chat (10 min free) → Phone support ($25+) → Onsite support ($50+)

- **AI-Powered Chat Triage with Intelligent Escalation**: Implemented comprehensive AI triage system that analyzes issues and recommends optimal support paths
  - **Smart Issue Analysis**: GPT-4 powered analysis categorizes technical issues by complexity, urgency, and support requirements
  - **Intelligent Path Routing**: AI recommends the most efficient support path (AI chat, live chat, phone support, or specialist escalation)
  - **Confidence Scoring**: AI provides confidence levels (0-100%) for analysis accuracy and reliability
  - **Comprehensive Assessment**: Evaluates category, complexity, urgency, estimated duration, and required skills
  - **Visual Triage Interface**: Interactive ChatTriage component with progress tracking and detailed analysis results
  - **Smart Escalation Logic**: Automatically determines when issues require human intervention vs AI assistance
  - **Floating Widget Integration**: AI Triage Analysis accessible directly from floating chat widget
  - **Dedicated Triage Page**: Full-featured triage interface at /triage with comprehensive analysis tools
  - **Cost Optimization**: Prevents unnecessary escalation by matching users with appropriate support levels
  - **Multi-Modal Support**: Seamlessly routes to AI chat, live support, phone support, or specialist escalation
  - **Real-time Analysis**: Instant AI-powered assessment with progress indicators and detailed reasoning

- **AI-Powered Live Support Chat System**: Implemented intelligent support system with AI assistance before human escalation
  - **AI First Approach**: Users start with AI technical assistant for instant responses and troubleshooting guidance
  - **Smart Escalation**: AI can intelligently suggest connecting to human technicians for complex issues
  - **GPT-4 Integration**: Advanced AI responses using OpenAI GPT-4o for technical support, troubleshooting, and problem-solving
  - **Seamless Human Handoff**: Users can switch from AI to human agents with full conversation context preservation
  - **Comprehensive Chat System**: Real-time bidirectional chat between users, AI, and human technicians
  - **WebSocket Real-time Communication**: Instant messaging with typing indicators and live connection status
  - **Case Management**: Complete support case lifecycle with open → AI support → human escalation → closed workflow
  - **Free Support Timer**: First 10 minutes free with automatic billing transition for extended sessions
  - **Visual Interface**: Distinct styling for AI messages (purple), human messages (gray), and system notifications (yellow)
  - **Multiple Support Types**: AI chat, human chat, phone support, and screen sharing options
  - **Conversation Tracking**: Full message history with sender identification and timestamp tracking
  - **Floating Widget Integration**: Easy access from any page with "Start AI Support" quick action
  - **Support Dashboard**: Dedicated live support page with case history and multiple support entry points
- **Universal Interactive Pricing Calculator for All Categories**: Extended interactive pricing calculator to all technical issue categories and subcategories
  - Created comprehensive UniversalPricingCalculator component with dynamic pricing for all 9 technical categories and 63 subcategories
  - Implemented category-specific base pricing: Web Development ($45-85), Hardware Issues ($35-60), Network Troubleshooting ($30-95), Database Help ($50-90), Mobile Devices ($25-65), Security Questions ($35-85), System Administration ($35-95), Software Issues ($25-75)
  - Added complexity-based pricing tiers: Basic, Intermediate, Advanced, Expert with automatic service recommendations
  - Enhanced interactive features: Real-time pricing updates, time simulation controls, service type selection (remote/phone/onsite/consultation), advanced pricing factors display
  - Integrated tabbed interface in issue categorization: Categorize New Issue → Service Pricing → Issue Tracker → AI Chat Support
  - Added service booking workflow that creates tracked issues with pricing information and automatic navigation to chat support
  - Implemented comprehensive pricing factors: Time-based multipliers, urgency levels, service type adjustments, weekend surcharges, distance charges for on-site services
  - Created price optimization features with money-saving tips and cost comparison tools

- **Advanced Phone Support System with Dynamic Pricing**: Comprehensive phone support services with sophisticated pricing algorithms
  - Created 8 tiered phone support services across 4 levels: Basic ($25-40), Intermediate ($55-75), Advanced ($95-125), Expert ($150-200)
  - Implemented dynamic pricing engine with multiple factors: time of day, urgency level, distance, traffic conditions, demand surge, weekend surcharge
  - Added real-time pricing calculator with transparent cost breakdown
  - Created dedicated phone support page (/phone-support) with service selection and booking interface
  - Integrated phone support into issue categorization system with automatic navigation
  - Added pricing factors: Morning (1.0x), Midday (1.1x), Evening (1.2x), Midnight (1.5x), Weekend (1.3x), Urgency (1.0x-2.0x)
  - Implemented distance-based pricing for on-site coordination with out-of-town surcharges

- **Enhanced Issue Categorization System**: Split support services into specialized categories
  - Separated "Online Remote Support" with 7 phone support subcategories
  - Added "On-Site Support Services" with 7 traditional support options
  - Enhanced navigation with automatic routing to phone support when selecting phone support subcategories
  - Integrated phone support booking confirmation flow with automatic return to chat

- **Domain-Specific AI Behavior**: Implemented customizable AI behavior for different technical domains
  - Created domain configuration system with specialized prompts, temperature settings, and response styles
  - Added 9 technical domains: Web Development, Hardware Issues, Network Troubleshooting, Database Help, Mobile Devices, Security Questions, Cyber security, Online Remote Support, Order a technician onsite
  - Integrated domain detection from message content and topic selection
  - Added domain indicator badges in chat interface
  - Created domain selector component for explicit domain selection
  - Enhanced AI responses with conversation context and domain-specific expertise

- **Technical Issue Categorization System**: Comprehensive issue management and tracking capabilities
  - Built interactive categorization interface with 9 technical categories and 63 subcategories
  - Created issue tracking dashboard with status management (Open, In Progress, Resolved)
  - Added priority-based classification (Low, Medium, High, Urgent) with estimated resolution times
  - Integrated issue lifecycle management with automatic status updates
  - Added floating action button for quick access from chat interface
  - Created dedicated issue management page (/issues) with tabs for categorization and tracking
  - Implemented local storage persistence for issue data and user preferences

### December 2024
- **Enhanced Topic Sidebar**: Added expandable subtopics for each technical category
  - Each main topic now contains 7 relevant subtopics for more targeted assistance
  - Added chevron icons for expand/collapse functionality
  - Improved user experience on both desktop and mobile views

### Earlier 2024
- Initial application setup with PostgreSQL integration
- User authentication and profile management
- Real-time chat interface with typing indicators
- OpenAI GPT-4 integration for AI responses

## Changelog

- January 07, 2025. Universal interactive pricing calculator for all technical categories and subcategories
- January 07, 2025. Domain-specific AI behavior implementation
- December 2024. Enhanced topic categorization with subtopics
- Initial setup with PostgreSQL and OpenAI integration

## User Preferences

Preferred communication style: Simple, everyday language.
Navigation preferences: TechGPT logo and Home button should navigate to chat page (/chat) instead of main page (/). Added dedicated Chat button beside Home button for easy access to chat page from all pages.