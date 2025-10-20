# TechersGPT Mobile Apps

This directory contains mobile applications for iOS and Android built with React Native and Expo.

## 📱 Apps Available

1. **Customer App** - For customers seeking technical support
2. **Provider App** - For service providers managing jobs and earnings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Setup Instructions

**Option 1: Create a New Replit Project (Recommended)**

1. Create a new Replit project
2. Choose "Expo" or "React Native" template
3. Copy the app code from `customer-app/` or `provider-app/` 
4. Update the `API_URL` in `config.ts` to point to your backend:
   ```typescript
   export const API_URL = 'https://your-replit-app.replit.app';
   ```
5. Run `npm start` and scan the QR code with Expo Go

**Option 2: Run Locally**

1. Open a terminal in this directory
2. Navigate to the app:
   ```bash
   cd customer-app  # or provider-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npx expo start
   ```
5. Scan the QR code with Expo Go app on your phone

## 📦 Publishing to App Stores

### iOS App Store
```bash
cd customer-app
npx expo build:ios
# Follow the prompts to submit to App Store
```

### Google Play Store
```bash
cd customer-app
npx expo build:android
# Follow the prompts to submit to Google Play
```

## 🔧 Configuration

### Connect to Your Backend
Edit `config.ts` in each app to set your backend URL:

```typescript
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
```

For production, set environment variable in Expo:
```bash
export EXPO_PUBLIC_API_URL=https://your-backend.replit.app
```

## 🎨 Customization

- **App Icons**: Replace `assets/icon.png` with your logo (1024x1024px)
- **Splash Screen**: Replace `assets/splash.png` with your splash image (1242x2436px)
- **Colors**: Edit `theme.ts` to match your brand colors
- **App Name**: Update `app.json` > `name` and `displayName`

## 📱 Features

### Customer App
- ✅ AI Chat Support
- ✅ Service Request Booking
- ✅ Issue Categorization
- ✅ Live Support Access
- ✅ Service Tracking
- ✅ Profile Management

### Provider App
- ✅ Job Dashboard
- ✅ Earnings Tracker
- ✅ Job Notifications
- ✅ Customer Messaging
- ✅ Profile Settings
- ✅ Availability Management

## 🌐 Backend Integration

Both apps connect to the TechersGPT backend API. Make sure your backend is deployed and accessible at the configured `API_URL`.

### API Endpoints Used
- `/api/auth/login` - User authentication
- `/api/auth/service-provider/login` - Provider authentication
- `/api/chat` - AI chat
- `/api/provider/jobs` - Job listings
- `/api/provider/earnings` - Earnings data
- And more...

## 🔐 Authentication

Apps use session-based authentication. Login tokens are stored securely using:
- iOS: Keychain
- Android: Encrypted SharedPreferences

## 📊 Testing

```bash
npm test              # Run unit tests
npm run test:e2e      # Run end-to-end tests
```

## 🐛 Troubleshooting

**Can't connect to backend:**
- Check API_URL is correct
- Make sure backend is running
- Try using your computer's IP instead of localhost

**App won't build:**
- Clear cache: `npx expo start --clear`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**QR code won't scan:**
- Make sure phone and computer are on same WiFi
- Try entering URL manually in Expo Go

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Publishing Guide](https://docs.expo.dev/distribution/introduction/)
