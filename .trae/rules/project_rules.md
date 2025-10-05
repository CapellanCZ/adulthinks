# Expo React Native Performance Rules
## Optimized for BNA Component Library, Zustand & Supabase Stack

---

## 🔄 Component Reusability & Anti-Duplication

### Component Design Principles
- **Design components for reusability** from the start - avoid creating similar components
- **Use composition over duplication** - combine smaller components to create variations
- **Implement variant-based design** - single component with multiple visual states
- **Create configurable components** with props instead of hardcoded variations
- **Use component inheritance patterns** for shared functionality

### Component Architecture Patterns
- **Base component approach** - create foundational components that can be extended
- **Variant prop patterns** - use size, color, and style variants within single components
- **Compound component patterns** - combine components for complex functionality
- **Render prop patterns** - for flexible component behavior customization
- **Higher-order component patterns** - for shared logic across multiple components

### Preventing Component Duplication
- **Code review standards** that flag similar component creation
- **Component library audit** before creating new components
- **Shared component documentation** to promote discoverability and reuse
- **Component naming conventions** that indicate purpose and reusability
- **Regular refactoring sessions** to consolidate similar components

### Reusability Guidelines
- **Make components configurable** through props rather than creating variants
- **Use theme props** for styling variations instead of separate components
- **Implement flexible layouts** that adapt to different content and contexts
- **Create component composition APIs** for complex functionality
- **Document component variations** and use cases for team reference

### Component Organization
- **Centralized component library** in shared directory structure
- **Component categorization** by function and reusability level
- **Version control** for component API changes and backwards compatibility
- **Component testing standards** that ensure reusability across contexts
- **Regular component inventory** to identify duplication opportunities

### Refactoring Strategies
- **Identify similar components** during code reviews and planning
- **Extract common patterns** into shared base components
- **Consolidate styling approaches** using theme-based variations
- **Merge functionality** of components that serve similar purposes
- **Create migration guides** when consolidating existing components

---

## 🧹 Code Cleanup & Dead Code Elimination

### Automated Cleanup Standards
- **Setup ESLint rules** for unused variables and imports detection
- **Configure Prettier** for consistent formatting and cleanup
- **Use TypeScript strict mode** to catch unused code at compile time
- **Implement pre-commit hooks** that prevent dead code from being committed
- **Setup automated dependency cleanup** in CI/CD pipeline

### Manual Cleanup Practices
- **Weekly code audits** to identify unused functions and components
- **Remove commented code blocks** during code reviews
- **Clean up console.log statements** before production builds
- **Delete unused test files** and mock data
- **Remove obsolete environment variables** and configuration

### Bundle Size Optimization
- **Analyze bundle composition** with tools like react-native-bundle-visualizer
- **Remove unused dependencies** from package.json regularly
- **Clean up unused assets** (images, fonts, icons) from project
- **Eliminate dead CSS/styling** that's no longer referenced
- **Use tree-shaking** to automatically remove unused code from builds

### Dependency Management
- **Audit dependencies monthly** for unused packages
- **Remove dev dependencies** that are no longer needed
- **Update dependencies** to latest versions for better tree-shaking
- **Use exact versions** to avoid bloated package installations
- **Monitor package size** impact before adding new dependencies

### File System Cleanup
- **Remove unused component files** and their associated tests
- **Clean up empty directories** from refactoring
- **Delete unused hook files** and utility functions
- **Remove obsolete screen components** after navigation changes
- **Clean up unused store files** and state management code

### Automation Tools & Setup
- **Setup automated linting** with unused code detection rules
- **Configure build scripts** that fail on dead code detection
- **Use static analysis tools** to identify unreachable code
- **Implement dependency scanning** in CI/CD pipeline
- **Setup bundle size monitoring** to catch size increases

---

## 🎯 General Code Style & Architecture

### Core Principles
- **Use functional and declarative programming patterns** - avoid classes except for error boundaries
- **Prefer composition over inheritance** and modularization over code duplication
- **Use descriptive variable names** with auxiliary verbs (isLoading, hasError, canSubmit)
- **Follow atomic design principles**: atoms → molecules → organisms → templates → pages

