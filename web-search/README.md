# Web Search Skill

A universal web search skill for AI agents, supporting multiple search engines with no configuration required.

## Overview

This skill provides AI agents with the ability to search the web for information, making it useful for:

- Finding current news and events
- Looking up technical documentation
- Researching products and services
- Answering factual questions
- Exploring online resources

## Features

- ✅ **Multiple Search Engines**: SearXNG, Tavily
- ✅ **Zero Configuration**: SearXNG works out of the box
- ✅ **Privacy Respecting**: Default engines don't track users
- ✅ **Flexible**: Easy to switch between engines
- ✅ **Universal**: Works with any AI agent

## Quick Start

### For Users

Simply request a search:

```
Search for latest Node.js version
Find information about Python 3.13
What's happening in the Middle East?
Look up documentation for React 18
```

### For Agent Developers

1. Copy the skill files to your agent
2. Implement the search function with these parameters:
   - `query`: string (required)
   - `maxResults`: number (optional, default 5)
   - `engine`: string (optional, default "auto")
3. Make HTTP requests to search engine APIs
4. Parse JSON responses
5. Format results for display

## Files

```
web-search/
├── SKILL.md      # Main skill definition
├── README.md     # This file
├── GUIDE.md      # Configuration guide
├── websearch.ts  # Universal TypeScript implementation
├── LICENSE       # MIT License
└── implementation.md  # Additional code examples
```

## Search Engines

| Engine | Setup | Best For | Priority |
|--------|--------|----------|----------|
| **SearXNG** | None | General searches, privacy-conscious users | 1 (Default) |
| **Tavily** | API Key | AI-enhanced search, complex queries | 2 |

## Configuration

### Default (Recommended)

No configuration needed! SearXNG works immediately.

### Tavily (AI-Powered)

Set up for AI-enhanced search with better understanding:

```bash
export TAVILY_API_KEY=your_api_key_here
```

Get API Key: https://tavily.com/

**Free Tier**: 1,000 searches/month

### Custom SearXNG Instance

```bash
export SEARXNG_URL=https://your-instance.com/search
```

## Parameters

| Parameter | Type | Default | Range |
|-----------|--------|---------|--------|
| `query` | string | - | - (required) |
| `maxResults` | number | 5 | 1-10 |
| `engine` | string | auto | auto/searxng/tavily |

## Usage Examples

### Basic

```
Search for AI news
Find information about quantum computing
Look up "latest JavaScript frameworks"
```

### With Parameters

```
Search for "Python tutorial", return 10 results
Use Tavily to search for "best AI tools"
```

### Real-World Scenarios

```
# Developer workflow
Search for "npm package security vulnerabilities"
Find documentation for "React hooks"
Look up error message "cannot find module"

# Research
Search for "climate change statistics 2026"
Find recent news about "space exploration"
Research "blockchain technology explained"

# Complex queries (Tavily recommended)
Search for "how to implement microservices architecture"
Find "best practices for CI/CD pipelines"
Look up "compare React vs Vue vs Angular performance"

# Product research
Search for "best mechanical keyboard 2026"
Find reviews of "Samsung Galaxy S26"
```

## Integration

This skill can be integrated into any AI agent framework:

### Example: Function Definition

```typescript
{
  name: "websearch",
  description: "Search the web for information",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query or question"
      },
      maxResults: {
        type: "number",
        description: "Number of results (1-10)",
        default: 5
      },
      engine: {
        type: "string",
        description: "Search engine",
        default: "auto",
        enum: ["auto", "searxng", "tavily"]
      }
    },
    required: ["query"]
  }
}
```

### Example: API Call (Tavily)

```bash
curl -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"query":"test","max_results":5}'
```

### Example: Implementation (Pseudocode)

```
function webSearch(query, maxResults, engine) {
  if engine == "auto" or "searxng":
    response = http.get("https://sousuo.emoe.top/search?q=" + query + "&format=json")
    results = response.results.slice(0, maxResults)
  else if engine == "tavily":
    response = http.post("https://api.tavily.com/search", {
      api_key: TAVILY_API_KEY,
      query: query,
      max_results: maxResults
    })
    results = response.results.slice(0, maxResults)

  return formatResults(results)
}
```

---

## TypeScript Implementation

A complete, ready-to-use TypeScript implementation is included in `websearch.ts`.

### Installation

Copy `websearch.ts` to your project:

```bash
cp websearch.ts ./src/websearch.ts
# or
cp websearch.ts ./lib/websearch.ts
```

### Basic Usage

