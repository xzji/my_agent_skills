---
name: web-search
description: Search the web for information using multiple search engines (SearXNG, Google, DuckDuckGo). Use when user asks to search the web, find current information, look up news, or research online topics.
---

# Web Search

Search the web for information using privacy-respecting search engines. Supports SearXNG (default, no config needed), Google Custom Search (100 free queries/day), and DuckDuckGo.

## Usage

```bash
# Default search (uses SearXNG)
/web-search
Search for latest Node.js version

# Specify number of results
/web-search
Find information about Python 3.13, return 10 results

# Specify search engine
/web-search
Use Google to search "Samsung 2026 plans"
```

## Search Engines

| Engine | Description | Config Required |
|--------|-------------|-----------------|
| **SearXNG** (Default) | Privacy-respecting meta search, no limits | No |
| Google Custom Search | High quality, 100 free queries/day | API Key + CX ID |
| DuckDuckGo | Privacy-focused, free | Optional proxy |

## Parameters

The search function accepts these parameters:

| Parameter | Type | Default | Description |
|-----------|--------|---------|-------------|
| `query` | string | - | Search query or question (required) |
| `maxResults` | number | 5 | Number of results (1-10) |
| `engine` | string | auto | Search engine: auto/searxng/google/duckduckgo |

## Configuration

### SearXNG (Recommended - No Config Needed)

Default instance: `https://sousuo.emoe.top/search`

Works out of the box with:
- ✅ No API key required
- ✅ No rate limits
- ✅ Privacy protection
- ✅ Multiple search engines aggregated

### Google Custom Search (Optional)

Set up for higher quality results:

```bash
# 1. Get API Key
export GOOGLE_API_KEY=your_api_key_here

# 2. Get CX ID (Create Custom Search Engine)
export GOOGLE_CX_ID=your_cx_id_here

# 3. Reload pi
/reload
```

Instructions:
1. Get API Key: https://console.cloud.google.com/apis/credentials
2. Create Search Engine: https://programmablesearchengine.google.com/
3. Free quota: 100 queries/day

### DuckDuckGo (Optional)

```bash
# Use WebShare proxy (recommended)
export WEBSHARE_API_KEY=your_webshare_key

# Or use HTTP proxy
export HTTP_PROXY=http://127.0.0.1:7890
```

### Custom SearXNG Instance

```bash
export SEARXNG_URL=https://your-custom-instance.com/search
```

## Output Format

Results are displayed as:

```
Search results for "query" (engine):

1. Title
   URL: https://example.com
   Snippet of content...

2. Title
   URL: https://example.com
   Snippet of content...
```

## Engine Priority (auto mode)

When `engine=auto` (default):

1. **SearXNG** - Always tried first
2. **Google** - If API key configured
3. **DuckDuckGo** - Fallback option

## When to Use

Use this skill when user requests:

- Search the web for [topic]
- Find information about [subject]
- What's the latest [news/topic]?
- Look up [term] online
- Current events / recent news
- Product research
- Technical documentation lookup
- Facts verification

## Examples

```bash
# Tech queries
/web-search
Search for latest Node.js version

/web-search
Find Python 3.13 documentation

# News and current events
/web-search
What's happening in Iran war?

/web-search
Latest tech news today

# Research
/web-search
Best practices for React hooks

/web-search
Compare Docker vs Podman

# Product search
/web-search
Best laptop for coding 2026
```

## Tips

- **Default is best for most use cases** - SearXNG works well without setup
- **Google for precision** - Use when you need high-quality results and have API keys
- **Use maxResults** - Request more results for comprehensive research
- **Specify engine** - Force use of a particular search engine
- **Current events** - Great for news and time-sensitive topics

## Troubleshooting

| Issue | Solution |
|--------|----------|
| "fetch failed" | Check network connection, try different engine |
| "No search results found" | Try different query, switch engine |
| SearXNG blocked | Use Google or DuckDuckGo, or set HTTP_PROXY |
| Google quota exceeded | Wait for daily reset or use SearXNG |

## Notes

- Results include title, URL, and content snippet
- Maximum 10 results per search
- HTML tags are stripped from snippets
- SearXNG respects .gitignore-like patterns in search results

## Quick Start

```bash
# Install skill (if not already in skills/)
# Skill files are auto-loaded from:
# ~/.agents/skills/
# .agents/skills/ (current directory and parents)

# Use immediately
/web-search
Search for [your topic]

# No configuration needed for SearXNG!
```

See `websearch-GUIDE.md` for detailed setup instructions.
