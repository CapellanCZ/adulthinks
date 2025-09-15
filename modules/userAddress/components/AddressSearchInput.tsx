import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SearchResult {
  id: string;
  name: string;
  description?: string;
}

interface AddressSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  searchType: 'barangay' | 'landmark';
  city?: string;
  debounceMs?: number;
}

// Mock barangay data for Cavite cities
const MOCK_BARANGAYS: Record<string, string[]> = {
  'Bacoor': [
    'Alima', 'Aniban I', 'Aniban II', 'Aniban III', 'Aniban IV', 'Aniban V',
    'Bankal', 'Bayanan', 'Campo Santo', 'Daang Bukid', 'Digman',
    'Dulong Bayan', 'Giningtong Silang', 'Habay I', 'Habay II',
    'Kaingin', 'Ligas I', 'Ligas II', 'Ligas III', 'Maliksi I',
    'Maliksi II', 'Maliksi III', 'Mambog I', 'Mambog II', 'Mambog III',
    'Mambog IV', 'Mambog V', 'Molino I', 'Molino II', 'Molino III',
    'Molino IV', 'Molino V', 'Molino VI', 'Molino VII', 'Niog I',
    'Niog II', 'Niog III', 'Panapaan I', 'Panapaan II', 'Panapaan III',
    'Panapaan IV', 'Panapaan V', 'Panapaan VI', 'Panapaan VII',
    'Panapaan VIII', 'Queens Row Central', 'Queens Row East',
    'Queens Row West', 'Real I', 'Real II', 'Salinas I', 'Salinas II',
    'San Nicolas I', 'San Nicolas II', 'San Nicolas III', 'Sineguelasan',
    'Tabing Dagat', 'Talaba I', 'Talaba II', 'Talaba III', 'Talaba IV',
    'Talaba V', 'Talaba VI', 'Talaba VII', 'Zapote I', 'Zapote II',
    'Zapote III', 'Zapote IV', 'Zapote V'
  ],
  'Imus': [
    'Alapan I-A', 'Alapan I-B', 'Alapan I-C', 'Alapan II-A', 'Alapan II-B',
    'Anabu I-A', 'Anabu I-B', 'Anabu I-C', 'Anabu I-D', 'Anabu I-E',
    'Anabu I-F', 'Anabu I-G', 'Anabu II-A', 'Anabu II-B', 'Anabu II-C',
    'Anabu II-D', 'Anabu II-E', 'Anabu II-F', 'Bayan Luma I',
    'Bayan Luma II', 'Bayan Luma III', 'Bayan Luma IV', 'Bayan Luma V',
    'Bayan Luma VI', 'Bayan Luma VII', 'Bayan Luma VIII', 'Bayan Luma IX',
    'Bucandala I', 'Bucandala II', 'Bucandala III', 'Bucandala IV',
    'Bucandala V', 'Buhay na Tubig', 'カワヤン I', 'Kawayan II',
    'Malagasang I-A', 'Malagasang I-B', 'Malagasang I-C', 'Malagasang I-D',
    'Malagasang I-E', 'Malagasang I-F', 'Malagasang I-G', 'Malagasang II-A',
    'Malagasang II-B', 'Malagasang II-C', 'Malagasang II-D', 'Malagasang II-E',
    'Malagasang II-F', 'Palico I', 'Palico II', 'Palico III', 'Palico IV',
    'Panacan I', 'Panacan II', 'Panacan III', 'Poblacion I-A',
    'Poblacion I-B', 'Poblacion I-C', 'Poblacion II-A', 'Poblacion II-B',
    'Poblacion III-A', 'Poblacion III-B', 'Poblacion IV-A', 'Poblacion IV-B',
    'Tanzang Luma I', 'Tanzang Luma II', 'Tanzang Luma III', 'Tanzang Luma IV',
    'Tanzang Luma V', 'Tanzang Luma VI', 'Toclong I-A', 'Toclong I-B',
    'Toclong I-C', 'Toclong II-A', 'Toclong II-B', 'Toclong II-C'
  ],
  'Dasmariñas': [
    'Bagong Bayan', 'Burol I', 'Burol II', 'Burol III', 'Datu Esmael',
    'Langkaan I', 'Langkaan II', 'Lunsad', 'Malinta', 'Paliparan I',
    'Paliparan II', 'Paliparan III', 'Sabang', 'Salawag', 'Sampaloc I',
    'Sampaloc II', 'Sampaloc III', 'Sampaloc IV', 'San Agustin I',
    'San Agustin II', 'San Agustin III', 'San Antonio de Padua I',
    'San Antonio de Padua II', 'San Dionisio', 'San Esteban',
    'San Francisco I', 'San Francisco II', 'San Isidro I', 'San Isidro II',
    'San Jose', 'San Juan I', 'San Juan II', 'San Luis I', 'San Luis II',
    'San Mateo', 'San Miguel', 'San Nicolas I', 'San Nicolas II',
    'San Pedro I', 'San Pedro II', 'San Roque I', 'San Roque II',
    'San Simon', 'Santa Clara', 'Santa Cruz I', 'Santa Cruz II',
    'Santa Fe', 'Santa Jenny', 'Santa Lucia', 'Zone I', 'Zone II',
    'Zone III', 'Zone IV'
  ],
};