### File Structure Standards
```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── types/
├── profile/
└── shared/
    ├── components/
    ├── hooks/
    ├── utils/
    └── types/
```

### Export Organization
- **Structure files**: exported component, subcomponents, hooks, helpers, types, constants
- **Use barrel exports** (`index.ts`) for clean imports
- **Organize by feature modules** for better maintainability

---

## 📁 Naming Conventions & Organization

### Directory Structure
- **Use lowercase with dashes** for directories (`components/auth-wizard`, `stores/user-profile`)
- **Favor named exports** for components and hooks
- **Create themed directories** for consistent styling

### Theme Integration
- **Import colors from `colors.ts`** - never hardcode color values
- **Use theme-aware components** for consistent design system
- **Implement dark mode support** using theme context
- **Create color semantic mapping** (primary, secondary, success, error, warning)

---

## 🔧 TypeScript Excellence

### Type Safety Standards
- **Use TypeScript for all code** with strict mode enabled
- **Prefer interfaces over types** for object shapes
- **Avoid `any` and `enum`** - use explicit types and const assertions
- **Create shared type definitions** in `types/` directory
- **Use generic constraints** and utility types for reusability

### Type Organization
- **Define API response types** for all Supabase interactions
- **Create form validation interfaces** for Yup schemas
- **Use discriminated unions** for state management
- **Implement branded types** for IDs and sensitive data

---

## 🏪 Zustand State Management Optimization

### Store Architecture
- **Keep stores focused and domain-specific** - avoid god stores
- **Use immer middleware** for complex state updates
- **Implement optimistic updates** for better UX perception
- **Use selectors strategically** to prevent unnecessary re-renders
- **Persist only essential state** with async storage

### Performance Patterns
- **Subscribe to specific state slices** using selectors
- **Implement shallow comparison** for array/object selections
- **Debounce frequent state updates** to reduce render cycles
- **Use middleware for debugging** without affecting production
- **Cache computed values** within stores when appropriate

### State Structure Guidelines
- **Separate loading states** per action (isCreating, isUpdating, isDeleting)
- **Implement error boundaries** for state-related errors
- **Use normalized data structures** for complex relationships
- **Implement undo/redo functionality** for critical operations

---

## 🗄️ Supabase Backend Optimization

### Database Performance
- **Implement RLS policies** for data security and performance
- **Use connection pooling** and query optimization
- **Create database functions** for complex operations
- **Index frequently queried columns** for faster retrieval
- **Use database views** for complex joins

### Query Optimization
- **Select only necessary columns** - avoid `SELECT *`
- **Implement pagination** for large datasets
- **Use proper filtering** and sorting on indexed columns
- **Batch operations** when possible to reduce round trips
- **Cache frequently accessed data** with React Query

### Real-time Features
- **Use real-time subscriptions selectively** - only for critical data
- **Implement connection management** for subscriptions
- **Handle connection drops gracefully** with retry logic
- **Debounce real-time updates** to prevent UI thrashing

### API Integration Patterns
- **Create service layers** for Supabase operations
- **Implement retry logic** with exponential backoff
- **Use optimistic updates** for immediate UI feedback
- **Handle offline scenarios** with proper error states
- **Implement request deduplication** to prevent duplicate calls

---

## ✅ Yup Schema Optimization

### Schema Performance
- **Create reusable schema fragments** for common validations
- **Use lazy validation** for conditional requirements
- **Implement schema caching** for frequently used validators
- **Avoid nested object validation** when possible
- **Use transform functions** for data normalization

### Validation Patterns
- **Debounce field validation** to reduce computational overhead
- **Implement progressive validation** (validate as user types)
- **Use conditional validation** efficiently with lazy schemas
- **Cache validation results** for identical inputs
- **Implement async validation** for server-side checks (username availability)

### Form Integration
- **Separate validation logic** from UI components
- **Use validation contexts** for complex forms
- **Implement field-level error handling** for better UX
- **Create validation hooks** for reusable logic
- **Use validation schemas** as TypeScript type sources

---

## 🎨 BNA Component Library & Theme Integration

