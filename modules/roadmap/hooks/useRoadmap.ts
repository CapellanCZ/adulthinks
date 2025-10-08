import { useEffect, useState, useRef } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Milestone } from '../types'
import { generateRoadmap } from '../services/aiService'
import { createRoadmap, updateRoadmapProgress, getLatestRoadmapByUser } from '../services/roadmapRepository'
import { useCurrentUser } from '@/modules/community/hooks/useCurrentUser'
import { supabase } from '@/lib/supabase'

export function useRoadmap() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(false)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [roadmapId, setRoadmapId] = useState<string | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const { userId } = useCurrentUser()
  const loadedForUser = useRef<string | null>(null)
  
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')
  const textMuted = useThemeColor({}, 'textMuted')
  const primaryColor = useThemeColor({}, 'primary')

  // Restore latest roadmap when user logs in
  useEffect(() => {
    const restore = async () => {
      if (!userId) {
        // Reset when logged out
        setHasGeneratedRoadmap(false)
        setMilestones([])
        setRoadmapId(undefined)
        loadedForUser.current = null
        return
      }
      if (loadedForUser.current === userId) return
      const latest = await getLatestRoadmapByUser(userId)
      if (latest && latest.id) {
        // With normalized table, we restore roadmapId only
        setRoadmapId(latest.id)
        loadedForUser.current = userId
      }
    }
    restore().catch(() => {})
  }, [userId])

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
      // Generate with AI service (OpenRouter/AI Router only)
      const aiMilestones = await generateRoadmap(category, course, {
        openRouterKey:
          process.env.EXPO_PUBLIC_AI_ROUTER_KEY ||
          process.env.EXPO_PUBLIC_OPENROUTER_KEY,
      })

      // Persist one roadmap + tasks if user is logged in
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
      setGenerationError(err?.message || 'Failed to generate roadmap. Check your AI Router configuration and try again.')
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

export type RoadmapTask = {
  id: string
  user_id: string
  task: string
  completed: boolean
  created_at: string
  updated_at: string
}

export function useRoadmapTasks(userId?: string) {
  const [tasks, setTasks] = useState<RoadmapTask[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const prevTasksRef = useRef<RoadmapTask[]>([])

  // Load tasks
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!userId) return
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('roadmap')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!cancelled) {
        if (error) setError(error.message)
        else setTasks((data || []) as RoadmapTask[])
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [userId])

  // Subscribe to realtime changes
  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel('roadmap-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'roadmap' }, payload => {
        // Basic sync: re-fetch on any change; for scale, apply granular updates
        supabase
          .from('roadmap')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (error) return
            setTasks((data || []) as RoadmapTask[])
          })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  // Optimistic toggle
  async function toggleTask(id: string, nextCompleted: boolean) {
    setError(null)
    prevTasksRef.current = tasks
    setTasks(ts => ts.map(t => (t.id === id ? { ...t, completed: nextCompleted } : t)))
    const { error } = await supabase
      .from('roadmap')
      .update({ completed: nextCompleted })
      .eq('id', id)
    if (error) {
      // rollback
      setTasks(prevTasksRef.current)
      setError(error.message)
    }
  }

  // Create task
  async function addTask(text: string) {
    setError(null)
    const { data, error } = await supabase
      .from('roadmap')
      .insert({ user_id: userId, task: text, completed: false })
      .select('*')
      .single()
    if (error) setError(error.message)
    else setTasks(ts => [data as RoadmapTask, ...ts])
  }

  // Delete task
  async function deleteTask(id: string) {
    setError(null)
    prevTasksRef.current = tasks
    setTasks(ts => ts.filter(t => t.id !== id))
    const { error } = await supabase
      .from('roadmap')
      .delete()
      .eq('id', id)
    if (error) {
      setTasks(prevTasksRef.current)
      setError(error.message)
    }
  }

  return { tasks, loading, error, toggleTask, addTask, deleteTask }
}