```typescript
import { WebSearchClient, search } from './websearch';

// Option 1: Using the client class
const client = new WebSearchClient({
  tavilyApiKey: process.env.TAVILY_API_KEY
});

const results = await client.search({
  query: 'latest Node.js version',
  maxResults: 5,
  engine: 'auto'
});

console.log(client.formatResults(results, 'auto'));

// Option 2: Using the quick search function
const quickResults = await search('React documentation', {
  tavilyApiKey: process.env.TAVILY_API_KEY,
  maxResults: 5
});
```

### Configuration

```typescript
import { WebSearchClient } from './websearch';

const client = new WebSearchClient({
  searxngUrl: 'https://your-custom-searxng.com/search',
  tavilyApiKey: 'your_tavily_api_key',
  httpProxy: 'http://proxy.example.com:8080',
  httpsProxy: 'https://proxy.example.com:8443'
});
```

### Environment Variables

The client automatically reads these environment variables:

```bash
# Tavily API Key (optional)
export TAVILY_API_KEY=your_api_key_here

# Custom SearXNG instance (optional)
export SEARXNG_URL=https://your-instance.com/search

# Proxy configuration (optional)
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=https://proxy.example.com:8443
```

### Types

```typescript
// Search result
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  score?: number;
  engine?: string;
}

// Search parameters
interface WebSearchParams {
  query: string;
  maxResults?: number;
  engine?: 'auto' | 'searxng' | 'tavily';
}

// Configuration
interface WebSearchConfig {
  searxngUrl?: string;
  tavilyApiKey?: string;
  httpProxy?: string;
  httpsProxy?: string;
}
```

### Integration with AI Agents

**Example: OpenAI Function Calling**

```typescript
import { WebSearchClient } from './websearch';

const client = new WebSearchClient();

async function handleSearch(query: string, maxResults: number = 5) {
  const results = await client.search({ query, maxResults });

  return {
    results,
    formatted: client.formatResults(results, 'auto')
  };
}

// Register as a function
const searchFunction = {
  name: 'websearch',
  description: 'Search the web for information',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query or question'
      },
      maxResults: {
        type: 'number',
        description: 'Number of results (1-10)',
        default: 5
      }
    },
    required: ['query']
  },
  handler: handleSearch
};
```

**Example: Generic Agent Integration**

```typescript
import { WebSearchClient } from './websearch';

class MyAgent {
  private searchClient: WebSearchClient;

  constructor() {
    this.searchClient = new WebSearchClient({
      tavilyApiKey: process.env.TAVILY_API_KEY
    });
  }

  async search(query: string): Promise<string> {
    const results = await this.searchClient.search({ query });
    return this.searchClient.formatResults(results, 'auto');
  }

  async research(topic: string): Promise<string> {
    // Use Tavily for better research results
    const results = await this.searchClient.search({
      query: topic,
      maxResults: 8,
      engine: 'tavily'
    });
    return this.searchClient.formatResults(results, 'tavily');
  }
}
```

### Node.js Compatibility

For Node.js environments without native fetch, install `node-fetch`:

```bash
npm install node-fetch
# or
yarn add node-fetch
# or
pnpm add node-fetch
```

The implementation automatically detects and uses `node-fetch` if needed.

### Building for Production

```bash
# TypeScript
tsc websearch.ts --outDir ./dist

# Or with ts-node for development
ts-node my-script.ts
```

### API Reference

#### `WebSearchClient`

```typescript
class WebSearchClient {
  constructor(config?: WebSearchConfig);
  search(params: WebSearchParams): Promise<SearchResult[]>;
  formatResults(results: SearchResult[], engine: string): string;
  getConfig(): Readonly<WebSearchConfig>;
}
```

#### `search()` (Quick Function)

```typescript
function search(
  query: string,
  options?: WebSearchConfig & {
    maxResults?: number;
    engine?: 'auto' | 'searxng' | 'tavily';
  }
): Promise<SearchResult[]>
```

## Comparison

| Feature | SearXNG | Tavily |
|----------|-----------|---------|
| Setup Required | No | Yes |
| Free Quota | Unlimited | 1,000/month |
| Quality | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| AI-Enhanced | No | Yes |
| Privacy | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Setup Difficulty | Easy | Easy |
| Best For | General searches | Complex/natural language queries |

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Areas for improvement:

- Additional search engines
- Better error handling
- Enhanced result formatting
- Support for specialized searches (images, news, videos)
- Localization support

## Support

For issues and questions:
- Check GUIDE.md for detailed configuration
- Review SKILL.md for complete specification
- See implementation.md for code examples
- Report bugs at project repository

## Version

Current Version: 1.2.0
