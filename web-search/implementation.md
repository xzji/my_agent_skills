# Web Search Implementation Guide

Reference implementation for integrating web search functionality into AI agents.

## Overview

This guide provides implementation examples for various programming languages and frameworks, including support for:
- **SearXNG** (Default, no config)
- **Tavily** (AI-powered search)

Engine Priority: SearXNG → Tavily

---

## TypeScript/JavaScript

### Basic Implementation

```typescript
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  score?: number;
}

interface WebSearchParams {
  query: string;
  maxResults?: number;
  engine?: 'auto' | 'searxng' | 'tavily';
}

class WebSearchClient {
  private readonly searxngUrl = 'https://sousuo.emoe.top/search';
  private readonly tavilyApiKey = process.env.TAVILY_API_KEY;

  async search(params: WebSearchParams): Promise<SearchResult[]> {
    const { query, maxResults = 5, engine = 'auto' } = params;

    const enginesToTry: Array<'searxng' | 'tavily'> = [];

    if (engine === 'auto') {
      enginesToTry.push('searxng');
      if (this.tavilyApiKey) {
        enginesToTry.push('tavily');
      }
    } else {
      enginesToTry.push(engine);
    }

    for (const eng of enginesToTry) {
      try {
        const results = await this.searchWithEngine(eng, query, maxResults);
        if (results.length > 0) {
          return results;
        }
      } catch (error) {
        console.error(`${eng} search failed:`, error);
        // Try next engine
      }
    }

    return [];
  }

  private async searchWithEngine(
    engine: string,
    query: string,
    maxResults: number
  ): Promise<SearchResult[]> {
    switch (engine) {
      case 'searxng':
        return this.searchSearXNG(query, maxResults);
      case 'tavily':
        return this.searchTavily(query, maxResults);
      default:
        throw new Error(`Unknown engine: ${engine}`);
    }
  }

  private async searchSearXNG(query: string, maxResults: number): Promise<SearchResult[]> {
    const url = new URL(this.searxngUrl);
    url.searchParams.append('q', query);
    url.searchParams.append('format', 'json');
    url.searchParams.append('language', 'auto');
    url.searchParams.append('categories', 'general');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`SearXNG API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.slice(0, maxResults).map((result: any) => ({
      title: result.title,
      url: result.url,
      snippet: result.content
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&'),
    }));
  }

  private async searchTavily(query: string, maxResults: number): Promise<SearchResult[]> {
    if (!this.tavilyApiKey) {
      throw new Error('Tavily API key not configured');
    }

    const url = 'https://api.tavily.com/search';
    const body = {
      api_key: this.tavilyApiKey,
      query: query,
      max_results: maxResults,
      search_depth: 'basic',
      include_answer: true,
      include_raw_content: false,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Tavily API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.slice(0, maxResults).map((result: any) => ({
      title: result.title,
      url: result.url,
      snippet: result.content,
      score: result.score,
    }));
  }

  formatResults(results: SearchResult[], engine: string): string {
    if (results.length === 0) {
      return 'No results found. Try a different search query or engine.';
    }

    let output = `Search results for "${engine === 'auto' ? '' : ''}" (${engine}):\n\n`;

    for (const [index, result] of results.entries()) {
      output += `${index + 1}. ${result.title}\n`;
      output += `   URL: ${result.url}\n`;
      output += `   ${result.snippet}\n\n`;
    }

    return output.trim();
  }
}

// Usage Example
const client = new WebSearchClient();
const results = await client.search({
  query: 'latest Node.js version',
  maxResults: 5,
  engine: 'auto'
});
console.log(client.formatResults(results, 'searxng'));
```

---

## Python

```python
import os
import requests
from typing import List, Dict
from urllib.parse import urlencode

