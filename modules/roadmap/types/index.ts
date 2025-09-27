export interface RoadmapColors {
  backgroundColor: string
  borderColor: string
  textColor: string
  textMuted: string
  primaryColor: string
}

export interface RoadmapHandlers {
  handleGenerateRoadmap: () => void
  handleFabPress: () => void
  handleCloseModal: () => void
}

export interface RoadmapModal {
  isModalVisible: boolean
}

export interface RoadmapWelcomeProps {
  colors: RoadmapColors
  handlers: RoadmapHandlers
}

export interface RoadmapScreenProps {
  // Add any props that might be passed to the main screen
  testId?: string
}
