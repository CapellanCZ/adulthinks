import { Milestone } from '../types'

/**
 * Gemini API-based AI service for roadmap generation
 * - Uses schema-constrained JSON via generationConfig.responseMimeType = "application/json"
 * - Preserves web search enrichment and post-processing
 */

// ===== Configuration & Types =====

interface GeminiConfig {
  apiKey: string
  model: string
}

interface WebSearchConfig {
  searchApiKey?: string
  exaApiKey?: string
  enabled: boolean
}

interface SearchResult {
  title: string
  url: string
  snippet?: string
}

// ===== Main Export Function =====

/**
 * Generate a learning roadmap using Gemini with schema-constrained JSON output
 * @param category - Learning category (e.g., "Technology", "Business")
 * @param course - Specific course topic (e.g., "React Development", "Digital Marketing")
 * @param preferences - Optional user preferences
 * @returns Promise<Milestone[]> - Array of structured learning milestones
 */
export async function generateRoadmap(
  category: string,
  course: string,
  preferences?: { geminiKey?: string; openRouterKey?: string }
): Promise<Milestone[]> {
  console.log('🚀 Roadmap generation started (Gemini):', { category, course })
  
  try {
    // Support either preferences.geminiKey or legacy preferences.openRouterKey
    const preferenceKey = preferences?.geminiKey || preferences?.openRouterKey
    const config = getGeminiConfig(preferenceKey)
    const webSearchConfig = getWebSearchConfig()
    
    // Generate with preset configuration
    const milestones = await generateWithModel(
      category, 
      course, 
      config,
      webSearchConfig
    )
    
    if (milestones && milestones.length > 0) {
      console.log('✅ Gemini generation successful:', milestones.length, 'milestones')
      return milestones
    }
    
    throw new Error('Gemini generation failed to produce milestones')
    
  } catch (error) {
    console.error('❌ Roadmap generation failed:', error)
    throw new Error(`Roadmap generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// ===== Configuration Functions =====

function getGeminiConfig(preferenceKey?: string): GeminiConfig {
  const apiKey = preferenceKey || 
    process.env.EXPO_PUBLIC_GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set EXPO_PUBLIC_GEMINI_API_KEY and restart the app.')
  }
  
  return {
    apiKey,
    model: process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash'
  }
}

function getWebSearchConfig(): WebSearchConfig {
  return {
    searchApiKey: process.env.EXPO_PUBLIC_SEARCHAPI_API_KEY,
    exaApiKey: process.env.EXPO_PUBLIC_EXA_API_KEY,
    enabled: process.env.EXPO_PUBLIC_ENABLE_WEB_SEARCH === 'true'
  }
}

// ===== Core Generation Logic =====

async function generateWithModel(
  category: string,
  course: string,
  config: GeminiConfig,
  webSearchConfig: WebSearchConfig
): Promise<Milestone[] | null> {
  try {
    console.log(`🎯 Generating with Gemini model: ${config.model}`)
    
    const response = await callGeminiGenerateContent(
      category,
      course,
      config
    )
    
    if (!response) {
      console.warn(`❌ No response from Gemini with model: ${config.model}`)
      return null
    }
    
    const payload = ensureStructure(response)
    if (!payload) {
      console.warn(`❌ Invalid response structure from model: ${config.model}`)
      return null
    }
    
    // Enhance with web search if enabled
    if (webSearchConfig.enabled && (webSearchConfig.searchApiKey || webSearchConfig.exaApiKey)) {
      await enhanceWithWebSearch(payload.milestones, webSearchConfig, course)
    }
    
    // Post-process for consistency
    return postProcessMilestones(payload.milestones, course, category)
    
  } catch (error) {
    console.error(`❌ Error with Gemini model ${config.model}:`, error)
    return null
  }
}

async function callGeminiGenerateContent(
  category: string,
  course: string,
  config: GeminiConfig
): Promise<any | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000) // 120s timeout
  
  const schema = {
    type: 'object',
    properties: {
      milestones: {
        type: 'array',
        minItems: 4,
        maxItems: 6,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            overview: { type: 'string' },
            skills: {
              type: 'array',
              items: { type: 'string' },
              minItems: 2,
              maxItems: 4
            },
            timeframe: { type: 'string' },
            resources: {
              type: 'array',
              minItems: 2,
              maxItems: 2,
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['COURSE', 'ARTICLE'] },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  url: { type: 'string' }
                },
                required: ['type', 'title', 'description', 'url'],
              }
            },
            tasks: {
              type: 'array',
              minItems: 3,
              maxItems: 3,
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  duration: { type: 'string' },
                  completed: { type: 'boolean' }
                },
                required: ['id', 'title', 'description', 'duration', 'completed'],
              }
            }
          },
          required: ['id', 'title', 'overview', 'skills', 'timeframe', 'resources', 'tasks'],
        }
      }
    },
    required: ['milestones'],
  }

  const prompt = [
    'You are an expert curriculum designer.',
    'Return ONLY valid JSON. No markdown or code blocks.',
    'Keep fields concise. Titles <= 60 chars; overview 1 sentence; resource descriptions <= 140 chars; task descriptions <= 100 chars.',
    `Generate exactly 4 milestones for "${course}" in "${category}".`,
    'Each milestone: 3 tasks (completed=false, duration like "1 hour"); 2 resources (1 COURSE, 1 ARTICLE) with live URLs.'
  ].join(' ')

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': config.apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1200,
          responseMimeType: 'application/json',
          responseSchema: schema
        }
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini HTTP error (${response.status}):`, errorText)

      // Fallback: retry once without schema but still JSON response
      try {
        const fbRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': config.apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `Generate a learning roadmap for "${course}" in the "${category}" category. Return only valid JSON with exactly 6 milestones, each with 3 tasks and 2 resources (1 COURSE, 1 ARTICLE).` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1200,
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal,
        })

        if (fbRes.ok) {
          const fbData = await fbRes.json()
          const fbText = fbData?.candidates?.[0]?.content?.parts?.[0]?.text
          if (!fbText) {
            console.error('No content in Gemini fallback response:', fbData)
            return null
          }
          return parseJsonResponse(fbText)
        } else {
          const fbErr = await fbRes.text()
          console.error('Gemini fallback error:', fbErr)
        }
      } catch (e) {
        console.error('Gemini fallback request failed:', e)
      }

      return null
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('No content in Gemini response:', data)
      return null
    }

    return parseJsonResponse(text)

  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Gemini request timed out')
    } else {
      console.error('Gemini request failed:', error)
    }
    return null
  }
}

