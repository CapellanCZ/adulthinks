import React from 'react';
import { StyleSheet } from 'react-native';

import { SearchBarWithSuggestions } from '@/components/ui/searchbar';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SearchSectionProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSuggestionPress?: (suggestion: string) => void;
  suggestions?: string[];
  containerStyle?: object;
  searchBarStyle?: object;
}

export type { SearchSectionProps };

export const SearchSection: React.FC<SearchSectionProps> = React.memo(({
  placeholder = "What are you looking for?",
  onSearch,
  onSuggestionPress,
  suggestions,
  containerStyle,
  searchBarStyle,
}) => {
  const borderColor = useThemeColor({}, 'border');

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  const handleSuggestionPress = (suggestion: string) => {
    onSuggestionPress?.(suggestion);
  };

  return (
    <View style={[styles.container, { borderColor }, containerStyle]}>
      <SearchBarWithSuggestions
        containerStyle={[styles.searchBar, searchBarStyle]}
        placeholder={placeholder}
        onSearch={handleSearch}
        onSuggestionPress={handleSuggestionPress}
        suggestions={suggestions}
      />
    </View>
  );
});

SearchSection.displayName = 'SearchSection';

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent', // Will be overridden by theme
  },
  searchBar: {
    borderRadius: 25,
  },
});