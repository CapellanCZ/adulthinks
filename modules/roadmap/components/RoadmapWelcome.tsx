import React from 'react'
import { Sparkles } from 'lucide-react-native'

import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'
import { Button } from '@/components/ui/button'
import { roadmapStyles } from '../styles/roadmapStyles'
import { RoadmapWelcomeProps } from '../types'
import Journey from '@/assets/svg/women-led'

export function RoadmapWelcome({ colors, handlers }: RoadmapWelcomeProps) {
  const { textColor, textMuted, primaryColor } = colors
  const { handleGenerateRoadmap } = handlers

  return (
    <View style={roadmapStyles.welcomeContainer}>
      <Journey width={200} height={200} />

      <Text variant="heading" style={[roadmapStyles.subtitle, { color: textColor }]}>
        Start Your Journey
      </Text>

      <Text variant="body" style={[roadmapStyles.description, { color: textMuted }]}>
        AI will generate a personalized career path for you based on the degree or course field you choose.
        Get step-by-step guidance tailored to your goals.
      </Text>

      <Button
        onPress={handleGenerateRoadmap}
        style={roadmapStyles.generateButton}
        icon={Sparkles}
      >
        Generate a Roadmap
      </Button>
    </View>
  )
}
