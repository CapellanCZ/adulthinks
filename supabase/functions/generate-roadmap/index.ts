// supabase/functions/generate-roadmap/index.ts
// Deno Edge Function to generate a roadmap using AI providers (OpenAI, Gemini fallback)
// Expects JSON body: { category: string, course: string, preferences?: Record<string, any> }

async function callGemini(category: string, course: string, preferences: Record<string, unknown> | undefined) {
  const prefKey = preferences && typeof (preferences as any).geminiApiKey === 'string' ? ((preferences as any).geminiApiKey as string) : null
  const apiKey = Deno.env.get('GEMINI_API_KEY') || prefKey
  if (!apiKey) return null

  const model = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash-latest'
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `System Instruction:\n${systemPrompt()}\n\nCategory: ${category}\nCourse: ${course}\nPreferences: ${JSON.stringify(preferences || {})}`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
  }

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!resp.ok) {
    return null
  }

  const data = await resp.json()
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]?.string ??
    ''
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    const match = typeof text === 'string' ? text.match(/\{[\s\S]*\}/) : null
    if (match) {
      try { return JSON.parse(match[0]) } catch {}
    }
    return null
  }
}
// Returns: { milestones: Milestone[] }

// Declare Deno for TypeScript tooling in non-Deno editors
declare const Deno: any

interface MilestoneTask {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
}

interface MilestoneResource {
  type: 'COURSE' | 'ARTICLE'
  title: string
  description: string
  url: string
}

interface Milestone {
  id: string
  title: string
  overview: string
  skills: string[]
  timeframe: string
  resources: MilestoneResource[]
  tasks: MilestoneTask[]
}

// SearchAPI integration
type SearchApiResult = {
  title?: string
  link?: string
  url?: string
  snippet?: string
}

function getSearchApiKey(preferences?: Record<string, unknown>): string | null {
  const fromSecret = (globalThis as any).Deno?.env?.get?.('SEARCHAPI_API_KEY')
  const fromBody = typeof preferences?.searchApiKey === 'string' ? String(preferences?.searchApiKey) : null
  return fromSecret || fromBody || null
}

async function searchDomain(apiKey: string, query: string, site: string): Promise<SearchApiResult[]> {
  const url = `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query + ' site:' + site)}&api_key=${apiKey}`
  const resp = await fetch(url)
  if (!resp.ok) return []
  const data = await resp.json()
  const results: SearchApiResult[] = []
  const organic = Array.isArray(data?.organic_results) ? data.organic_results : []
  for (const r of organic) {
    results.push({ title: r.title, link: r.link, url: r.link, snippet: r.snippet })
  }
  return results
}

async function enrichMilestoneWithSearch(apiKey: string, ms: Milestone, options: { domains: string[], maxResources: number }) {
  const baseQuery = `${ms.title} ${ms.skills?.[0] || ''}`.trim()
  const courseCandidates: MilestoneResource[] = []
  const articleCandidates: MilestoneResource[] = []
  for (const site of options.domains) {
    if (courseCandidates.length + articleCandidates.length >= options.maxResources) break
    try {
      const results = await searchDomain(apiKey, baseQuery, site)
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
      // ignore domain errors
    }
  }

  // Combine ensuring at least one COURSE and one ARTICLE
  const combined: MilestoneResource[] = []
  if (courseCandidates.length > 0) combined.push(courseCandidates[0])
  if (articleCandidates.length > 0) combined.push(articleCandidates[0])
  // fill remaining slots from whichever has more
  const pool = [...courseCandidates.slice(1), ...articleCandidates.slice(1)]
  for (const p of pool) {
    if (combined.length >= options.maxResources) break
    if (!combined.some(x => x.url === p.url)) combined.push(p)
  }

  // If AI already provided resources, merge to fill up to maxResources
  const aiResources = Array.isArray(ms.resources) ? ms.resources : []
  for (const ar of aiResources) {
    if (combined.length >= options.maxResources) break
    if (ar?.url && !ar.url.includes('example.com') && !combined.some(x => x.url === ar.url)) {
      combined.push(ar)
    }
  }

  ms.resources = combined
}

function systemPrompt() {
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

async function callOpenAI(category: string, course: string, preferences: Record<string, unknown> | undefined) {
  const prefKey = preferences && typeof (preferences as any).openaiApiKey === 'string' ? (preferences as any).openaiApiKey as string : null
  const apiKey = Deno.env.get('OPENAI_API_KEY') || prefKey
  if (!apiKey) {
    return null
  }

  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini'
  const messages = [
    { role: 'system', content: systemPrompt() },
    { role: 'user', content: `Category: ${category}\nCourse: ${course}\nPreferences: ${JSON.stringify(preferences || {})}` },
  ]

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
    }),
  })

  if (!resp.ok) {
    return null
  }

  const data = await resp.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) return null

  try {
    const parsed = JSON.parse(content)
    return parsed
  } catch {
    // Try to extract JSON if surrounded by text
    const match = content.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch {}
    }
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

// removed placeholder patching in favor of SearchAPI enrichment

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } })
    }

    const { category, course, preferences } = await req.json()
    if (!category || !course) {
      return new Response(JSON.stringify({ error: 'Missing category or course' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Try OpenAI first, then Gemini fallback
    const aiOpenAI = await callOpenAI(category, course, preferences)
    let payload: { milestones: Milestone[] } | null = aiOpenAI ? ensureStructure(aiOpenAI) : null
    if (!payload) {
      const aiGemini = await callGemini(category, course, preferences)
      if (aiGemini) payload = ensureStructure(aiGemini)
    }
    if (!payload) {
      return new Response(JSON.stringify({ error: 'AI generation failed' }), { status: 502, headers: { 'Content-Type': 'application/json' } })
    }

    // Enrich with SearchAPI dynamic links if available
    const prefs = typeof preferences === 'object' && preferences ? preferences as Record<string, unknown> : undefined
    const apiKey = getSearchApiKey(prefs)
    const freeOnly = Boolean(prefs?.freeOnly)
    const maxResources = Math.max(2, Math.min(5, Number(prefs?.maxResources) || 3))
    const allowedDomains = Array.isArray(prefs?.allowedDomains)
      ? (prefs!.allowedDomains as string[])
      : (freeOnly
          ? ['freecodecamp.org', 'developer.mozilla.org', 'khanacademy.org', 'docs.python.org']
          : ['coursera.org', 'edx.org', 'freecodecamp.org', 'developer.mozilla.org', 'khanacademy.org', 'docs.python.org'])

    if (apiKey) {
      for (const ms of payload.milestones) {
        await enrichMilestoneWithSearch(apiKey, ms, { domains: allowedDomains, maxResources })
      }
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (e) {
    console.error('generate-roadmap error:', e)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
