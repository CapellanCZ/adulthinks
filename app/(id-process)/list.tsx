import React, { useState, useCallback } from 'react'
import { StyleSheet, FlatList, ListRenderItem, ActivityIndicator, Pressable } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { IdCard, FileText, Car, ChevronLeft } from 'lucide-react-native'
import { View } from '@/components/ui/view'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { SearchBarWithSuggestions } from '@/components/ui/searchbar'
import { PopularCard, PopularCardData } from '@/modules/home/components/popularCard'
import { useThemeColor } from '@/hooks/useThemeColor'

// Sample data generator
const generateSampleData = (startIndex: number, count: number): PopularCardData[] => {
  const icons = [IdCard, FileText, Car];
  const categories = ['Primary', 'Secondary'];
  const badges = [
    [
      { label: 'Quick', variant: 'secondary' as const },
      { label: 'Lifetime', variant: 'secondary' as const },
      { label: 'Online/Onsite', variant: 'secondary' as const },
    ],
    [
      { label: 'Fast', variant: 'secondary' as const },
      { label: '5 Years', variant: 'secondary' as const },
      { label: 'Walk-in', variant: 'secondary' as const },
    ],
    [
      { label: '3-5 Days', variant: 'secondary' as const },
      { label: '10 Years', variant: 'secondary' as const },
      { label: 'Online', variant: 'secondary' as const },
    ],
  ];

  return Array.from({ length: count }, (_, index) => {
    const actualIndex = startIndex + index;
    const iconIndex = actualIndex % icons.length;
    const badgeIndex = actualIndex % badges.length;
    
    return {
      id: `gov-id-${actualIndex}`,
      title: `Government ID ${actualIndex + 1}`,
      category: categories[actualIndex % categories.length],
      description: `This is a sample government ID document ${actualIndex + 1}. It serves as an official identification document issued by the government for various transactions and verification purposes.`,
      icon: icons[iconIndex],
      badges: badges[badgeIndex],
      additionalInfo: {
        title: 'Requirements & Process',
        content: `For Government ID ${actualIndex + 1}, you need to provide basic personal information, valid supporting documents, and complete the application process. Processing time varies depending on the type of document and current workload.`
      }
    };
  });
};

export default function ListOfGovernmentID() {
  const params = useLocalSearchParams<{ 
    id?: string; 
    title?: string; 
    category?: string; 
    description?: string;
    processingTime?: string;
    validity?: string;
    serviceType?: string;
  }>()

  const textColor = useThemeColor({}, 'text')
  const mutedColor = useThemeColor({}, 'textMuted')
  const borderColor = useThemeColor({}, 'border')
  const iconColor = useThemeColor({}, 'icon')

  // State management
  const [data, setData] = useState<PopularCardData[]>(() => generateSampleData(0, 10))
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<PopularCardData[]>(data)

  // Search suggestions
  const searchSuggestions = [
    'National ID',
    'Driver\'s License',
    'Passport',
    'SSS ID',
    'PhilHealth ID',
    'TIN ID',
    'Voter\'s ID',
    'Senior Citizen ID',
    'PWD ID',
    'Barangay ID'
  ]

  // Load more data function
  const loadMoreData = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const newData = generateSampleData(data.length, 15)
      setData(prevData => [...prevData, ...newData])
      
      // Stop loading more after 100 items (for demo purposes)
      if (data.length + 15 >= 100) {
        setHasMore(false)
      }
      
      setIsLoading(false)
    }, 1000)
  }, [data.length, isLoading, hasMore])

  // Handle card press
  const handleCardPress = useCallback((cardData: PopularCardData) => {
    console.log('Card pressed:', cardData.title)
  }, [])

  // Handle back navigation
  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredData(data)
    } else {
      const filtered = data.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }, [data])

  // Handle search suggestion press
  const handleSuggestionPress = useCallback((suggestion: string) => {
    handleSearch(suggestion)
  }, [handleSearch])

  // Update filtered data when main data changes
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(data)
    } else {
      handleSearch(searchQuery)
    }
  }, [data, searchQuery, handleSearch])

  // Render item function
  const renderItem: ListRenderItem<PopularCardData> = useCallback(({ item }) => (
    <PopularCard
      data={item}
      onPress={handleCardPress}
      containerStyle={styles.cardItem}
    />
  ), [handleCardPress])

  // Render sticky header component (back button and title only)
  const renderStickyHeader = useCallback(() => (
    <SafeAreaView style={styles.stickyHeaderSection}>
      <View style={[styles.headerContainer, { borderBottomColor: borderColor }]}>
        <Pressable
          onPress={handleBackPress}
          style={[styles.backButton, { borderColor: borderColor }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={iconColor} />
        </Pressable>
        
        <Text variant="title" style={[styles.headerTitle, { color: textColor }]}>
          List of Government ID
        </Text>
        
        <View style={styles.headerSpacer} />
      </View>
    </SafeAreaView>
  ), [
    borderColor,
    handleBackPress,
    iconColor,
    textColor
  ])

  // Render search bar component (separate from sticky header)
  const renderSearchBar = useCallback(() => (
    <View style={styles.searchSection}>
      <SearchBarWithSuggestions
        placeholder="Search government IDs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        onSuggestionPress={handleSuggestionPress}
        suggestions={searchSuggestions}
        maxSuggestions={5}
        containerStyle={styles.searchBar}
      />
    </View>
  ), [
    searchQuery,
    handleSearch,
    handleSuggestionPress,
    searchSuggestions
  ])

  // Render footer component
  const renderFooter = useCallback(() => {
    if (!hasMore && !isLoading) {
      return (
        <View style={styles.footerContainer}>
          <Text variant="caption" style={[styles.endText, { color: mutedColor }]}>
            No more items to load
          </Text>
        </View>
      )
    }

    if (isLoading) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={textColor} />
          <Text variant="caption" style={[styles.loadingText, { color: mutedColor }]}>
            Loading more items...
          </Text>
        </View>
      )
    }

    if (hasMore) {
      return (
        <View style={styles.footerContainer}>
          <Button
            variant="outline"
            onPress={loadMoreData}
            style={styles.seeMoreButton}
          >
            See more
          </Button>
        </View>
      )
    }

    return null
  }, [hasMore, isLoading, loadMoreData, mutedColor, textColor])

  // Key extractor
  const keyExtractor = useCallback((item: PopularCardData) => item.id, [])

  // Get item layout for better performance
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 200, // Approximate item height
    offset: 200 * index,
    index,
  }), [])

  return (
    <View style={[styles.container]}>
      {/* Sticky Header (Back button and title only) */}
      {renderStickyHeader()}
      
      {/* Search Bar (scrollable with content) */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={renderSearchBar}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
        onEndReachedThreshold={0.1}
        onEndReached={loadMoreData}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeaderSection: {
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  searchSection: {
    paddingVertical: 12,
  },
  searchBar: {
    marginBottom: 0,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardItem: {
    marginBottom: 12,
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  seeMoreButton: {
    minWidth: 120,
  },
  loadingText: {
    fontSize: 14,
  },
  endText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
})