// ===== Response Processing =====

function parseJsonResponse(content: any): any | null {
  if (content && typeof content === 'object') {
    return content
  }
  const str = String(content || '')
  try {
    return JSON.parse(str)
  } catch {}

  // Try to extract JSON from markdown code blocks
  const jsonMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch {}
  }
  
  // Try to find JSON object in text
  const objectMatch = str.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0])
    } catch {}
  }

  // Attempt repair on truncated/malformed JSON
  const repaired = tryRepairJson(str)
  if (repaired) return repaired
  
  console.error('Failed to parse JSON from content:', str.slice(0, 200))
  return null
}

function tryRepairJson(input: string): any | null {
  try {
    let s = input.trim()
    // Remove code fences if present
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()

    // Remove any leading/trailing noise outside the first {...}
    const start = s.indexOf('{')
    const end = s.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      s = s.slice(start, end + 1)
    }

    // Unescape bracket artifacts like \[ and \]
    s = s.replace(/\\([\[\]])/g, '$1')

    // Remove trailing commas before } or ]
    s = s.replace(/,\s*(\}|\])/g, '$1')

    // Balance braces/brackets
    const stack: string[] = []
    for (const ch of s) {
      if (ch === '{' || ch === '[') stack.push(ch)
      else if (ch === '}' || ch === ']') stack.pop()
    }
    while (stack.length) {
      const open = stack.pop()
      s += open === '{' ? '}' : ']'
    }

    return JSON.parse(s)
  } catch {
    return null
  }
}

