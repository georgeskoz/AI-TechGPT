# Customer Portal Navigation Audit & Cleanup

## Current Issues Identified

### 1. Redundant/Unnecessary Routes
- `/support` - redirects to `/chat` (should be removed)
- `/home` - duplicate of `/` (should be removed)
- `/triage` - development/testing page (should be dev-only)
- `/diagnostic` - development/testing page (should be dev-only)
- `/technician-matching` - confusing for customers (should be internal)
- `/find-expert` - duplicate functionality (should be consolidated)
- `/marketplace` - generic name, unclear purpose (should be reviewed)

### 2. Development/Testing Pages in Production
- `/test-notifications` - testing only
- `/notifications` - development dashboard
- `/onboarding` - development wizard
- `/register` - development page
- `/auth-test` - testing component
- `/domains` - development selector

### 3. Unclear Customer Journey
- Multiple paths to similar functionality
- Confusing navigation options
- No clear step-by-step flow

## Recommended Clean Customer Portal Structure

### Core Customer Pages (Production-Ready)
1. **Home** (`/`) - Customer portal landing page
2. **AI Chat Support** (`/chat`) - Free AI assistance
3. **My Dashboard** (`/dashboard`) - Account and service overview
4. **Request Technician** (`/technician-request`) - Main booking flow
5. **Live Support** (`/live-support`) - Human chat support
6. **Phone Support** (`/phone-support`) - Call-based support
7. **Screen Sharing** (`/screen-sharing`) - Remote assistance

### Support Flow
Customer Journey: Home → Chat (Free) → Live Support → Phone/Screen Sharing → Technician Request

### Quick Access Menu (Customer-Focused)
- Clean, focused navigation
- Remove development/testing links
- Clear descriptions
- Intuitive flow

## Action Items
1. Remove redundant routes
2. Move development pages to dev-only
3. Clean up imports
4. Streamline Quick Access menu
5. Create clear customer journey
6. Update navigation descriptions