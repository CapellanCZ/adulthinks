import React, { useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@/components/ui/picker';
import { Button } from '@/components/ui/button';
import { Sparkle } from 'lucide-react-native';
import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { FIELD_CATEGORY_OPTIONS, DEGREE_PROGRAM_OPTIONS } from "@/data/degree-programs";
import { Text } from '@/components/ui/text';

export function CreateRoadmapContent({ 
  onGenerate, 
  isGenerating,
  error,
}: { 
  onGenerate?: (category: string, course: string) => void | Promise<void>,
  isGenerating?: boolean,
  error?: string | null,
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const handleGenerate = () => {
    if (onGenerate && selectedCategory && selectedCourse) onGenerate(selectedCategory, selectedCourse);
  };

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
          searchPlaceholder='Search field categories...'
          modalTitle='Field Categories'
          options={FIELD_CATEGORY_OPTIONS}
          disabled={isGenerating}
        />

        <Picker
          variant='outline'
          label='Course'
          value={selectedCourse}
          onValueChange={(value) => setSelectedCourse(value)}
          placeholder={selectedCategory ? 'Select a course...' : 'Select a category first'}
          searchPlaceholder='Search a course name or abbreviation...'
          modalTitle='Courses'
          disabled={!selectedCategory || isGenerating}
          options={selectedCategory ? DEGREE_PROGRAM_OPTIONS[selectedCategory] : []}
        />
      </View>

      {error ? (
        <View style={{ padding: 12, borderRadius: 8, backgroundColor: '#FF000014' }}>
          <Text style={{ color: '#cc0000' }}>{error}</Text>
        </View>
      ) : null}

      <Button 
        icon={Sparkle} 
        variant='default' 
        size='lg'
        onPress={handleGenerate}
        disabled={!selectedCategory || !selectedCourse || !!isGenerating}
      >
        {isGenerating ? 'Generating…' : 'Generate My Roadmap'}
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
  onGenerate,
  isGenerating,
  error,
}: {
  isVisible: boolean;
  onClose: () => void;
  onGenerate?: (category: string, course: string) => void | Promise<void>;
  isGenerating?: boolean;
  error?: string | null;
}) {
  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} snapPoints={[0.3]}>
      <CreateRoadmapContent onGenerate={onGenerate} isGenerating={isGenerating} error={error} />
    </BottomSheet>
  );
}
