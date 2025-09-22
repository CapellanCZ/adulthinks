import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { createLoginStyles, theme } from '../styles/loginStyles';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Error fallback component
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const colorScheme = useColorScheme();
  const styles = createLoginStyles(colorScheme);
  const colors = theme.getThemeColors(colorScheme);

  return (
    <View style={styles.errorBoundaryContainer}>
      <View style={styles.errorBoundaryContent}>
        <AlertTriangle 
          size={48} 
          color={colors.error} 
          style={styles.errorBoundaryIcon}
        />
        <Text 
          variant="heading" 
          style={styles.errorBoundaryTitle}
          accessibilityRole="header"
        >
          Something went wrong
        </Text>
        <Text 
          style={styles.errorBoundaryMessage}
          accessibilityHint="An unexpected error occurred while loading the login form"
        >
          We encountered an unexpected error. Please try again.
        </Text>
        <Button 
          onPress={onRetry}
          style={styles.errorBoundaryRetryButton}
          accessibilityLabel="Try again"
          accessibilityHint="Tap to reload the login form"
        >
          Try Again
        </Button>
      </View>
    </View>
  );
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

