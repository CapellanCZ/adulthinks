1. Component Design
- Apply variant-based design patterns for UI elements
- Prioritize composition over inheritance in component architecture
- Maintain consistent theme-aware styling through colors.ts
2. TypeScript Excellence
- Follow strict mode with interface-first approach
- Use proper type definitions for API responses and forms
- Avoid any and prefer explicit type declarations
3. Zustand Optimization
- Implement slice-based state management
- Use selectors with shallow comparison
- Debounce frequent state updates
4. Supabase Integration
- Select only necessary columns in queries
- Implement RLS policies for security
- Use proper error handling and retry logic
5. Performance Metrics
- Touch interactions under 100ms
- Screen transitions under 2s
- Memory usage must be stable
- Implement proper memoization and virtualization
6. Code Quality
- Follow established React Native best practices
- Use linters and formatters for code consistency
- Write clear and maintainable code
7. Seperate concerns
- Keep components focused on a single responsibility
- Separate business logic from UI components
- Use separate files for utility functions and constants
8. File Structure
- Organize files by feature or component
- Use a consistent naming convention
- Keep files small and focused
- Place in module 