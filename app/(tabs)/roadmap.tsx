import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useRoadmap, RoadmapWelcome, roadmapStyles } from '@/modules/roadmap'
import CreateRoadmapModal from '@/modules/roadmap/components/RoadmapModal'

export default function RoadmapScreen() {
  const { colors, handlers, modal } = useRoadmap()

  return (
    <SafeAreaView style={[roadmapStyles.container, { backgroundColor: colors.backgroundColor }]}>
      <RoadmapWelcome colors={colors} handlers={handlers} />
      <CreateRoadmapModal 
        isVisible={modal.isModalVisible} 
        onClose={handlers.handleCloseModal} 
      />
    </SafeAreaView>
  )
}
