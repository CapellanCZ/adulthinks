# AdultHinks - React Native Expo App

A comprehensive learning and community platform built with React Native, Expo, and Supabase.

Reference link of the File Structure: https://medium.com/@nitishprasad/react-native-folder-structure-e9ceab3150f3

## 📁 Project Structure

```text
adulthinks/
├── 📱 app/                          # Expo Router screens (file-based routing)
├── 🧩 components/                   # Reusable UI components
├── 📦 modules/                      # Feature-based modules
│   ├── auth/                       # Authentication & user management
│   ├── roadmap/                    # AI-powered learning roadmaps
│   ├── community/                  # Community posts & discussions
│   ├── profile/                    # User profile management
│   ├── home/                       # Dashboard & home screen
│   └── userAddress/                # Address management
├── 🎨 theme/                        # Design system and theming
├── 🪝 hooks/                        # Global custom hooks
├── 🗄️ stores/                       # Global state management (Zustand)
├── 🗃️ supabase/                     # Backend database and functions
├── 📊 data/                         # Static data and mock data
├── 🖼️ assets/                       # Static assets (images, fonts, etc.)
└── 📚 lib/                          # External library configurations
```

### 📦 Module Structure

Each module follows a consistent folder structure:

```text
modules/[feature]/
├── components/                      # Feature-specific UI components
├── hooks/                          # Business logic & data fetching hooks
├── services/                       # API calls & external integrations
├── store/                          # Feature state management (Zustand)
├── styles/                         # Theme-aware styling
├── types/                          # TypeScript interfaces & types
├── validation/                     # Form validation schemas (Yup)
└── index                           # Module exports
```

## 🏗️ Architecture Principles

### Module-Based Architecture

Each feature is organized as a self-contained module with:

- **Components**: UI components specific to the feature
- **Hooks**: Business logic and data fetching
- **Services**: API calls and external integrations
- **Store**: State management (Zustand)
- **Styles**: Theme-aware styling
- **Types**: TypeScript interfaces and types
- **Validation**: Form validation schemas (Yup)

### Design System

- **Theme-aware**: All components adapt to dark/light mode
- **Semantic colors**: 60+ color tokens for consistent design
- **Typography scale**: Consistent font sizes and weights
- **Spacing system**: Standardized spacing values
- **Component library**: Reusable UI primitives

### State Management

- **Zustand**: Lightweight state management
- **Optimistic updates**: Instant UI feedback
- **Error handling**: Comprehensive error boundaries
- **Real-time sync**: Database synchronization

## 🛠️ Tech Stack

### Core Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based navigation

### Backend & Database

- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Database with RLS (Row Level Security)
- **Edge Functions**: Serverless functions

### State & Data

- **Zustand**: State management with Immer
- **React Query**: Server state management
- **Yup**: Form validation

### UI & Styling

- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch interactions
- **Custom theme system**: Dark/light mode support

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Add your Supabase and API keys
   ```

3. **Start development server**

   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📱 Features

- **🔐 Authentication**: Secure login/signup with Supabase Auth
- **🗺️ AI Roadmaps**: Personalized learning paths with progress tracking
- **👥 Community**: Share tips and success stories
- **📊 Progress Tracking**: Visual progress indicators and statistics
- **🌙 Dark Mode**: Full dark/light theme support
- **♿ Accessibility**: Screen reader support and keyboard navigation
- **📱 Responsive**: Adapts to different screen sizes

## 🤝 Contributing

This project follows functional programming principles and modular architecture. When contributing:

1. **Follow the module pattern** for new features
2. **Use TypeScript interfaces** over types
3. **Implement theme-aware styling**
4. **Add proper accessibility support**
5. **Write comprehensive error handling**
6. **Use optimistic updates** for better UX