### Component Usage
- **Use BNA components as base** - extend with performance optimizations
- **Import colors from `colors.ts`** for all styling decisions
- **Create performance-optimized wrappers** for heavy components
- **Use BNA's theming system** efficiently with theme context

### Theme Implementation
- **Define semantic color mappings** in theme configuration
- **Use theme-aware styled components** for consistent styling
- **Implement responsive design** with theme breakpoints
- **Create dark/light mode variants** using theme switching
- **Use theme colors** for all visual states (hover, pressed, disabled)

### Color System Integration
- **Reference `colors.ts`** for all color values
- **Create color semantic tokens** (primary, secondary, accent, neutral)
- **Implement color accessibility** standards (contrast ratios)
- **Use theme context** for dynamic color switching
- **Create color utility functions** for shade variations

### Component Optimization
- **Wrap components in React.memo** with custom comparison functions
- **Implement component-level memoization** for expensive renders
- **Use theme-aware styling** without performance penalties
- **Create reusable theme hooks** for component styling
- **Avoid component duplication** - create shared, configurable components instead of similar variants

---

## ⚡ Performance Optimization Rules

### 1. Component Rendering Excellence
- **Wrap all components in React.memo** with custom comparison functions
- **Use useCallback for event handlers** and useMemo for computed values
- **Implement virtualization** for lists > 50 items using BNA's optimized list components
- **Avoid inline styles and functions** - use StyleSheet.create or theme-aware styling
- **Use theme colors consistently** from colors.ts throughout the app
- **Create reusable components** instead of duplicating similar functionality
- **Use composition patterns** to avoid recreating similar components
- **Implement variant-based components** with props for different use cases

### 2. List Performance Optimization
- **Use FlatList for long lists** with proper configuration
- **Implement getItemLayout** for predictable item sizes
- **Configure list rendering props** (initialNumToRender, windowSize, maxToRenderPerBatch)
- **Remove clipped subviews** for memory efficiency
- **Use key extractors** that remain stable across re-renders

### 3. State Management Performance
- **Use Zustand selectors** to subscribe to specific state slices only
- **Implement shallow comparison** for complex state selections
- **Debounce frequent state updates** to reduce render cycles
- **Use state normalization** for complex data relationships
- **Implement optimistic updates** for better perceived performance

### 4. Network & Data Performance
- **Implement progressive loading** with skeleton screens using BNA components
- **Use React Query** for caching, background updates, and error handling
- **Implement request deduplication** to prevent redundant API calls
- **Use optimistic updates** for immediate UI feedback
- **Compress and optimize images** with appropriate formats

### 5. Navigation & Routing Performance
- **Use lazy loading** for screens with React Navigation
- **Implement screen preloading** for critical user paths
- **Use shared element transitions** for smooth navigation
- **Optimize tab bar and drawer** performance with proper memoization
- **Implement deep linking** efficiently without performance penalties

### 6. Animation & Gestures Performance
- **Use react-native-reanimated** with runOnUI for complex animations
- **Implement gesture-driven animations** with react-native-gesture-handler
- **Use useNativeDriver: true** for transform and opacity animations
- **Optimize shared element transitions** between screens
- **Use theme-aware animations** that respect user preferences

### 7. Memory Management
- **Implement proper cleanup** in useEffect hooks
- **Use WeakMap** for component-level caches
- **Avoid memory leaks** in event listeners and subscriptions
- **Monitor memory usage** during development
- **Clean up real-time subscriptions** properly

### 8. Bundle & Asset Optimization
- **Use Expo's asset bundling** for optimal loading performance
- **Implement code splitting** by feature modules
- **Optimize images** with expo-image-manipulator
- **Use vector icons and SVGs** for scalable graphics
- **Tree shake unused dependencies** to reduce bundle size

### 9. Code Cleanup & Maintenance
- **Remove dead code automatically** - unused functions, components, and imports
- **Clean up unused dependencies** from package.json regularly
- **Remove commented code blocks** before commits
- **Delete unused assets and files** to reduce bundle size
- **Implement automated dead code detection** in CI/CD pipeline
- **Regular code audits** to identify and remove obsolete code

---

## 📊 Performance Benchmarks & Targets

