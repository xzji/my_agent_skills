# Web Search Configuration Guide

Complete guide for configuring web search functionality in AI agents.

## Quick Start

**Zero Configuration Required!**

The default search engine (SearXNG) works immediately without any setup.

---

## Search Engines

### 1. SearXNG (Default, Recommended)

**Overview**: Privacy-respecting meta search engine that aggregates results from multiple sources.

**Default Instance**: `https://sousuo.emoe.top/search`

**Advantages**:
- ✅ No API key required
- ✅ No rate limits
- ✅ Privacy protection (no tracking)
- ✅ Aggregates multiple search engines
- ✅ Works out of box

**API Usage**:

```http
GET https://sousuo.emoe.top/search?q={query}&format=json&language=auto&categories=general
```

**Response Format**:
```json
{
  "query": "search term",
  "number_of_results": 100,
  "results": [
    {
      "title": "Result Title",
      "url": "https://example.com",
      "content": "Content snippet...",
      "engine": "source_engine"
    }
  ]
}
```

**Custom Instance**:

To use your own SearXNG instance:

```
SEARXNG_URL=https://your-instance.com/search
```

Deploy your own: https://searxng.org/

---

### 2. Tavily (AI-Powered Search)

**Overview**: Advanced AI search engine with enhanced understanding and relevance scoring.

**Advantages**:
- ✅ AI-powered results with relevance scoring
- ✅ Excellent for complex queries
- ✅ Natural language understanding
- ✅ Fast response times
- ✅ Enhanced relevance ranking

**Setup Instructions**:

#### Step 1: Get API Key

1. Visit: https://tavily.com/
2. Sign up for free account
3. Navigate to API section
4. Copy your API key

**Free Tier**: 1,000 searches per month
**Pricing**: https://tavily.com/pricing

#### Step 2: Configure Environment Variable

```bash
export TAVILY_API_KEY=your_api_key_here
```

Or in code/agent configuration:
```json
{
  "search": {
    "tavily_api_key": "your_api_key_here"
  }
}
```

**API Usage**:

```http
POST https://api.tavily.com/search
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "api_key": "{api_key}",
  "query": "{query}",
  "max_results": {maxResults},
  "search_depth": "basic",
  "include_answer": true,
  "include_raw_content": false
}
```

**Response Format**:
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

**Quota Management**:
- Free: 1,000 searches per month
- Check usage: https://tavily.com/dashboard
- Paid plans available for higher limits

---

## Engine Selection Logic

When `engine=auto` (default):

1. Try **SearXNG** first (always available)
2. Try **Tavily** if API key configured

You can force a specific engine:
```
Use SearXNG to search for [query]
Use Tavily to search for [query]
```

## Parameter Reference

### Common Parameters

| Parameter | Type | Default | Description |
|-----------|--------|---------|-------------|
| `query` | string | required | The search query |
| `maxResults` | number | 5 | Number of results (1-10) |
| `engine` | string | auto | Search engine selection (auto/searxng/tavily) |
| `language` | string | auto | Search language (SearXNG only) |

### SearXNG-Specific Parameters

| Parameter | Values | Description |
|-----------|---------|-------------|
| `categories` | general, images, videos, news, etc. | Content type to search |
| `time_range` | day, week, month, year | Time filter for results |
| `safesearch` | 0, 1, 2 | Safe search level (0=off, 1=moderate, 2=strict) |

### Tavily-Specific Parameters

| Parameter | Values | Description |
|-----------|---------|-------------|
| `search_depth` | basic/advanced | Search depth (default: basic) |
| `include_answer` | true/false | Include AI-generated answer |
| `include_raw_content` | true/false | Include full page content |
| `days` | number | Limit results to recent days |
| `include_domains` | array | Specific domains to search |
| `exclude_domains` | array | Domains to exclude |

---

