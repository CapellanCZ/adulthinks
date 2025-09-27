import React, { useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@/components/ui/picker';
import { Button } from '@/components/ui/button';
import { Sparkle } from 'lucide-react-native';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { FIELD_CATEGORY_OPTIONS, DEGREE_PROGRAM_OPTIONS } from "@/data/degree-programs";

export function CreateRoadmapContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  return (
    <View style={{ gap: 16 }}>
      {/* Form */}
      <View style={{ gap: 12 }}>
        <Picker
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            setSelectedCourse('');
          }}
          label='Category'
          variant='outline'
          placeholder='Select a field category...'
          searchable
          searchPlaceholder='Search field categories...'
          modalTitle='Field Categories'
          options={FIELD_CATEGORY_OPTIONS}
        />

        <Picker
          variant='outline'
          label='Course'
          value={selectedCourse}
          onValueChange={(value) => setSelectedCourse(value)}
          placeholder={selectedCategory ? 'Select a course...' : 'Select a category first'}
          searchable
          searchPlaceholder='Search a course name or abbreviation...'
          modalTitle='Courses'
          disabled={!selectedCategory}
          options={selectedCategory ? DEGREE_PROGRAM_OPTIONS[selectedCategory] : []}
        />
      </View>

      <Button icon={Sparkle} variant='default' size='lg'>
        Generate My Roadmap
      </Button>
    </View>
  );
}

export function useCreateRoadmapModal() {
  // Reuse the shared bottom sheet hook for visibility control
  return useBottomSheet();
}

// Default export: self-contained BottomSheet modal
export default function CreateRoadmapModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} snapPoints={[0.3]}>
      <CreateRoadmapContent />
    </BottomSheet>
  );
}