class WebSearchClient:
    def __init__(self):
        self.searxng_url = "https://sousuo.emoe.top/search"
        self.tavily_api_key = os.getenv("TAVILY_API_KEY")

    async def search(self, query: str, max_results: int = 5, engine: str = "auto") -> List[Dict]:
        engines_to_try = []

        if engine == "auto":
            engines_to_try.append("searxng")
            if self.tavily_api_key:
                engines_to_try.append("tavily")
        else:
            engines_to_try.append(engine)

        for eng in engines_to_try:
            try:
                results = await self._search_with_engine(eng, query, max_results)
                if results:
                    return results
            except Exception as e:
                print(f"{eng} search failed: {e}")
                continue

        return []

    async def _search_with_engine(self, engine: str, query: str, max_results: int) -> List[Dict]:
        if engine == "searxng":
            return await self._search_searxng(query, max_results)
        elif engine == "tavily":
            return await self._search_tavily(query, max_results)
        else:
            raise ValueError(f"Unknown engine: {engine}")

    async def _search_searxng(self, query: str, max_results: int) -> List[Dict]:
        url = f"{self.searxng_url}?q={query}&format=json&language=auto&categories=general"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        results = []
        for result in data.get("results", [])[:max_results]:
            snippet = result.get("content", "")
            snippet = snippet.replace("<[^>]*>", "").replace("&quot;", '"').replace("&apos;", "'").replace("&amp;", "&")

            results.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "snippet": snippet
            })

        return results

    async def _search_tavily(self, query: str, max_results: int) -> List[Dict]:
        if not self.tavily_api_key:
            raise Exception("Tavily API key not configured")

        url = "https://api.tavily.com/search"
        payload = {
            "api_key": self.tavily_api_key,
            "query": query,
            "max_results": max_results,
            "search_depth": "basic",
            "include_answer": True,
            "include_raw_content": False
        }

        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()

        results = []
        for result in data.get("results", [])[:max_results]:
            results.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "snippet": result.get("content", ""),
                "score": result.get("score", 0)
            })

        return results

    def format_results(self, results: List[Dict], engine: str) -> str:
        if not results:
            return "No results found. Try a different search query or engine."

        output = f'Search results for "{engine}"):\n\n'
        for index, result in enumerate(results, 1):
            output += f"{index}. {result['title']}\n"
            output += f"   URL: {result['url']}\n"
            output += f"   {result['snippet']}\n\n"

        return output.strip()

# Usage Example
import asyncio

async def main():
    client = WebSearchClient()
    results = await client.search("latest Node.js version", max_results=5, engine="auto")
    print(client.format_results(results, "searxng"))

asyncio.run(main())
```

---

## Go

```go
package websearch

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "os"
    "strings"
)

type SearchResult struct {
    Title   string `json:"title"`
    URL     string `json:"url"`
    Snippet string `json:"snippet"`
    Score   float64 `json:"score,omitempty"`
}

type Client struct {
    SearXNGURL   string
    TavilyAPIKey string
}

func NewClient() *Client {
    return &Client{
        SearXNGURL:   "https://sousuo.emoe.top/search",
        TavilyAPIKey: os.Getenv("TAVILY_API_KEY"),
    }
}

func (c *Client) Search(query string, maxResults int, engine string) ([]SearchResult, error) {
    engines := []string{"searxng", "tavily"}

    if c.TavilyAPIKey != "" {
        engines = append(engines, "tavily")
    }

    if engine != "auto" && engine != "searxng" && engine != "tavily" {
        return nil, fmt.Errorf("unknown engine: %s", engine)
    }

    if engine == "auto" {
        // Try both in order
    } else {
        engines = []string{engine}
    }

    for _, eng := range engines {
        results, err := c.searchWithEngine(eng, query, maxResults)
        if err != nil {
            fmt.Printf("%s search failed: %v\n", eng, err)
            continue
        }
        if len(results) > 0 {
            return results, nil
        }
    }

    return nil, fmt.Errorf("all search engines failed")
}

func (c *Client) searchWithEngine(engine, query string, maxResults int) ([]SearchResult, error) {
    switch engine {
    case "searxng":
        return c.searchSearXNG(query, maxResults)
    case "tavily":
        return c.searchTavily(query, maxResults)
    default:
        return nil, fmt.Errorf("unknown engine: %s", engine)
    }
}

