# OpenRouter Migration Guide
## Complete Migration to OpenRouter-Only Architecture

This guide documents the migration from a multi-provider AI service (OpenRouter + AIMLAPI) to an OpenRouter-exclusive architecture using a single preset configuration.

## 🎯 Migration Overview

### What Changed
- **Removed**: AIMLAPI integration and Supabase Edge Function fallback
- **Removed**: Complex fallback preset logic
- **Added**: Single OpenRouter preset-based configuration system
- **Enhanced**: Web search integration using existing SearchAPI/Exa keys
- **Improved**: Clean architecture with proper separation of concerns

### Benefits
- **Simplified Architecture**: Single AI provider with single preset reduces complexity
- **Preset Management**: Centralized configuration via OpenRouter dashboard
- **Better Reliability**: Consistent output through preset configuration
- **Enhanced Resources**: Integrated web search for dynamic resource discovery

## 🔧 Step 1: OpenRouter Preset Configuration

### Creating the Preset

1. **Navigate to OpenRouter Presets**
   - Visit: https://openrouter.ai/settings/presets/new
   - Login to your OpenRouter account

2. **Create Preset: `adulthinks-roadmap-detailed`**
   ```json
   {
     "name": "adulthinks-roadmap-detailed",
     "description": "Detailed roadmap generation for AdultThinks learning platform",
     "model": "meta-llama/llama-3.2-3b-instruct",
     "temperature": 0.3,
     "max_tokens": 2000,
     "system_prompt": "You are an expert curriculum designer. Generate a practical, step-by-step learning roadmap. Return strictly valid JSON following this TypeScript type. Do not include any extra commentary.\n\ninterface MilestoneTask { id: string; title: string; description: string; duration: string; completed: boolean; }\ninterface MilestoneResource { type: 'COURSE' | 'ARTICLE'; title: string; description: string; url: string; }\ninterface Milestone { id: string; title: string; overview: string; skills: string[]; timeframe: string; resources: MilestoneResource[]; tasks: MilestoneTask[]; }\n\nRules:\n- Produce exactly 6 milestones.\n- Each milestone must have 3 tasks, with completed=false and duration like '1 hour'.\n- Each milestone must have at least 2 resources: one COURSE and one ARTICLE, with live URLs.\n- Resource descriptions should be a short paragraph.\n- Use only reputable sources (Coursera, freeCodeCamp, edX, Khan Academy, MDN, official docs, university pages).\n- Keep titles concise and actionable.\n- Overview should be 1-2 sentences.\n- skills array should have 2 short items.\n- timeframe in the form 'Month N' or 'Month N-M'.\n- Output JSON: { \"milestones\": Milestone[] }.",
     "response_format": {
       "type": "json_object"
     }
   }
   ```

### Preset Configuration Tips
- **Model Selection**: Uses `meta-llama/llama-3.2-3b-instruct` for reliable structured outputs
- **Temperature**: Set to 0.3 for consistent but creative results
- **Max Tokens**: 2000 tokens for comprehensive roadmaps
- **System Prompts**: Include complete TypeScript interfaces for validation

## 🔧 Step 2: Environment Configuration

### Updated .env File
```env
# Supabase Configuration (unchanged)
EXPO_PUBLIC_SUPABASE_URL="https://xnpakrkzrcqydjykdgkx.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Google Maps API Configuration (unchanged)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY='AIzaSyDPHV_zP__yVRaCczqlbWHyQJuElByBBJw'

# OpenRouter Configuration (Primary AI Provider)
EXPO_PUBLIC_OPENROUTER_API_KEY='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'
EXPO_PUBLIC_OPENROUTER_REFERER='https://adulthinks.app'
EXPO_PUBLIC_OPENROUTER_TITLE='AdultThinks Learning Platform'

# OpenRouter Preset for Roadmap Generation
EXPO_PUBLIC_OPENROUTER_PRESET='adulthinks-roadmap-detailed'

# Web Search Integration (for resource enrichment)
EXPO_PUBLIC_SEARCHAPI_API_KEY='n7SJnS29A8ygRUi3NSTn3iF4'
EXPO_PUBLIC_EXA_API_KEY='2f9a886d-47e6-4a99-b611-664cfc7ce7ca'

# Enable web search for enhanced roadmap resources
EXPO_PUBLIC_ENABLE_WEB_SEARCH='true'
```

### Key Changes
- **Removed**: All AIMLAPI-related variables
- **Simplified**: Single preset configuration instead of primary/fallback
- **Added**: OpenRouter-specific configuration
- **Enhanced**: Web search toggle