export const AddressSearchInput: React.FC<AddressSearchInputProps> = ({
  value,
  onChangeText,
  onBlur,
  placeholder,
  label,
  error,
  required = false,
  searchType,
  city,
  debounceMs = 300,
}) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);

  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  // Perform search based on search type
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      let results: SearchResult[] = [];

      if (searchType === 'barangay' && city && MOCK_BARANGAYS[city]) {
        const barangays = MOCK_BARANGAYS[city];
        results = barangays
          .filter(barangay => 
            barangay.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 10) // Limit to 10 results
          .map((barangay, index) => ({
            id: `barangay-${index}`,
            name: barangay,
            description: `Barangay in ${city}`,
          }));
      } else if (searchType === 'landmark') {
        // Mock landmark search - in real app, this would call Google Places API
        const mockLandmarks = [
          'SM City Bacoor', 'Robinsons Place Imus', 'Southmall', 'Walter Mart Dasmariñas',
          'De La Salle University Dasmariñas', 'Lyceum of the Philippines University Cavite',
          'Cavite State University', 'People\'s Park in the Sky', 'Tagaytay Picnic Grove',
          'Sky Ranch Tagaytay', 'Twin Lakes Golf & Country Club', 'Vermosa Sports Hub',
          'Festival Supermall', 'Vista Mall Dasmariñas', 'Starmall Dasmariñas'
        ];

        results = mockLandmarks
          .filter(landmark => 
            landmark.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 8)
          .map((landmark, index) => ({
            id: `landmark-${index}`,
            name: landmark,
            description: 'Popular landmark in Cavite',
          }));
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchType, city]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== value) {
        performSearch(searchQuery);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch, value, debounceMs]);

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    onChangeText(text);
    setShowResults(text.length >= 2);
  };

  const handleSelectResult = (result: SearchResult) => {
    onChangeText(result.name);
    setSearchQuery(result.name);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleBlur = () => {
    // Delay hiding results to allow for selection
    setTimeout(() => {
      setShowResults(false);
    }, 150);
    onBlur?.();
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 4,
      zIndex: 1000,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
      marginBottom: 8,
    },
    requiredIndicator: {
      color: '#FF6B6B',
    },
    inputContainer: {
      position: 'relative',
    },
    input: {
      borderWidth: 1,
      borderColor: error ? '#FF6B6B' : borderColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: textColor,
      backgroundColor: backgroundColor,
    },
    loadingIndicator: {
      position: 'absolute',
      right: 12,
      top: 12,
      fontSize: 14,
      color: textColor,
      opacity: 0.6,
    },
    errorText: {
      fontSize: 12,
      color: '#FF6B6B',
      marginTop: 4,
    },
    resultsModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    resultsContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: backgroundColor,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: borderColor,
      maxHeight: 250,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      zIndex: 1001,
    },
    resultItem: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    lastResultItem: {
      borderBottomWidth: 0,
    },
    resultName: {
      fontSize: 16,
      color: textColor,
      fontWeight: '500',
    },
    resultDescription: {
      fontSize: 12,
      color: textColor,
      opacity: 0.6,
      marginTop: 2,
    },
    noResults: {
      paddingHorizontal: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    noResultsText: {
      fontSize: 14,
      color: textColor,
      opacity: 0.6,
    },
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredIndicator}>*</Text>}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          placeholderTextColor={`${textColor}80`}
          autoComplete="off"
          autoCorrect={false}
        />
        {isSearching && <Text style={styles.loadingIndicator}>...</Text>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {showResults && (
        <Modal
          visible={showResults}
          transparent
          animationType="none"
          onRequestClose={() => setShowResults(false)}
        >
          <TouchableOpacity
            style={styles.resultsModal}
            activeOpacity={1}
            onPress={() => setShowResults(false)}
          >
            <View style={styles.resultsContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.resultItem,
                      index === searchResults.length - 1 && styles.lastResultItem,
                    ]}
                    onPress={() => handleSelectResult(item)}
                  >
                    <Text style={styles.resultName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.resultDescription}>{item.description}</Text>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  !isSearching ? (
                    <View style={styles.noResults}>
                      <Text style={styles.noResultsText}>
                        {searchType === 'barangay' && !city
                          ? 'Please select a city first'
                          : 'No results found'
                        }
                      </Text>
                    </View>
                  ) : null
                }
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default AddressSearchInput;