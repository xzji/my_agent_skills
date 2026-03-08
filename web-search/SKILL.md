---
name: web-search
description: Universal web search capability using SearXNG and Tavily. Use when user asks to search the web, find current information, research online topics, or look up recent news.
---

# Web Search

Universal web search capability with support for multiple search engines. This skill provides online information retrieval functionality that can be integrated into any AI agent.

## Core Functionality

Search the web and retrieve relevant information including:
- Current news and events
- Technical documentation
- Product information and reviews
- Factual information
- Research topics
- Online resources

## Search Engines Supported

| Engine | Type | Configuration Required | Priority |
|--------|--------|----------------------|----------|
| **SearXNG** | Meta search engine | No | 1 (Default) |
| **Tavily** | AI-powered search | API Key | 2 |

## Usage

### Basic Search

```
Search for [query]
Search for web for [topic]
Find information about [subject]
Look up [term] online
```

### With Parameters

```
Search for [query], return [N] results
Use [engine] to search for [topic]
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|--------|---------|-------------|
| `query` | string | required | The search query or question |
| `maxResults` | number | 5 | Number of results to return (1-10) |
| `engine` | string | auto | Search engine: `auto`/`searxng`/`tavily` |

## Output Format

```
Search results for "[query]" ([engine]):

1. [Title]
   URL: [URL]
   [Content snippet...]

2. [Title]
   URL: [URL]
   [Content snippet]...
```

## Configuration

### SearXNG (Recommended - Works Out of Box)

**Default Instance**: `https://sousuo.emoe.top/search`

**Features**:
- No API key required
- No rate limits
- Privacy-respecting
- Aggregates multiple search engines

**Custom Instance**:
Set custom SearXNG instance URL:
```
SEARXNG_URL=https://your-instance.com/search
```

### Tavily (AI-Powered Search)

**Overview**: Advanced AI search engine with enhanced understanding and relevance.

**Features**:
- AI-powered results
- Excellent relevance ranking
- Supports natural language queries
- Fast response times

**Setup**:

1. Get API Key: https://tavily.com/
2. Sign up for free tier (1000 searches/month)
3. Set credentials:
```
TAVILY_API_KEY=your_api_key
```

**API Usage**:
```http
POST https://api.tavily.com/search
Headers:
  Authorization: Bearer {api_key}
Body (JSON):
{
  "api_key": "{api_key}",
  "query": "{query}",
  "max_results": {maxResults},
  "search_depth": "basic"
}
```

**Free Tier**: 1,000 searches/month

## Engine Selection

When `engine=auto` (default), tries in order:

1. **SearXNG** - Default, always attempted
2. **Tavily** - If API key configured

You can force a specific engine:
```
Use SearXNG to search for [topic]
Use Tavily to search for [topic]
```

## Examples

### Technology & Development

```
Search for latest Node.js version
Find React 18 documentation
Look up Python 3.13 new features
Search for Docker vs Kubernetes comparison
```

### News & Current Events

```
What's happening in the Middle East?
Search for latest tech news 2026
Find information about recent earthquake
```

### Product Research

```
Search for best laptops for coding 2026
Find reviews of Samsung Galaxy S26
Look up prices for RTX 5090
```

### General Knowledge

```
What is quantum computing?
Find information about renewable energy
Search for history of artificial intelligence
```

## Integration Guide

This skill can be integrated into AI agents in multiple ways:

### Option 1: Ready-to-Use TypeScript Implementation

A complete TypeScript implementation is provided in `websearch.ts`. Copy it to your project and use directly:

```typescript
import { WebSearchClient } from './websearch';

const client = new WebSearchClient({
  tavilyApiKey: process.env.TAVILY_API_KEY
});

const results = await client.search({
  query: 'latest Node.js version',
  maxResults: 5,
  engine: 'auto'
});

console.log(client.formatResults(results, 'auto'));
```

See README.md for detailed TypeScript API documentation.

### Option 2: Function Call Implementation

Implement as a function/tool with these parameters:
- `query`: string
- `maxResults`: number (optional, default 5)
- `engine`: string (optional, default "auto")

### Option 3: Plugin/Extension

Implement as a plugin that:
- Makes HTTP requests to search engine APIs
- Parses JSON responses
- Formats results for user consumption

### Option 4: Standalone Service

Deploy as a microservice:
- REST API endpoint
- Accepts search queries
- Returns formatted results

## API Endpoints

### SearXNG API

**Request**:
```
GET https://sousuo.emoe.top/search?q={query}&format=json&language=auto&categories=general
```

**Response** (JSON):
```json
{
  "query": "search term",
  "number_of_results": 100,
  "results": [
    {
      "title": "Result Title",
      "url": "https://example.com",
      "content": "Content snippet..."
    }
  ]
}
```

### Tavily API

**Request**:
```
POST https://api.tavily.com/search
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "api_key": "{api_key}",
  "query": "{query}",
  "max_results": {maxResults},
  "search_depth": "basic"
}
```

**Response** (JSON):
```json
{
  "query": "search query",
  "answer": "Direct answer if available",
  "results": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "content": "Content snippet...",
      "score": 0.95
    }
  ]
}
```

## Best Practices

### For Agent Implementers

1. **Default to SearXNG** - No configuration required
2. **Use Tavily for complex queries** - AI-enhanced understanding
3. **Cache results** - Reduce redundant API calls
4. **Handle errors gracefully** - Try fallback engines
5. **Rate limiting** - Respect API quotas
6. **Sanitize queries** - Remove sensitive information

### For Users

1. **Use specific queries** - More precise results
2. **Verify information** - Cross-check critical facts
3. **Follow links** - Access full content when needed
4. **Use multiple searches** - For complex topics

## Troubleshooting

| Issue | Cause | Solution |
|--------|---------|-----------|
| No results | Query too specific | Simplify search terms |
| Connection failed | Network issue | Check internet connection |
| API error | Invalid credentials | Verify Tavily API key |
| Slow response | Rate limiting | Reduce request frequency |
| Blocked access | Geographic restriction | Use different engine |

## Tips

- **Start with SearXNG** - Works without setup
- **Use Tavily for complex queries** - Enhanced AI understanding
- **Adjust maxResults** - Get more comprehensive results (up to 10)
- **Try different engines** - If one doesn't return good results
- **Use specific terms** - Get better search results

## Security & Privacy

### Data Handling

- Queries are sent to search engines
- No personal data is required
- Results are processed client-side
- No search history is stored

### Privacy Notes

- **SearXNG**: Privacy-respecting, no tracking
- **Tavily**: Privacy-focused, no data collection

## Requirements

- **Network connectivity** - Internet access required
- **HTTP client** - For making API requests
- **JSON parser** - For parsing API responses

## Notes

- Default maxResults: 5
- Maximum maxResults: 10
- Results include: title, URL, content snippet
- HTML tags are stripped from snippets
- Engines may have different result qualities
- Tavily provides AI-enhanced relevance scoring

## See Also

- SearXNG: https://searxng.org/
- Tavily: https://tavily.com/

## Version

Version: 1.2.0
Status: Stable
