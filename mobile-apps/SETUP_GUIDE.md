# 📱 TechersGPT Mobile Apps - Complete Setup Guide

## 🎯 What You Have

Two production-ready mobile apps built with React Native and Expo:

1. **Customer App** (`customer-app/`) - For users seeking technical support
2. **Provider App** (`provider-app/`) - For service providers managing jobs

Both apps work on **iOS and Android** from a single codebase!

---

## 🚀 Option 1: Quick Start with Expo Go (Recommended for Testing)

### Step 1: Install Expo Go on Your Phone
- **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: Create a New Replit for the Mobile App

**For Customer App:**
1. Go to [Replit](https://replit.com)
2. Click "+ Create Replit"
3. Search for "Expo" template
4. Name it "TechersGPT-Customer-Mobile"
5. Click "Create Replit"

**For Provider App:**
1. Repeat the above but name it "TechersGPT-Provider-Mobile"

### Step 3: Copy the App Code

**Customer App:**
```bash
# Copy files from mobile-apps/customer-app/ to your new Replit
# Include: app/, package.json, app.json
```

**Provider App:**
```bash
# Copy files from mobile-apps/provider-app/ to your new Replit
# Include: app/, package.json, app.json
```

### Step 4: Run the App

In your Replit terminal:
```bash
npm install
npx expo start
```

### Step 5: Test on Your Phone

1. Wait for the QR code to appear in the terminal
2. Open Expo Go on your phone
3. **iOS**: Scan the QR code with your Camera app
4. **Android**: Scan the QR code from within the Expo Go app
5. Your app will load on your phone! 🎉

---

## 📦 Option 2: Build Standalone Apps (For Production)

### Prerequisites
- Apple Developer Account ($99/year) for iOS
- Google Play Developer Account ($25 one-time) for Android
- Expo Account (free at [expo.dev](https://expo.dev))

### Build for iOS

```bash
cd customer-app  # or provider-app

# Login to Expo
npx expo login

# Build for iOS
npx expo build:ios

# Follow the prompts:
# - Choose your bundle identifier (com.techersgpt.customer)
# - Upload to App Store Connect
```

### Build for Android

```bash
cd customer-app  # or provider-app

# Build for Android
npx expo build:android

# Follow the prompts:
# - Choose APK or AAB format
# - AAB is required for Google Play Store
# - APK for direct distribution
```

---

## 🔧 Connecting to Your Backend

### Update API URL

Edit the API endpoints in each app:

**Customer App** - Create `customer-app/config.ts`:
```typescript
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend.replit.app';
```

**Provider App** - Create `provider-app/config.ts`:
```typescript
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend.replit.app';
```

Then replace fetch URLs in your app files:
```typescript
// Before
const response = await fetch('/api/chat', {...});

// After
import { API_URL } from '../config';
const response = await fetch(`${API_URL}/api/chat`, {...});
```

---

## 🎨 Customization

### Change App Name & Icon

**1. App Name:**

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your Custom Name",
    "slug": "your-app-slug"
  }
}
```

**2. App Icon:**

Replace `assets/icon.png` with your logo:
- Size: 1024x1024px
- Format: PNG with transparency
- Square shape

**3. Splash Screen:**

Replace `assets/splash.png`:
- Size: 1242x2436px (iPhone ratio)
- Your brand image/logo

**4. Colors:**

Edit the StyleSheet in each `.tsx` file:
```typescript
// Change primary color from green (#10B981) to your brand color
backgroundColor: '#YOUR_COLOR'
```

---

## 📱 Features in Each App

### Customer App Features
- ✅ Home dashboard with quick actions
- ✅ AI chat support interface
- ✅ Service categories browser
- ✅ Profile management
- ✅ Beautiful, modern UI
- ✅ Bottom tab navigation

### Provider App Features
- ✅ Earnings dashboard with stats
- ✅ Job management (Active/Pending/Completed)
- ✅ Earnings tracker with transactions
- ✅ Availability toggle
- ✅ Profile settings
- ✅ Push notification support
- ✅ Bottom tab navigation

---

## 🐛 Troubleshooting

### "Can't connect to server"
- Make sure your backend is running
- Check that API_URL points to the correct address
- Ensure your phone and computer are on the same network (for local testing)

### "Metro bundler not starting"
```bash
# Clear cache and restart
npx expo start --clear
```

### "Build failed"
```bash
# Update Expo CLI
npm install -g expo-cli@latest

# Try building again
npx expo build:ios  # or android
```

### "QR code won't scan"
- Make sure Expo Go app is updated
- Try entering the URL manually in Expo Go
- Check that your firewall isn't blocking the connection

---

## 📚 Next Steps

1. **Add Authentication**: Connect login screens to your backend API
2. **Enable Push Notifications**: Set up Expo notifications
3. **Add Real Data**: Replace mock data with API calls
4. **Test on Devices**: Test on multiple phone models
5. **Submit to Stores**: Follow Apple and Google submission guidelines

---

## 🆘 Need Help?

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Expo Forums**: https://forums.expo.dev/
- **Stack Overflow**: Tag questions with `expo` and `react-native`

---

## ✅ Checklist Before Publishing

- [ ] Test on both iOS and Android
- [ ] Replace all mock data with real API calls
- [ ] Add error handling for network requests
- [ ] Set up crash reporting (Sentry, Bugsnag)
- [ ] Configure app permissions (location, camera, etc.)
- [ ] Add loading states for all async operations
- [ ] Test offline functionality
- [ ] Optimize images and assets
- [ ] Set proper app icons and splash screens
- [ ] Write privacy policy and terms of service
- [ ] Test in-app purchases (if applicable)
- [ ] Set up analytics (Google Analytics, Mixpanel)
- [ ] Prepare app store screenshots and descriptions

---

## 🎉 You're All Set!

Your mobile apps are ready to go. Start testing with Expo Go, and when you're ready, build standalone apps for the App Store and Google Play.

Happy building! 📱✨
