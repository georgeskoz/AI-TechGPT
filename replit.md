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
- **IssueCategorizationPage**: Technical issue management with categorization and tracking
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

### January 7, 2025
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

- July 07, 2025. Domain-specific AI behavior implementation
- December 2024. Enhanced topic categorization with subtopics
- Initial setup with PostgreSQL and OpenAI integration

## User Preferences

Preferred communication style: Simple, everyday language.