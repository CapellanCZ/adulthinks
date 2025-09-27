import React, { useState, useMemo, useCallback } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor'
import ProgressSteps, { Title, Content } from '@joaosousa/react-native-progress-steps'
import { ScrollView } from '@/components/ui/scroll-view'
import { RoadmapStep } from '@/modules/roadmap/components/RoadmapStep'
import { RoadmapProgressProps, Milestone } from '../types'

export function RoadmapProgress({ milestones: initialMilestones, onBack }: RoadmapProgressProps) {
  const textColor = useThemeColor({}, 'text')
  const accentPrimary = useThemeColor({}, 'primary')
  const borderColor = useThemeColor({}, 'border')

  const [step, setStep] = useState<number>(0)
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)

  // Function to toggle task completion (immutable update, with auto-advance when milestone completed)
  const toggleTask = (milestoneIndex: number, taskId: string): void => {
    setMilestones((prev) => {
      const updated = prev.map((ms, i) =>
        i !== milestoneIndex
          ? ms
          : {
              ...ms,
              tasks: ms.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
      )

      // If all tasks in the toggled milestone are completed, auto-advance to next step
      const allCompleted = updated[milestoneIndex]?.tasks.every((t) => t.completed)
      if (allCompleted) {
        setStep((s) => Math.min(milestoneIndex + 1, updated.length - 1))
      }

      return updated
    })
  }

  // Function to handle next step
  const handleNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, milestones.length - 1))
  }, [milestones.length])

  // Function to handle previous step
  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  // Generate steps for the progress stepper with inline content
  const progressSteps = useMemo(
    () =>
      milestones.map((milestone, index) => ({
        id: index, // 0-based to align with currentStep
        title: <Title>{milestone.title.split(':')[0]}</Title>,
        content: (
          <Content>
            <RoadmapStep
              title={milestone.title}
              overview={milestone.overview}
              skills={milestone.skills}
              resources={milestone.resources}
              tasks={milestone.tasks}
              onTaskToggle={(taskId) => toggleTask(index, taskId)}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirst={index === 0}
              isLast={index === milestones.length - 1}
            />
          </Content>
        ),
      })),
    [milestones, handleNext, handlePrev]
  )

  const progressSummary = useMemo(() => {
    const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0)
    const completedTasks = milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0)
    const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    return { totalTasks, completedTasks, progressPct }
  }, [milestones])

  const nextMilestoneIndex = useMemo(() => {
    const idx = milestones.findIndex(ms => !ms.tasks.every(t => t.completed))
    return idx === -1 ? milestones.length - 1 : idx
  }, [milestones])

  const skillTags = useMemo(() => {
    const set = new Set<string>()
    milestones.forEach(ms => ms.skills.forEach(sk => set.add(sk)))
    return Array.from(set).slice(0, 4)
  }, [milestones])

  const handleContinue = useCallback(() => {
    setStep(nextMilestoneIndex)
  }, [nextMilestoneIndex])

  // Milestone stats for compact top card
  const milestoneStats = useMemo(() => {
    const totalMs = milestones.length
    const completedMs = milestones.filter(ms => ms.tasks.length > 0 && ms.tasks.every(t => t.completed)).length
    const pct = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0
    return { totalMs, completedMs, pct }
  }, [milestones])

  return (
    <>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>

        <ProgressSteps
          currentStep={step}
          steps={progressSteps}
          colors={{
            title: {
              text: {
                normal: textColor,
                active: accentPrimary,
                completed: accentPrimary,
              },
            },
            marker: {
              text: {
                normal: textColor,
                active: accentPrimary,
                completed: accentPrimary,
              },
              line: {
                normal: borderColor,
                active: accentPrimary,
                completed: accentPrimary,
              },
            },
          }}
        />
      </ScrollView>
    </>
  )
}
