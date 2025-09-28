import { supabase } from '@/lib/supabase'
import { Milestone } from '../types'

// AI-backed generator via Supabase Edge Function using SearchAPI enrichment
export async function generateRoadmap(
  category: string,
  course: string,
  preferences?: { searchApiKey?: string; openaiApiKey?: string; geminiApiKey?: string; freeOnly?: boolean; maxResources?: number; allowedDomains?: string[] }
): Promise<Milestone[]> {
  console.log('Roadmap generation started:', { category, course })
  
  try {
    console.log('Attempting Edge Function call...')
    const { data, error } = await supabase.functions.invoke('generate-roadmap', {
      body: { category, course, preferences },
    })
    
    if (error) {
      console.error('Edge Function error:', error)
      throw new Error(error.message || 'Edge function failed')
    }
    
    if (data && (data as any).error) {
      console.error('Edge Function returned error:', (data as any).error)
      throw new Error(String((data as any).error))
    }
    
    if (!data || !Array.isArray((data as any).milestones)) {
      console.error('Edge Function returned invalid data:', data)
      throw new Error('AI generation returned no milestones')
    }
    
    console.log('Edge Function success:', (data as any).milestones.length, 'milestones')
    return data.milestones as Milestone[]
  } catch (edgeErr) {
    console.warn('Edge Function failed, falling back to client-side generation:', edgeErr)
    // Fallback: generate directly from client using OpenAI + SearchAPI to unblock UX
    return await directGenerateClient(category, course, preferences)
  }
}

// ===== Client-side fallback (OpenAI + SearchAPI) =====

type MilestoneResource = { type: 'COURSE' | 'ARTICLE'; title: string; description: string; url: string }

function systemPrompt(): string {
  return `You are an expert curriculum designer. Generate a practical, step-by-step learning roadmap.
Return strictly valid JSON following this TypeScript type. Do not include any extra commentary.

interface MilestoneTask { id: string; title: string; description: string; duration: string; completed: boolean; }
interface MilestoneResource { type: 'COURSE' | 'ARTICLE'; title: string; description: string; url: string; }
interface Milestone { id: string; title: string; overview: string; skills: string[]; timeframe: string; resources: MilestoneResource[]; tasks: MilestoneTask[]; }

Rules:
- Produce exactly 6 milestones.
- Each milestone must have 3 tasks, with completed=false and duration like "1 hour".
- Each milestone must have at least 2 resources: one COURSE and one ARTICLE, with live URLs.
- Resource descriptions should be a short paragraph.
- Use only reputable sources (Coursera, freeCodeCamp, edX, Khan Academy, MDN, official docs, university pages).
- Keep titles concise and actionable.
- Overview should be 1-2 sentences.
- skills array should have 2 short items.
- timeframe in the form "Month N" or "Month N-M".
- Output JSON: { "milestones": Milestone[] }.`
}

async function callOpenAIDirect(category: string, course: string, openaiKey?: string): Promise<any | null> {
  const key = openaiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY
  if (!key) {
    console.error('OpenAI API key not found in environment or preferences')
    return null
  }
  
  const model = 'gpt-4o-mini'
  const messages = [
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: `Category: ${category}\nCourse: ${course}\nPreferences: {}` },
  ]

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model, messages, temperature: 0.4 }),
    })
    
    if (!resp.ok) {
      const errorText = await resp.text()
      console.error('OpenAI API error:', resp.status, errorText)
      return null
    }
    
    const data = await resp.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      console.error('OpenAI returned no content')
      return null
    }
    
    try {
      return JSON.parse(content)
    } catch {
      const match = content.match(/\{[\s\S]*\}/)
      if (match) {
        try { return JSON.parse(match[0]) } catch {}
      }
      console.error('Failed to parse OpenAI response as JSON')
      return null
    }
  } catch (error) {
    console.error('OpenAI fetch error:', error)
    return null
  }
}

async function callGeminiDirect(category: string, course: string, geminiKey?: string): Promise<any | null> {
  const key = geminiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY
  if (!key) {
    console.error('Gemini API key not found in environment or preferences')
    return null
  }

  const model = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash-latest'
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `System Instruction:\n${systemPrompt()}\n\nCategory: ${category}\nCourse: ${course}\nPreferences: {}`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
  }

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    if (!resp.ok) {
      const errorText = await resp.text()
      console.error('Gemini API error:', resp.status, errorText)
      return null
    }

    const data = await resp.json()
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.[0]?.string ??
      ''
    if (!text) {
      console.error('Gemini returned no content')
      return null
    }

    try {
      return JSON.parse(text)
    } catch {
      const match = typeof text === 'string' ? text.match(/\{[\s\S]*\}/) : null
      if (match) {
        try {
          return JSON.parse(match[0])
        } catch {}
      }
      console.error('Failed to parse Gemini response as JSON')
      return null
    }
  } catch (error) {
    console.error('Gemini fetch error:', error)
    return null
  }
}