## 🔧 Step 3: Architecture Changes

### New AI Service Structure
```typescript
// Simplified configuration
interface OpenRouterConfig {
  apiKey: string
  referer: string
  title: string
  preset: string
}

interface WebSearchConfig {
  searchApiKey?: string
  exaApiKey?: string
  enabled: boolean
}

// Simplified generation flow
export async function generateRoadmap(
  category: string,
  course: string,
  preferences?: { openRouterKey?: string }
): Promise<Milestone[]>
```

### Key Architectural Improvements
1. **Single Responsibility**: Each function has a clear, focused purpose
2. **Configuration Management**: Centralized config resolution
3. **Simplified Error Handling**: No complex fallback logic
4. **Web Search Integration**: Optional enhancement without breaking core functionality
5. **Type Safety**: Comprehensive TypeScript interfaces

### OpenRouter API Integration
The service now uses the correct OpenRouter preset API format:
```typescript
const payload = {
  preset: "@preset/adulthinks-roadmap-detailed",
  model: "meta-llama/llama-3.2-3b-instruct",
  messages: [
    {
      role: "user",
      content: "Generate a comprehensive learning roadmap..."
    }
  ]
}
```

## 🔧 Step 4: Web Search Integration

### SearchAPI Integration
- **Primary**: Uses existing SearchAPI key for Google search results
- **Fallback**: Exa API for semantic search when SearchAPI fails
- **Enhancement**: Adds 2 high-quality resources per milestone
- **Cost Control**: Configurable via `EXPO_PUBLIC_ENABLE_WEB_SEARCH`

### Search Flow
1. Generate base roadmap via OpenRouter preset
2. For each milestone, search for relevant resources
3. Filter and add high-quality results
4. Maintain resource type balance (COURSE/ARTICLE)

## 🔧 Step 5: Removed Components

### Deleted Files
- `supabase/functions/generate-roadmap/index.ts` - AIMLAPI Edge Function

### Removed Dependencies
- Supabase Edge Function invocation
- AIMLAPI client configuration
- Complex fallback preset logic
- Multiple retry mechanisms

## 🧪 Testing & Validation

### Test Scenarios
1. **Preset Generation**: Standard roadmap generation with single preset
2. **Web Search Enhancement**: Resource enrichment functionality
3. **Error Handling**: Graceful failures with meaningful messages
4. **Configuration Validation**: Missing API keys and preset names

### Validation Checklist
- [ ] OpenRouter preset `adulthinks-roadmap-detailed` created and configured
- [ ] Environment variables updated to single preset
- [ ] AI service generates valid roadmaps
- [ ] Web search enhances resources (when enabled)
- [ ] Error messages are clear and actionable
- [ ] No references to removed fallback logic

## 🚀 Deployment Considerations

### Environment Setup
1. Update production environment variables
2. Verify OpenRouter API key permissions
3. Test preset accessibility from application
4. Validate web search API quotas

### Monitoring
- Track OpenRouter API usage and costs
- Monitor preset performance and success rates
- Watch for web search API rate limits
- Log generation failures for debugging

## 📊 Performance Improvements

### Before Migration
- Multiple API providers with complex fallback logic
- Primary/fallback preset complexity
- Inconsistent output formats
- Higher latency due to retry mechanisms

### After Migration
- Single, reliable API provider
- Single preset configuration
- Consistent output via preset
- Reduced latency with optimized requests
- Enhanced resources via web search

## 🔄 Rollback Plan

If issues arise, rollback steps:
1. Restore previous .env configuration
2. Revert aiService.ts to previous version
3. Restore Supabase Edge Function
4. Update environment variables to previous state

## 📝 Maintenance

### Regular Tasks
- Monitor OpenRouter preset performance
- Update preset configuration as needed
- Review web search result quality
- Optimize API usage and costs

### Preset Updates
- Access preset via: https://openrouter.ai/settings/presets/3ecb9957-1354-45b9-b525-57a0dcf112f9
- Version control preset changes
- Test preset modifications in development
- Deploy preset updates without code changes

---

## 🎉 Migration Complete

The migration to OpenRouter-exclusive architecture with single preset provides:
- **Simplified codebase** with single AI provider and preset
- **Consistent output** via preset configuration
- **Enhanced resources** through web search integration
- **Better maintainability** with clean separation of concerns
- **Improved reliability** with focused error handling
- **Reduced complexity** by removing fallback logic

The system now leverages OpenRouter's preset system for configuration management while maintaining all existing roadmap generation capabilities with enhanced resource discovery.