import { supabase } from '@/lib/supabase'
import { Milestone } from '../types'

// AI-backed generator via Supabase Edge Function using SearchAPI enrichment
export async function generateRoadmap(
  category: string,
  course: string,
  preferences?: { searchApiKey?: string; aimlApiKey?: string; openRouterKey?: string; freeOnly?: boolean; maxResources?: number; allowedDomains?: string[]; userId?: string }
): Promise<Milestone[]> {
  console.log('Roadmap generation started:', { category, course })
  const milestones = await directGenerateClient(category, course, preferences)

  // No direct persistence here; tasks will be saved with roadmap_id after createRoadmap
  return milestones
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

async function callAIMLAPIDirect(category: string, course: string, aimlKey?: string): Promise<any | null> {
  const key = aimlKey || process.env.EXPO_PUBLIC_AIMLAPI_KEY
  if (!key) {
    console.error('AIMLAPI API key not found in environment or preferences')
    return null
  }

  // Primary and fallback models
  const primaryModel = process.env.EXPO_PUBLIC_AIMLAPI_MODEL || ''
  const fallbackModel = 'chatgpt-4o-latest'

  // Build messages
  const messages = [
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: `Category: ${category}\nCourse: ${course}\nReturn strictly { "milestones": Milestone[] } as JSON. No commentary.` },
  ]

  // Compose request body
  const buildBody = (model: string) => ({
    model,
    messages,
    temperature: 0.2,
    max_tokens: 1800,
    n: 1,
    top_p: 0.9,
    presence_penalty: 0,
    frequency_penalty: 0,
    response_format: { type: 'json_object' },
  })

  // Generic parser that handles provider variations
  const parseResponse = async (resp: Response) => {
    const data = await resp.json()
    const choice = data?.choices?.[0] ?? null
    const msg = choice?.message ?? choice?.delta ?? null

    const funcArgs = msg?.function_call?.arguments
      || choice?.message?.tool_calls?.[0]?.function?.arguments
    if (typeof funcArgs === 'string' && funcArgs.length > 0) {
      try { return JSON.parse(funcArgs) } catch (e) { console.error('Failed to parse function/tool JSON:', e) }
    }

    let content: any = msg?.content || choice?.text || data?.output || data?.result
    if (!content || (typeof content === 'string' && content.trim().length === 0)) {
      console.error('AIMLAPI returned no content')
      return null
    }
    if (typeof content !== 'string') {
      if (content && typeof content === 'object') return content
      content = String(content)
    }
    try { return JSON.parse(content) } catch {
      const fenceMatch = content.match(/```json\s*([\s\S]*?)```/i) || content.match(/```\s*([\s\S]*?)```/i)
      if (fenceMatch && fenceMatch[1]) { try { return JSON.parse(fenceMatch[1]) } catch {} }
      const match = content.match(/\{[\s\S]*\}/)
      if (match) { try { return JSON.parse(match[0]) } catch {} }
      console.error('Failed to parse AIMLAPI response as JSON')
      return null
    }
  }

  // Fetch with retry and longer timeout
  const attempt = async (model: string, timeoutMs: number) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const resp = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(buildBody(model)),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!resp.ok) {
        const errorText = await resp.text()
        console.error('AIMLAPI error:', resp.status, errorText)
        return null
      }
      return await parseResponse(resp)
    } catch (error: any) {
      clearTimeout(timeout)
      if (error?.name === 'AbortError') {
        console.error('AIMLAPI fetch error: timeout/aborted')
      } else {
        console.error('AIMLAPI fetch error:', error)
      }
      return null
    }
  }

  // First attempt: primary model, 45s timeout
  let result = await attempt(primaryModel, 45000)
  if (!result) {
    // Brief backoff then fallback attempt: smaller model, 45s timeout
    await new Promise(res => setTimeout(res, 1500))
    result = await attempt(fallbackModel, 45000)
  }

  return result
}

// Removed OpenAI and Gemini direct call implementations

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

async function callOpenRouterDirect(category: string, course: string, key?: string): Promise<any | null> {
  const model = process.env.EXPO_PUBLIC_OPENROUTER_MODEL || process.env.EXPO_PUBLIC_OPENROUTER_MODEL_QWEN || 'qwen/qwen3-coder:free'
  return await callOpenRouterWithModel(category, course, model, key)
}