function ensureStructure(raw: any): { milestones: Milestone[] } | null {
  const arr = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.milestones) ? raw.milestones : null)
  if (!arr) {
    console.error('Invalid response structure:', raw)
    return null
  }

  const milestones: Milestone[] = arr.map((m: any, i: number) => {
    const title = String(m?.title || m?.milestone || `Milestone ${i + 1}`)

    const tasksRaw = Array.isArray(m?.tasks) ? m.tasks : []
    const resourcesRaw = Array.isArray(m?.resources) ? m.resources : []
    const skillsRaw = Array.isArray(m?.skills) ? m.skills : []

    const tasks = tasksRaw.map((t: any, j: number) => {
      if (typeof t === 'string') {
        const tTitle = trimText(t, 60)
        return {
          id: `task-${i + 1}-${j + 1}`,
          title: tTitle || `Task ${j + 1}`,
          description: tTitle,
          duration: '1 hour',
          completed: false,
        }
      }
      return {
        id: t?.id || `task-${i + 1}-${j + 1}`,
        title: String(t?.title || 'Task'),
        description: String(t?.description || ''),
        duration: String(t?.duration || '1 hour'),
        completed: Boolean(t?.completed ?? false),
      }
    })

    const resources = resourcesRaw.map((r: any) => {
      if (typeof r === 'string') {
        return {
          type: 'ARTICLE' as const,
          title: trimText(r, 60),
          description: '',
          url: '',
        }
      }
      return {
        type: r?.type === 'ARTICLE' ? 'ARTICLE' : 'COURSE',
        title: String(r?.title || 'Resource'),
        description: String(r?.description || ''),
        url: String(r?.url || ''),
      }
    })

    return {
      id: m?.id || `milestone-${i + 1}`,
      title,
      overview: String(m?.overview || m?.description || ''),
      skills: skillsRaw.map((s: any) => String(s)).slice(0, 4),
      timeframe: String(m?.timeframe || m?.duration || `Month ${i + 1}`),
      resources,
      tasks,
    }
  })

  return { milestones }
}

// ===== Web Search Enhancement =====

async function enhanceWithWebSearch(
  milestones: Milestone[],
  config: WebSearchConfig,
  course: string
): Promise<void> {
  if (!config.enabled) return
  
  console.log('🔍 Enhancing roadmap with web search...')
  
  for (const milestone of milestones) {
    try {
      const searchQuery = `${milestone.title} ${course} tutorial guide`
      const results = await performWebSearch(searchQuery, config)
      
      if (results.length > 0) {
        // Add high-quality search results as resources
        const enhancedResources = results.slice(0, 2).map(result => ({
          type: 'ARTICLE' as const,
          title: result.title,
          description: result.snippet || 'Relevant learning resource',
          url: result.url
        }))
        
        milestone.resources = [...milestone.resources, ...enhancedResources]
      }
    } catch (error) {
      console.warn(`Web search failed for milestone: ${milestone.title}`, error)
    }
  }
}

async function performWebSearch(query: string, config: WebSearchConfig): Promise<SearchResult[]> {
  // Try SearchAPI first
  if (config.searchApiKey) {
    try {
      const results = await searchWithSearchAPI(query, config.searchApiKey)
      if (results.length > 0) return results
    } catch (error) {
      console.warn('SearchAPI failed, trying Exa...', error)
    }
  }
  
  // Fallback to Exa
  if (config.exaApiKey) {
    try {
      return await searchWithExa(query, config.exaApiKey)
    } catch (error) {
      console.warn('Exa search failed:', error)
    }
  }
  
  return []
}

