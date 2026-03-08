# Web Search Skill

A pi skill for web searching capabilities.

## Files

- `SKILL.md` - Main skill file (agent reads this)
- `GUIDE.md` - Detailed configuration guide
- `README.md` - This file

## Quick Start

The skill is automatically loaded by pi when placed in `~/.agents/skills/` or `.agents/skills/`.

To use, simply ask:

```
Search for latest Node.js version
What's happening in the Iran war?
Find information about Python 3.13
```

## Default Behavior

- **Engine**: SearXNG (https://sousuo.emoe.top/search)
- **Results**: 5 per search
- **Config**: None required (works out of the box)

## Configuration (Optional)

See `GUIDE.md` for detailed setup:

- **Google Custom Search**: 100 free queries/day
- **Custom SearXNG instance**: Use your own
- **DuckDuckGo**: With proxy support

## Extension

This skill is based on the `websearch.ts` extension located at:
`~/.pi/agent/extensions/websearch.ts`

To update or modify the underlying search functionality, edit that file and reload with `/reload`.