## Error Handling

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|--------|---------------|-----------|
| **fetch failed** | Network connectivity issue | Check internet connection |
| **401 Unauthorized** | Invalid API key | Verify Tavily credentials |
| **429 Too Many Requests** | Rate limit exceeded | Wait or use different engine |
| **Empty results** | Query too specific | Simplify search terms |
| **Connection timeout** | Network slow/blocked | Use different engine |
| **CAPTCHA required** | Anti-bot protection | Use different engine |

### Best Practices

1. **Graceful Fallback**: Try multiple engines
2. **Rate Limiting**: Implement request throttling
3. **Caching**: Cache common queries
4. **Timeout Handling**: Set appropriate timeouts
5. **Error Logging**: Log errors for debugging

---

## Security Considerations

### API Key Protection

- Never commit API keys to version control
- Use environment variables or secure vaults
- Rotate keys regularly
- Monitor usage for anomalies

### Privacy

- **SearXNG**: Most privacy-friendly
- **Tavily**: Privacy-focused, no search data collection

### Data Sanitization

- Strip sensitive information from queries
- Sanitize user input before searching
- Don't log full queries
- Mask API keys in logs

---

## Advanced Configuration

### Custom SearXNG Instance Deployment

For complete control and privacy:

1. Deploy SearXNG (https://searxng.org/)
2. Configure preferred search engines
3. Set custom rate limits
4. Enable/disable specific engines
5. Point to your instance:

```
SEARXNG_URL=https://your-instance.com/search
```

### Tavily Advanced Usage

**Time-Limited Search**:
```json
{
  "query": "latest news",
  "days": 7,
  "max_results": 10
}
```

**Domain-Specific Search**:
```json
{
  "query": "AI tools",
  "include_domains": ["github.com", "producthunt.com"]
}
```

**Exclude Domains**:
```json
{
  "query": "best laptops",
  "exclude_domains": ["spam-site.com"]
}
```

---

## Testing

### Manual Testing

**Test SearXNG**:
```bash
curl "https://sousuo.emoe.top/search?q=test&format=json" | jq '.results | length'
```

**Test Tavily**:
```bash
curl -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"query":"test","max_results":5}' | jq '.results | length'
```

---

## Troubleshooting Checklist

- [ ] Network connectivity verified
- [ ] API keys are valid (if using Tavily)
- [ ] Environment variables are set correctly
- [ ] Quota limits not exceeded
- [ ] Agent configuration references correct endpoints
- [ ] Error logs reviewed for specific issues

---

## Environment Variables Summary

| Variable | Purpose | Required |
|-----------|---------|-----------|
| `SEARXNG_URL` | Custom SearXNG instance URL | No |
| `TAVILY_API_KEY` | Tavily API Key | For Tavily |
| `HTTP_PROXY` | HTTP proxy URL | No |
| `HTTPS_PROXY` | HTTPS proxy URL | No |
| `ALL_PROXY` | Global proxy URL | No |
| `NO_PROXY` | Proxy bypass list | No |

---

## Resources

### Official Documentation

- SearXNG: https://searxng.org/
- Tavily: https://tavily.com/docs

### Community

- SearXNG Instances: https://searx.space/
- Tavily Dashboard: https://tavily.com/dashboard
- Search Engine Discussion: Various tech forums

---

## FAQ

**Q: Do I need to configure anything?**
A: No, SearXNG works out of the box. Configuration is optional for Tavily.

**Q: How much does it cost?**
A: SearXNG is free. Tavily offers 1,000 free searches/month, with paid plans available.

**Q: Which engine should I use?**
A: Start with SearXNG. Use Tavily for complex queries or natural language understanding if you have API keys.

**Q: Can I use my own SearXNG instance?**
A: Yes, set `SEARXNG_URL` to your instance.

**Q: Is my search data private?**
A: Both SearXNG and Tavily are privacy-focused and don't track users.

**Q: What if an engine fails?**
A: With `engine=auto`, it automatically tries to the next available engine.

**Q: What makes Tavily special?**
A: Tavily uses AI to enhance search understanding, providing better relevance for complex or natural language queries.
