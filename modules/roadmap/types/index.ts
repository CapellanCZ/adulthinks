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
  handleBackToWelcome: () => void
  handleCreateRoadmap: (category: string, course: string) => Promise<void>
  handleProgressChange: (milestones: Milestone[]) => Promise<void>
}

export interface RoadmapModal {
  isModalVisible: boolean
}

export interface RoadmapState {
  hasGeneratedRoadmap: boolean
  milestones: Milestone[]
  roadmapId?: string
}

// Roadmap data types
export interface MilestoneTask {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
}

export interface MilestoneResource {
  type: 'COURSE' | 'ARTICLE'
  title: string
  description: string
  url: string
}

export interface Milestone {
  id: string
  title: string
  overview: string
  skills: string[]
  timeframe: string
  resources: MilestoneResource[]
  tasks: MilestoneTask[]
}

export interface RoadmapWelcomeProps {
  colors: RoadmapColors
  handlers: RoadmapHandlers
}

export interface RoadmapProgressProps {
  milestones: Milestone[]
  onBack: () => void
  onProgressChange?: (milestones: Milestone[]) => void
}

export interface RoadmapScreenProps {
  // Add any props that might be passed to the main screen
  testId?: string
}