async function callOpenRouterWithModel(category: string, course: string, model: string, key?: string): Promise<any | null> {
  const orKey = key || process.env.EXPO_PUBLIC_OPENROUTER_KEY
  if (!orKey) return null
  const referer = process.env.EXPO_PUBLIC_OPENROUTER_REFERER || 'http://localhost'
  const title = process.env.EXPO_PUBLIC_OPENROUTER_TITLE || 'Adulthinks'
  console.log('OpenRouter: using model', model)

  const messages = [
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: `Category: ${category}\nCourse: ${course}\nReturn strictly { "milestones": Milestone[] } as JSON. No commentary.` },
  ]

  const body: any = {
    model,
    messages,
    temperature: 0.2,
    max_tokens: 2048,
    stream: false,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${orKey}`,
        'HTTP-Referer': referer,
        'X-Title': title,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!resp.ok) {
      const text = await resp.text()
      console.error('OpenRouter error:', resp.status, text)
      return null
    }
    const data = await resp.json()
    const choice = data?.choices?.[0]
    const msg = choice?.message ?? choice?.delta

    const funcArgs = msg?.function_call?.arguments || choice?.message?.tool_calls?.[0]?.function?.arguments
    if (typeof funcArgs === 'string' && funcArgs.length) {
      try { return JSON.parse(funcArgs) } catch {}
    }

    let content: any = msg?.content || choice?.text || data?.output || data?.result
    if (!content) return null
    if (typeof content !== 'string') {
      if (typeof content === 'object') return content
      content = String(content)
    }
    try { return JSON.parse(content) } catch {
      const fence = content.match(/```json\s*([\s\S]*?)```/i) || content.match(/```\s*([\s\S]*?)```/i)
      if (fence && fence[1]) { try { return JSON.parse(fence[1]) } catch {} }
      const objMatch = content.match(/\{[\s\S]*\}/)
      if (objMatch) { try { return JSON.parse(objMatch[0]) } catch {} }
      console.error('OpenRouter: Failed to parse JSON')
      return null
    }
  } catch (e: any) {
    clearTimeout(timeout)
    console.error('OpenRouter fetch error:', e?.message || e)
    return null
  }
}

async function enrichMilestone(ms: Milestone, options: { domains: string[], maxResources: number, searchKey?: string }) {
  const exaKey = process.env.EXPO_PUBLIC_EXA_API_KEY
  const courseCandidates: MilestoneResource[] = []
  const articleCandidates: MilestoneResource[] = []
  const combined: MilestoneResource[] = []
  const query = `${ms.title} ${ms.overview || ''}`.trim()

  // Try Exa first for high-quality results
  if (exaKey) {
    try {
      const resp = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': exaKey },
        body: JSON.stringify({
          query,
          text: true,
          numResults: Math.max(2, Math.min(options.maxResources, 6)),
          includeDomains: options.domains,
        }),
      })
      if (resp.ok) {
        const data = await resp.json()
        const results = Array.isArray(data?.results) ? data.results : []
        for (const r of results) {
          if (!r?.url || !r?.title) continue
          const url: string = r.url
          const title: string = r.title
          const desc: string = r.summary || r.text || 'Relevant resource'
          const isCourse = /coursera|edx|freecodecamp\.org\/learn|udacity|udemy/.test(url) || /course|learn|specialization/.test(url)
          const res: MilestoneResource = { type: isCourse ? 'COURSE' : 'ARTICLE', title, description: desc, url }
          if (res.type === 'COURSE') { if (!courseCandidates.some(x => x.url === res.url)) courseCandidates.push(res) }
          else { if (!articleCandidates.some(x => x.url === res.url)) articleCandidates.push(res) }
          if (courseCandidates.length + articleCandidates.length >= options.maxResources) break
        }
      }
    } catch (e) {
      console.warn('Exa search failed, falling back:', e)
    }
  }

  // Fallback to existing SearchAPI domain loop if Exa produced nothing
  if (courseCandidates.length + articleCandidates.length === 0 && options.searchKey) {
    const baseQuery = `${ms.title} ${ms.skills?.[0] || ''}`.trim()
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
  }

  if (courseCandidates.length > 0) combined.push(courseCandidates[0])
  if (articleCandidates.length > 0) combined.push(articleCandidates[0])
  const pool = [...courseCandidates.slice(1), ...articleCandidates.slice(1)]
  for (const p of pool) {
    if (combined.length >= options.maxResources) break
    if (!combined.some(x => x.url === p.url)) combined.push(p)
  }
  ms.resources = combined
}

function localGenerateRoadmap(category: string, course: string): { milestones: Milestone[] } {
  // Local static fallback removed per requirement: API-only generation
  throw new Error('Local fallback disabled: API-only generation')
}

async function directGenerateClient(
  category: string,
  course: string,
  preferences?: { searchApiKey?: string; aimlApiKey?: string; openRouterKey?: string; freeOnly?: boolean; maxResources?: number; allowedDomains?: string[] }
): Promise<Milestone[]> {
  console.log('Client generation: Attempting API providers')

  // Prefer OpenRouter primary model
  let ai = await callOpenRouterDirect(category, course, (preferences as any)?.openRouterKey)
  // Try Qwen model on OpenRouter as third provider if primary fails
  if (!ai) {
    const qwenModel = process.env.EXPO_PUBLIC_OPENROUTER_MODEL_QWEN || 'qwen/qwen3-coder:free'
    ai = await callOpenRouterWithModel(category, course, qwenModel, (preferences as any)?.openRouterKey)
  }
  // Fallback to AIMLAPI
  if (!ai) {
    ai = await callAIMLAPIDirect(category, course, (preferences as any)?.aimlApiKey)
  }
  if (!ai) {
    console.error('Client generation: All providers failed (OpenRouter-Qwen/AIMLAPI)')
    throw new Error('AI generation failed (All providers)')
  }

  const payload = ensureStructure(ai)
  if (!payload) {
    console.error('Client generation: Failed to parse AI response structure')
    throw new Error('AI returned invalid milestone structure')
  }

  console.log('Client generation: Generated', payload.milestones.length, 'milestones')

  const freeOnly = Boolean(preferences?.freeOnly)
  const maxResources = Math.max(2, Math.min(5, Number(preferences?.maxResources) || 3))
  const allowedDomains = Array.isArray(preferences?.allowedDomains)
    ? (preferences!.allowedDomains as string[])
    : (freeOnly
      ? ['freecodecamp.org', 'developer.mozilla.org', 'khanacademy.org', 'docs.python.org']
      : ['coursera.org', 'edx.org', 'freecodecamp.org', 'developer.mozilla.org', 'khanacademy.org', 'docs.python.org'])

  const searchKey = preferences?.searchApiKey || process.env.EXPO_PUBLIC_SEARCHAPI_API_KEY
  if (searchKey) {
    console.log('Client generation: Enriching with SearchAPI')
    for (const ms of payload.milestones) {
      await enrichMilestone(ms as any, { domains: allowedDomains, maxResources, searchKey })
      ;(ms as any).resources = ensureTwoConciseResources((ms as any).resources)
      ;(ms as any).skills = ensureTwoSkills((ms as any).skills, (ms as any).title, course, category)
    }
  } else {
    console.log('Client generation: No SearchAPI key, skipping enrichment')
    for (const ms of payload.milestones) {
      ;(ms as any).resources = ensureTwoConciseResources((ms as any).resources)
      ;(ms as any).skills = ensureTwoSkills((ms as any).skills, (ms as any).title, course, category)
    }
  }

  return payload.milestones
}

// Helper functions restored (used by resource and skills post-processing)
function trimText(str: string, max: number): string {
if (!str) return ''
const s = String(str).trim()
return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + '…'
}

function ensureTwoConciseResources(resources: any[] | undefined): any[] {
const COURSE_FALLBACK = {
type: 'COURSE',
title: 'Foundational Free Course',
description: 'Introductory course covering core concepts.',
url: 'https://www.freecodecamp.org/learn',
}
const ARTICLE_FALLBACK = {
type: 'ARTICLE',
title: 'Getting Started Guide',
description: 'Concise guide to fundamentals and best practices.',
url: 'https://developer.mozilla.org/en-US/docs/Learn',
}

const list = Array.isArray(resources) ? resources.filter(Boolean) : []
const courses = list.filter(r => r?.type === 'COURSE')
const articles = list.filter(r => r?.type === 'ARTICLE')

const course = (courses[0] || COURSE_FALLBACK)
const article = (articles[0] || ARTICLE_FALLBACK)

const courseClean = {
type: 'COURSE',
title: trimText(course.title || 'Course', 60),
description: trimText(course.description || 'Structured learning path.', 140),
url: String(course.url || COURSE_FALLBACK.url),
}
const articleClean = {
type: 'ARTICLE',
title: trimText(article.title || 'Article', 60),
description: trimText(article.description || 'Short, practical reading.', 140),
url: String(article.url || ARTICLE_FALLBACK.url),
}

return [courseClean, articleClean]
}

function pickSkillsForTitle(title: string, course: string, category: string): string[] {
const t = (title || '').toLowerCase()
if (t.includes('foundation') || t.includes('orientation')) {
return [`Basics of ${course}`, 'Study habits']
}
if (t.includes('core')) {
return [`Core ${course} concepts`, 'Problem solving']
}
if (t.includes('applied project')) {
return ['Project planning', 'Implementation']
}
if (t.includes('advanced')) {
return [`Advanced ${course} topics`, 'Optimization']
}
if (t.includes('portfolio') || t.includes('career')) {
return ['Portfolio building', 'Career readiness']
}
return [`Key ${course} skills`, 'Practical application']
}

function ensureTwoSkills(skills: any, title: string, course: string, category: string): string[] {
const MAX_LEN = 40
const list = Array.isArray(skills)
? skills.filter(s => typeof s === 'string' && s.trim().length > 0).map(s => trimText(s, MAX_LEN))
: []
if (list.length >= 2) return list.slice(0, 2)
const defaults = pickSkillsForTitle(title, course, category).map(s => trimText(s, MAX_LEN))
const merged = [...list, ...defaults].filter(Boolean)
const unique: string[] = []
for (const s of merged) { if (!unique.includes(s)) unique.push(s) }
return unique.slice(0, 2)
}
