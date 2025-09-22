import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useCommunityStyles } from '../styles/communityStyles';
import { useCommunityStore } from '../store/useCommunityStore';
import type { HashtagFilter as HashtagFilterType } from '../types';

// Predefined hashtags for Cavite government ID processes
const CAVITE_ID_HASHTAGS: HashtagFilterType[] = [
  { value: 'tips', label: 'Tips' },
  { value: 'success', label: 'Success Stories' },
  { value: 'requirements', label: 'Requirements' },
  { value: 'process', label: 'Process Guide' },
  { value: 'documents', label: 'Documents' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'location', label: 'Location' },
  { value: 'fees', label: 'Fees' },
  { value: 'waiting_time', label: 'Waiting Time' },
  { value: 'online_application', label: 'Online Application' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'renewal', label: 'Renewal' },
  { value: 'first_time', label: 'First Time' },
  { value: 'senior_citizen', label: 'Senior Citizen' },
  { value: 'pwd', label: 'PWD' },
  { value: 'student', label: 'Student' },
  { value: 'ofw', label: 'OFW' },
];

export function HashtagFilter() {
  const styles = useCommunityStyles();
  const { selectedHashtag, setSelectedHashtag } = useCommunityStore();

  function handleHashtagPress(hashtag: string | null) {
    setSelectedHashtag(hashtag === selectedHashtag ? null : hashtag);
  }

  return (
    <View style={styles.hashtagContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hashtagScrollView}
      >
        {/* All Posts Option */}
        <TouchableOpacity
          style={[
            styles.hashtagChip,
            selectedHashtag === null && styles.hashtagChipActive
          ]}
          onPress={() => handleHashtagPress(null)}
          accessibilityRole="button"
          accessibilityLabel="Show all posts"
        >
          <Text style={[
            styles.hashtagChipText,
            selectedHashtag === null && styles.hashtagChipTextActive
          ]}>
            All Posts
          </Text>
        </TouchableOpacity>

        {/* Hashtag Options */}
        {CAVITE_ID_HASHTAGS.map((hashtag) => (
          <TouchableOpacity
            key={hashtag.value}
            style={[
              styles.hashtagChip,
              selectedHashtag === hashtag.value && styles.hashtagChipActive
            ]}
            onPress={() => handleHashtagPress(hashtag.value)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${hashtag.label}`}
          >
            <Text style={[
              styles.hashtagChipText,
              selectedHashtag === hashtag.value && styles.hashtagChipTextActive
            ]}>
              #{hashtag.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export { CAVITE_ID_HASHTAGS };
