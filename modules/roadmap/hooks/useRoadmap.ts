import { useState } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Milestone } from '../types'
import { generateRoadmap } from '../services/aiService'
import { createRoadmap, updateRoadmapProgress } from '../services/roadmapRepository'
import { useCurrentUser } from '@/modules/community/hooks/useCurrentUser'

// No local static sample data. Roadmaps are AI-generated and enriched server-side.

export function useRoadmap() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(false)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [roadmapId, setRoadmapId] = useState<string | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const { userId } = useCurrentUser()
  
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')
  const textMuted = useThemeColor({}, 'textMuted')
  const primaryColor = useThemeColor({}, 'primary')

  const handleGenerateRoadmap = () => {
    setIsModalVisible(true)
  }

  const handleFabPress = () => {
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  const handleCreateRoadmap = async (category: string, course: string) => {
    setGenerationError(null)
    setIsGenerating(true)
    try {
      // Generate with AI service + SearchAPI enrichment
      const aiMilestones = await generateRoadmap(category, course, {
        searchApiKey: process.env.EXPO_PUBLIC_SEARCHAPI_API_KEY,
        aimlApiKey: process.env.EXPO_PUBLIC_AIMLAPI_KEY,
        openRouterKey: process.env.EXPO_PUBLIC_OPENROUTER_KEY,
        freeOnly: true,
        maxResources: 3,
      })

      // Persist to Supabase if user is logged in
      let newId: string | undefined
      if (userId) {
        const created = await createRoadmap(userId, category, course, aiMilestones)
        newId = created.id
      }

      // Update local state
      setMilestones(aiMilestones)
      setHasGeneratedRoadmap(true)
      setRoadmapId(newId)
      setIsModalVisible(false)
    } catch (err: any) {
      console.error('Roadmap generation failed:', err)
      setGenerationError(err?.message || 'Failed to generate roadmap. Check your AI/SearchAPI setup and try again.')
      // Keep modal open so the user can adjust and retry
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBackToWelcome = () => {
    setHasGeneratedRoadmap(false)
    setMilestones([])
    setRoadmapId(undefined)
  }

  const handleProgressChange = async (updated: Milestone[]) => {
    // Update local state immediately
    setMilestones(updated)

    // Persist progress if we have a roadmap id
    if (roadmapId) {
      try {
        await updateRoadmapProgress(roadmapId, updated)
      } catch {
        // Swallow errors for now; UI stays optimistic
      }
    }
  }

  return {
    colors: {
      backgroundColor,
      borderColor,
      textColor,
      textMuted,
      primaryColor,
    },
    handlers: {
      handleGenerateRoadmap,
      handleFabPress,
      handleCloseModal,
      handleBackToWelcome,
      handleCreateRoadmap,
      handleProgressChange,
    },
    modal: {
      isModalVisible,
      isGenerating,
      generationError,
    },
    roadmapState: {
      hasGeneratedRoadmap,
      milestones,
      roadmapId,
    },
  }
}