### Performance Goals
- **Touch Interactions**: < 100ms response time
- **Screen Transitions**: < 2s loading time
- **Data Loading**: < 1s with skeleton screens
- **Animation Frame Rate**: Consistent 60fps
- **App Startup Time**: < 3s cold start
- **Memory Usage**: Stable across extended sessions

### Monitoring Standards
- **Track performance metrics** in development and production
- **Monitor bundle size** and dependency impact
- **Test on low-end devices** regularly
- **Implement performance budgets** for critical paths
- **Use performance profiling tools** during development

---

## 🧪 Testing & Quality Assurance

### Testing Strategy
- **Write unit tests** for hooks and utility functions
- **Implement integration tests** for critical user flows
- **Use Detox** for end-to-end testing
- **Performance test** on physical low-end devices
- **Monitor app performance metrics** in production

### Quality Standards
- **Maintain code coverage** above 80% for critical paths
- **Use static analysis** tools for code quality
- **Implement continuous integration** with performance checks
- **Regular performance audits** using profiling tools
- **User experience testing** across different devices and conditions

---

## 🔍 Development & Monitoring

### Development Tools
- **Use Expo dev tools** and React Developer Tools for performance profiling
- **Implement performance monitoring** with custom metrics
- **Use Sentry** for error tracking and performance monitoring
- **Regular performance reviews** during development cycles
- **Automated performance testing** in CI/CD pipeline
- **Setup automated code cleanup** with tools like ESLint, Prettier, and dead code elimination
- **Use dependency analyzers** to identify unused packages and imports

### Production Monitoring
- **Track app performance** with analytics integration
- **Monitor crash rates** and performance regressions
- **Implement user feedback** collection for performance issues
- **Regular performance optimization** based on real user data
- **A/B testing** for performance improvements

---

## 🏗️ Implementation Guidelines

### Project Setup
- **Configure Expo** with performance-optimized settings
- **Enable Hermes engine** for improved JavaScript performance
- **Setup theme configuration** with colors.ts integration
- **Configure build optimizations** for production releases
- **Implement proper error boundaries** throughout the application

### Development Workflow
- **Regular performance profiling** during development
- **Code reviews** focusing on performance implications
- **Performance testing** before feature releases
- **Documentation** of performance patterns and anti-patterns
- **Team training** on performance best practices
- **Automated dead code removal** before each release
- **Weekly dependency cleanup** to remove unused packages
- **Code quality gates** that prevent dead code from being merged
- **Component reusability reviews** to identify duplication opportunities
- **Regular component audits** to consolidate similar functionality

### Production Deployment
- **Performance monitoring** setup before release
- **Gradual rollout** with performance monitoring
- **A/B testing** for performance improvements
- **Regular performance audits** post-release
- **User feedback integration** for performance issues

---

## 📋 Quick Reference Checklist

### Before Component Creation
- [ ] **Plan component memoization** strategy
- [ ] **Import theme colors** from colors.ts
- [ ] **Consider performance implications** of state usage
- [ ] **Design for reusability** and composition
- [ ] **Check existing components** for similar functionality before creating new ones
- [ ] **Evaluate if existing components** can be extended with props instead
- [ ] **Document component purpose** and reusability potential

### During Development
- [ ] **Use React.memo** for components
- [ ] **Implement proper useCallback/useMemo** usage
- [ ] **Test with React Developer Tools** profiler
- [ ] **Validate theme color usage** throughout components
- [ ] **Review component library** before creating similar functionality
- [ ] **Use composition patterns** to avoid component duplication
- [ ] **Implement variant props** instead of creating separate components

### Before Release
- [ ] **Performance test** on low-end devices
- [ ] **Verify memory leak** prevention
- [ ] **Check bundle size** impact
- [ ] **Validate theme consistency** across all screens
- [ ] **Test offline functionality** and error states
- [ ] **Remove all unused code** and dependencies
- [ ] **Verify no dead imports** or commented code blocks
- [ ] **Clean up unused assets** and files
- [ ] **Run dependency audit** to remove unnecessary packages

This comprehensive guide ensures that Expo React Native app with BNA components, Zustand, Yup, and Supabase delivers exceptional performance while maintaining consistent theming through colors.ts file integration.