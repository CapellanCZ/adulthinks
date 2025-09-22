import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCommunityStyles } from '../styles/communityStyles';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar = React.memo(function SearchBar({
  onSearch,
  onFocus,
  onBlur,
  placeholder = 'Search posts...',
  autoFocus = false,
}: SearchBarProps) {
  const styles = useCommunityStyles();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
    
    if (!query) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [animatedValue, onBlur, query]);

  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    onSearch(text);
  }, [onSearch]);

  const handleClear = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  const handleCancel = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuery('');
    onSearch('');
    inputRef.current?.blur();
  }, [onSearch]);

  const cancelButtonWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const searchBarWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '75%'],
  });

  return (
    <View style={styles.searchContainer}>
      <Animated.View style={[styles.searchInputContainer, { width: searchBarWidth }]}>
        <Ionicons
          name="search"
          size={20}
          color={isDark ? '#666666' : '#999999'}
          style={styles.searchIcon}
        />
        
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#666666' : '#999999'}
          value={query}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode="never"
          accessibilityLabel="Search posts"
          accessibilityHint="Type to search through community posts"
        />
        
        {query.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={isDark ? '#666666' : '#999999'}
            />
          </Pressable>
        )}
      </Animated.View>
      
      {isFocused && (
        <Animated.View style={[styles.cancelButtonContainer, { width: cancelButtonWidth }]}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel search"
          >
            <Ionicons
              name="close"
              size={20}
              color="#007AFF"
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
});
