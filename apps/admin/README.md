# Admin Portal - TechersGPT

Administrative interface for managing the TechersGPT platform.

## Features

- User Management (customers and service providers)
- Financial Management (pricing rules, commissions, payouts)
- Content Management (announcements, notifications, emails)
- Analytics & Reporting
- Dispute Resolution
- System Configuration

## Running the App

```bash
# From project root
npm run dev:admin
```

Access at: http://localhost:5001

## Login

Default admin credentials:
- Username: `admin`
- Password: `admin123`

## Pages

- `/admin` - Main dashboard
- `/admin/users` - User management
- `/admin/pricing` - Pricing and commission rules
- `/admin/analytics` - Platform analytics
- `/admin/content` - Content management

## Building

```bash
npm run build:admin
```

Output: `dist/admin/`