async function searchWithSearchAPI(query: string, apiKey: string): Promise<SearchResult[]> {
  const response = await fetch(
    `https://www.searchapi.io/api/v1/search?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=5`
  )
  
  if (!response.ok) {
    throw new Error(`SearchAPI error: ${response.status}`)
  }
  
  const data = await response.json()
  return (data.organic_results || []).map((result: any) => ({
    title: result.title,
    url: result.link,
    snippet: result.snippet
  }))
}

async function searchWithExa(query: string, apiKey: string): Promise<SearchResult[]> {
  const response = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query,
      numResults: 5,
      includeDomains: ['freecodecamp.org', 'developer.mozilla.org', 'coursera.org', 'edx.org']
    })
  })
  
  if (!response.ok) {
    throw new Error(`Exa API error: ${response.status}`)
  }
  
  const data = await response.json()
  return (data.results || []).map((result: any) => ({
    title: result.title,
    url: result.url,
    snippet: result.text?.slice(0, 200)
  }))
}

// ===== Post-Processing =====

function postProcessMilestones(milestones: Milestone[], course: string, category: string): Milestone[] {
  return milestones.map(milestone => ({
    ...milestone,
    skills: ensureTwoSkills(milestone.skills, milestone.title, course, category),
    resources: ensureQualityResources(milestone.resources)
  }))
}

function ensureTwoSkills(skills: string[], title: string, course: string, category: string): string[] {
  const MAX_LEN = 40
  const validSkills = skills.filter(s => s && s.trim().length > 0).map(s => trimText(s, MAX_LEN))
  
  if (validSkills.length >= 2) return validSkills.slice(0, 2)
  
  // Generate contextual skills based on milestone title
  const defaultSkills = generateContextualSkills(title, course, category)
  const combined = [...validSkills, ...defaultSkills]
  const unique = Array.from(new Set(combined))
  
  return unique.slice(0, 2)
}

function generateContextualSkills(title: string, course: string, category: string): string[] {
  const t = title.toLowerCase()
  
  if (t.includes('foundation') || t.includes('basic')) {
    return [`${course} fundamentals`, 'Learning methodology']
  }
  if (t.includes('advanced') || t.includes('expert')) {
    return [`Advanced ${course}`, 'Problem solving']
  }
  if (t.includes('project') || t.includes('practice')) {
    return ['Project development', 'Implementation skills']
  }
  if (t.includes('portfolio') || t.includes('career')) {
    return ['Portfolio building', 'Professional skills']
  }
  
  return [`${course} skills`, 'Practical application']
}

function ensureQualityResources(resources: any[]): any[] {
  const FALLBACKS = {
    COURSE: {
      type: 'COURSE',
      title: 'Comprehensive Learning Course',
      description: 'Structured course covering essential concepts and practical applications.',
      url: 'https://www.freecodecamp.org/learn'
    },
    ARTICLE: {
      type: 'ARTICLE',
      title: 'Essential Reading Guide',
      description: 'Comprehensive guide covering key concepts and best practices.',
      url: 'https://developer.mozilla.org/en-US/docs/Learn'
    }
  }
  
  const validResources = resources.filter(r => r && r.url && !r.url.includes('example.com'))
  const courses = validResources.filter(r => r.type === 'COURSE')
  const articles = validResources.filter(r => r.type === 'ARTICLE')
  
  const result = [] as any[]
  
  // Ensure at least one course
  if (courses.length > 0) {
    result.push(cleanResource(courses[0]))
  } else {
    result.push(FALLBACKS.COURSE)
  }
  
  // Ensure at least one article
  if (articles.length > 0) {
    result.push(cleanResource(articles[0]))
  } else {
    result.push(FALLBACKS.ARTICLE)
  }
  
  return result
}

function cleanResource(resource: any): any {
  return {
    type: resource.type,
    title: trimText(resource.title || 'Learning Resource', 60),
    description: trimText(resource.description || 'Educational content for skill development.', 140),
    url: resource.url
  }
}

function trimText(str: string, max: number): string {
  if (!str) return ''
  const s = String(str).trim()
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + '…'
}
