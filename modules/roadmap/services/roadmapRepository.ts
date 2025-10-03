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

  // Derive summary fields for normalized storage
  const milestoneCount = milestones.length
  const title = `${category} - ${course}`
  const overview = milestones[0]?.overview || ''
  const snapshot = JSON.stringify(milestones)

  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .upsert({
        user_id: userId,
        category,
        course,
        title,
        overview,
        milestone_count: milestoneCount,
        progress_pct: stats.progressPct,
        is_completed: stats.isCompleted,
        milestones_snapshot: snapshot as any,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,category,course' })
      .select('id')
      .single()

    if (error) throw error
    const roadmapId = data.id as string

    return { id: roadmapId }
  } catch (e) {
    // Fallback to client-only id if table not available yet
    const fallbackId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    return { id: fallbackId }
  }
}

export async function updateRoadmapProgress(roadmapId: string, milestones: Milestone[]) {
  const stats = computeProgress(milestones)
  const snapshot = JSON.stringify(milestones)
  try {
    await supabase
      .from('roadmaps')
      .update({
        milestone_count: milestones.length,
        progress_pct: stats.progressPct,
        is_completed: stats.isCompleted,
        milestones_snapshot: snapshot as any,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roadmapId)
  } catch {
    // Swallow errors to keep UI responsive
  }
}

export async function getLatestRoadmapByUser(userId: string): Promise<{ id: string; milestone_count: number; progress_pct: number; is_completed: boolean; milestones?: Milestone[] } | null> {
  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('id, milestone_count, progress_pct, is_completed, milestones_snapshot, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    if (!data) return null
    return {
      id: data.id as string,
      milestone_count: Number(data.milestone_count),
      progress_pct: Number(data.progress_pct),
      is_completed: Boolean(data.is_completed),
      milestones: data.milestones_snapshot ? (data.milestones_snapshot as any) as Milestone[] : undefined,
    }
  } catch (e) {
    console.warn('Fetch latest roadmap failed:', (e as any)?.message || e)
    return null
  }
}

export async function getRoadmapTasks(roadmapId: string): Promise<Array<{ id: string; milestone_index: number; task_index: number; title: string; completed: boolean }>> {
  try {
    const { data, error } = await supabase
      .from('roadmap_tasks')
      .select('id, milestone_index, task_index, title, completed')
      .eq('roadmap_id', roadmapId)
      .order('milestone_index', { ascending: true })
      .order('task_index', { ascending: true })

    if (error) throw error
    return (data || []).map(r => ({
      id: r.id as string,
      milestone_index: Number(r.milestone_index),
      task_index: Number(r.task_index),
      title: r.title as string,
      completed: Boolean(r.completed),
    }))
  } catch (e) {
    console.warn('Fetch roadmap tasks failed:', (e as any)?.message || e)
    return []
  }
}