func (c *Client) searchSearXNG(query string, maxResults int) ([]SearchResult, error) {
    u := fmt.Sprintf("%s?q=%s&format=json&language=auto&categories=general", c.SearXNGURL, url.QueryEscape(query))
    resp, err := http.Get(u)
    if err != nil {
        return nil, fmt.Errorf("request failed: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("API error: %s", resp.Status)
    }

    var data struct {
        Results []struct {
            Title   string `json:"title"`
            URL     string `json:"url"`
            Content string `json:"content"`
        } `json:"results"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
        return nil, fmt.Errorf("decode failed: %w", err)
    }

    if maxResults > len(data.Results) {
        maxResults = len(data.Results)
    }

    results := make([]SearchResult, maxResults)
    for i, r := range data.Results[:maxResults] {
        results[i] = SearchResult{
            Title:   r.Title,
            URL:     r.URL,
            Snippet: cleanHTML(r.Content),
        }
    }

    return results, nil
}

func (c *Client) searchTavily(query string, maxResults int) ([]SearchResult, error) {
    if c.TavilyAPIKey == "" {
        return nil, fmt.Errorf("Tavily API key not configured")
    }

    payload := map[string]interface{}{
        "api_key":          c.TavilyAPIKey,
        "query":            query,
        "max_results":       maxResults,
        "search_depth":      "basic",
        "include_answer":    true,
        "include_raw_content": false,
    }

    payloadBytes, err := json.Marshal(payload)
    if err != nil {
        return nil, fmt.Errorf("marshal failed: %w", err)
    }

    resp, err := http.Post("https://api.tavily.com/search", "application/json", bytes.NewReader(payloadBytes))
    if err != nil {
        return nil, fmt.Errorf("request failed: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("API error: %s", resp.Status)
    }

    var data struct {
        Query   string `json:"query"`
        Results []struct {
            Title   string `json:"title"`
            URL     string `json:"url"`
            Content string `json:"content"`
            Score   float64 `json:"score,omitempty"`
        } `json:"results"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
        return nil, fmt.Errorf("decode failed: %w", err)
    }

    if maxResults > len(data.Results) {
        maxResults = len(data.Results)
    }

    results := make([]SearchResult, maxResults)
    for i, r := range data.Results[:maxResults] {
        results[i] = SearchResult{
            Title:   r.Title,
            URL:     r.URL,
            Snippet: r.Content,
            Score:   r.Score,
        }
    }

    return results, nil
}

func cleanHTML(s string) string {
    s = strings.ReplaceAll(s, "<[^>]*>", "", -1)
    s = strings.ReplaceAll(s, "&quot;", "\"", -1)
    s = strings.ReplaceAll(s, "&apos;", "'", -1)
    s = strings.ReplaceAll(s, "&amp;", "&", -1)
    return s
}

func (c *Client) FormatResults(results []SearchResult, engine string) string {
    if len(results) == 0 {
        return "No results found. Try a different search query or engine."
    }

    var output strings.Builder
    output.WriteString(fmt.Sprintf(`Search results for "%s" (%s):\n\n`, engine, engine))

    for i, r := range results {
        output.WriteString(fmt.Sprintf("%d. %s\n", i+1, r.Title))
        output.WriteString(fmt.Sprintf("   URL: %s\n", r.URL))
        output.WriteString(fmt.Sprintf("   %s\n\n", r.Snippet))
    }

    return output.String()
}

// Usage
func main() {
    client := NewClient()
    results, err := client.Search("latest Node.js version", 5, "auto")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println(client.FormatResults(results, "searxng"))
}
```

---

## REST API Example

### Simple Express.js Server

```javascript
const express = require('express');
const app = express();
const WebSearchClient = require('./client'); // From TypeScript implementation above

app.use(express.json());

app.post('/search', async (req, res) => {
  try {
    const { query, maxResults = 5, engine = 'auto' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const client = new WebSearchClient();
    const results = await client.search({ query, maxResults, engine });

    res.json({
      success: true,
      engine,
      query,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Web search API running on port 3000');
});
```

### Request Example

```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"query":"latest Node.js version","maxResults":5,"engine":"auto"}'
```

### Response Example

```json
{
  "success": true,
  "engine": "searxng",
  "query": "latest Node.js version",
  "count": 5,
  "results": [
    {
      "title": "Node.js",
      "url": "https://nodejs.org/",
      "snippet": "Node.js is a JavaScript runtime...",
      "score": 0.95
    }
  ]
}
```

---

## Testing

### Unit Test Example (TypeScript)

```typescript
import { describe, it, expect } from 'jest';
import { WebSearchClient } from './client';

describe('WebSearchClient', () => {
  it('should search with SearXNG', async () => {
    const client = new WebSearchClient();
    const results = await client.search({
      query: 'test',
      maxResults: 3,
      engine: 'searxng'
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('url');
    expect(results[0]).toHaveProperty('snippet');
  });

  it('should search with Tavily', async () => {
    // Set TAVILY_API_KEY for this test
    const client = new WebSearchClient();
    const results = await client.search({
      query: 'what is AI?',
      maxResults: 3,
      engine: 'tavily'
    });

    expect(results.length).toBeGreaterThan(0);
  });

  it('should handle empty results', async () => {
    const client = new WebSearchClient();
    const results = await client.search({
      query: 'veryuniqueterm12345',
      engine: 'searxng'
    });

    expect(results.length).toBe(0);
  });
});
```

---

## Notes

- All implementations support the same parameters
- Auto mode tries engines in order: SearXNG → Tavily
- Error handling falls back to next engine
- Results are limited to maxResults (max 10)
- HTML tags are stripped from snippets
- Credentials can be set via environment variables
- Tavily provides relevance scoring

---

## Environment Variables

| Variable | Purpose |
|-----------|----------|
| `SEARXNG_URL` | Custom SearXNG instance URL |
| `TAVILY_API_KEY` | Tavily API Key |
| `HTTP_PROXY` | Proxy URL for HTTP requests |
| `HTTPS_PROXY` | Proxy URL for HTTPS requests |

---

## Integration Checklist

- [ ] Copy/implementation files to project
- [ ] Set up environment variables (optional)
- [ ] Implement search function
- [ ] Add error handling
- [ ] Test with both engines
- [ ] Add to agent's tool/function registry
- [ ] Update documentation

---

## License

These examples are provided under MIT License.
