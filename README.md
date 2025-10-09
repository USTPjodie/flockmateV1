# Flockmate Mobile App

A mobile version of the Flockmate poultry monitoring system built with Expo.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the App

Start the development server:
```bash
npx expo start
```

Then:
- Scan the QR code with the Expo Go app on your mobile device
- Or press `a` to run on Android emulator
- Or press `i` to run on iOS simulator (macOS only)

## Features

- User authentication (sign in/sign up with role selection)
- Role-based access for Growers and Technicians
- Dashboard with cycle metrics
- Account management
- Mobile-optimized navigation

## User Roles

The app supports two distinct user roles:

### Growers
- Poultry farmers who manage their own flocks
- Identified by a sprout icon in the UI
- Focus on managing their own poultry cycles

### Technicians
- Poultry professionals who provide services to multiple growers
- Identified by a wrench icon in the UI
- Focus on providing technical services to growers

During signup, users must select their role, which determines their access and features within the app.

## Technologies Used

- Expo
- React Native
- TypeScript
- Supabase (authentication)
- React Navigation
- React Query
- Lucide Icons

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom hooks
├── lib/            # Utility functions and configurations
├── Home.tsx        # Home screen
├── Account.tsx     # Account screen
App.tsx             # Main app component
```

## Building for Production

To build the app for production:

```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)