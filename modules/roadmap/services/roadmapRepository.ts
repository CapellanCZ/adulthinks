import { supabase } from '@/lib/supabase'
import { Milestone } from '../types'

function computeProgress(milestones: Milestone[]) {
  const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0)
  const completedTasks = milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0)
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const rawIndex = milestones.findIndex(ms => !ms.tasks.every(t => t.completed))
  const currentMilestoneIndex = rawIndex === -1 ? Math.max(0, milestones.length - 1) : rawIndex
  const isCompleted = totalTasks > 0 && completedTasks === totalTasks

  return { totalTasks, completedTasks, progressPct, currentMilestoneIndex, isCompleted }
}

export async function createRoadmap(
  userId: string,
  category: string,
  course: string,
  milestones: Milestone[],
): Promise<{ id: string }> {
  const stats = computeProgress(milestones)

  try {
    const { data, error } = await supabase
      .from('user_roadmaps')
      .insert({
        user_id: userId,
        category,
        course,
        milestones,
        progress: {
          total_tasks: stats.totalTasks,
          completed_tasks: stats.completedTasks,
          progress_pct: stats.progressPct,
          current_milestone_index: stats.currentMilestoneIndex,
        },
        is_completed: stats.isCompleted,
      })
      .select('id')
      .single()

    if (error) throw error
    return { id: data.id as string }
  } catch {
    // Fallback to client-only id if table not available yet
    const fallbackId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    return { id: fallbackId }
  }
}

export async function updateRoadmapProgress(roadmapId: string, milestones: Milestone[]) {
  const stats = computeProgress(milestones)
  try {
    await supabase
      .from('user_roadmaps')
      .update({
        milestones,
        progress: {
          total_tasks: stats.totalTasks,
          completed_tasks: stats.completedTasks,
          progress_pct: stats.progressPct,
          current_milestone_index: stats.currentMilestoneIndex,
        },
        is_completed: stats.isCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roadmapId)
  } catch {
    // Swallow errors to keep UI responsive
  }
}
