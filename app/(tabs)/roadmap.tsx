import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pressable } from 'react-native'
import { Sparkle } from 'lucide-react-native'

import { useRoadmap, RoadmapWelcome, roadmapStyles } from '@/modules/roadmap'
import { RoadmapProgress } from '@/modules/roadmap/components/RoadmapProgress'
import CreateRoadmapModal from '@/modules/roadmap/components/RoadmapModal'
import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'

export default function RoadmapScreen() {
  const { colors, handlers, modal, roadmapState } = useRoadmap()

  return (
    <SafeAreaView style={[roadmapStyles.container, { backgroundColor: colors.backgroundColor }]}>
      {/* Consistent Header */}
      <View style={[roadmapStyles.header, { borderBottomColor: colors.borderColor }]}>
        <Text variant="title" style={{ color: colors.textColor }}>
          Career Roadmap
        </Text>
      </View>

      {roadmapState.hasGeneratedRoadmap ? (
        <RoadmapProgress 
          milestones={roadmapState.milestones} 
          onBack={handlers.handleBackToWelcome}
        />
      ) : (
        <RoadmapWelcome colors={colors} handlers={handlers} />
      )}

      {/* FAB - Only appears when progress screen is shown */}
      {roadmapState.hasGeneratedRoadmap && (
        <Pressable
          style={[roadmapStyles.fab, { backgroundColor: colors.primaryColor }]}
          onPress={handlers.handleFabPress}
        >
          <Sparkle size={24} color="white" />
        </Pressable>
      )}
      
      <CreateRoadmapModal 
        isVisible={modal.isModalVisible} 
        onClose={handlers.handleCloseModal}
        onGenerate={handlers.handleCreateRoadmap}
      />
    </SafeAreaView>
  )
}