function ensureStructure(raw: any): { milestones: Milestone[] } | null {
  if (!raw || !Array.isArray(raw.milestones)) return null
  const milestones: Milestone[] = raw.milestones.map((m: any, i: number) => ({
    id: m?.id || `milestone-${i + 1}`,
    title: String(m?.title || `Milestone ${i + 1}`),
    overview: String(m?.overview || ''),
    skills: Array.isArray(m?.skills) ? m.skills.map((s: any) => String(s)).slice(0, 4) : [],
    timeframe: String(m?.timeframe || `Month ${i + 1}`),
    resources: Array.isArray(m?.resources) ? m.resources.map((r: any) => ({
      type: r?.type === 'ARTICLE' ? 'ARTICLE' : 'COURSE',
      title: String(r?.title || 'Resource'),
      description: String(r?.description || ''),
      url: String(r?.url || ''),
    })) : [],
    tasks: Array.isArray(m?.tasks) ? m.tasks.map((t: any, j: number) => ({
      id: t?.id || `task-${i + 1}-${j + 1}`,
      title: String(t?.title || 'Task'),
      description: String(t?.description || ''),
      duration: String(t?.duration || '1 hour'),
      completed: Boolean(t?.completed ?? false),
    })) : [],
  }))
  return { milestones }
}

type SearchApiResult = { title?: string; link?: string; url?: string; snippet?: string }

async function searchDomain(apiKey: string, query: string, site: string): Promise<SearchApiResult[]> {
  const url = `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query + ' site:' + site)}&api_key=${apiKey}`
  const resp = await fetch(url)
  if (!resp.ok) return []
  const data = await resp.json()
  const results: SearchApiResult[] = []
  const organic = Array.isArray(data?.organic_results) ? data.organic_results : []
  for (const r of organic) results.push({ title: r.title, link: r.link, url: r.link, snippet: r.snippet })
  return results
}

async function enrichMilestone(ms: Milestone, options: { domains: string[], maxResources: number, searchKey?: string }) {
  if (!options.searchKey) return
  const baseQuery = `${ms.title} ${ms.skills?.[0] || ''}`.trim()
  const courseCandidates: MilestoneResource[] = []
  const articleCandidates: MilestoneResource[] = []
  for (const site of options.domains) {
    if (courseCandidates.length + articleCandidates.length >= options.maxResources) break
    try {
      const results = await searchDomain(options.searchKey, baseQuery, site)
      if (results.length > 0) {
        const r = results[0]
        if (r?.url && r?.title) {
          const url = r.url as string
          const isCourse = /coursera|edx|freecodecamp\.org\/learn|udacity|udemy/.test(site) || /course|learn|specialization/.test(url)
          const res: MilestoneResource = {
            type: isCourse ? 'COURSE' : 'ARTICLE',
            title: r.title as string,
            description: (r.snippet as string) || 'Relevant resource',
            url,
          }
          if (isCourse) {
            if (!courseCandidates.some(x => x.url === res.url)) courseCandidates.push(res)
          } else {
            if (!articleCandidates.some(x => x.url === res.url)) articleCandidates.push(res)
          }
        }
      }
    } catch {
      // ignore
    }
  }
  const combined: MilestoneResource[] = []
  if (courseCandidates.length > 0) combined.push(courseCandidates[0])
  if (articleCandidates.length > 0) combined.push(articleCandidates[0])
  const pool = [...courseCandidates.slice(1), ...articleCandidates.slice(1)]
  for (const p of pool) {
    if (combined.length >= options.maxResources) break
    if (!combined.some(x => x.url === p.url)) combined.push(p)
  }
  ms.resources = combined
}

async function directGenerateClient(
  category: string,
  course: string,
  preferences?: { searchApiKey?: string; openaiApiKey?: string; geminiApiKey?: string; freeOnly?: boolean; maxResources?: number; allowedDomains?: string[] }
): Promise<Milestone[]> {
  console.log('Client fallback: Attempting direct OpenAI generation')
  console.log('OpenAI key available:', !!(preferences?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY))

  let ai = await callOpenAIDirect(category, course, preferences?.openaiApiKey)
  if (!ai) {
    console.warn('Client fallback: OpenAI failed, trying Gemini')
    ai = await callGeminiDirect(category, course, preferences?.geminiApiKey)
  }
  if (!ai) {
    console.error('Client fallback: Both OpenAI and Gemini calls failed')
    throw new Error('AI generation failed (OpenAI and Gemini)')
  }
  
  const payload = ensureStructure(ai)
  if (!payload) {
    console.error('Client fallback: Failed to parse AI response structure')
    throw new Error('AI returned invalid milestone structure')
  }

  console.log('Client fallback: Generated', payload.milestones.length, 'milestones')

  const freeOnly = Boolean(preferences?.freeOnly)
  const maxResources = Math.max(2, Math.min(5, Number(preferences?.maxResources) || 3))
  const allowedDomains = Array.isArray(preferences?.allowedDomains)
    ? (preferences!.allowedDomains as string[])
    : (freeOnly
        ? ['freecodecamp.org', 'developer.mozilla.org', 'khanacademy.org', 'docs.python.org']
        : ['coursera.org', 'edx.org', 'freecodecamp.org', 'developer.mozilla.org', 'khanacademy.org', 'docs.python.org'])

  const searchKey = preferences?.searchApiKey || process.env.EXPO_PUBLIC_SEARCHAPI_API_KEY
  if (searchKey) {
    console.log('Client fallback: Enriching with SearchAPI')
    for (const ms of payload.milestones) {
      await enrichMilestone(ms as any, { domains: allowedDomains, maxResources, searchKey })
    }
  } else {
    console.log('Client fallback: No SearchAPI key, skipping enrichment')
  }

  return payload.milestones
}
