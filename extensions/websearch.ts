/**
 * Web Search Extension
 *
 * Provides a websearch tool to search the web.
 * Supports multiple search engines with or without API keys.
 *
 * Configuration:
 *
 * SearXNG (Default, no API key required):
 * - Uses https://sousuo.emoe.top/search
 * - Free, no rate limits
 * - Privacy-respecting meta search engine
 *
 * Tavily (AI-Powered Search, 1,000 searches/month free):
 * - Set TAVILY_API_KEY: https://tavily.com/
 * - AI-enhanced relevance and natural language understanding
 *
 * Proxy:
 * - Set HTTP_PROXY, HTTPS_PROXY, or ALL_PROXY for proxy support
 *
 * Usage:
 * 1. Copy this file to ~/.pi/agent/extensions/
 * 2. Configure environment variables (optional for SearXNG)
 * 3. Ask pi to search the web: "Search for latest Node.js version"
 */

import { Type } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

interface SearchResult {
	title: string;
	url: string;
	snippet: string;
	score?: number;
}

interface SearXNGResponse {
	query: string;
	number_of_results: number;
	results: Array<{
		url: string;
		title: string;
		content: string;
		engine?: string;
	}>;
	answers: any[];
	corrections: any[];
	infoboxes: any[];
	suggestions: string[];
}

interface TavilyResponse {
	query: string;
	answer?: string;
	results: Array<{
		title: string;
		url: string;
		content: string;
		score: number;
	}>;
}

// Default SearXNG instance
const DEFAULT_SEARXNG_URL = "https://sousuo.emoe.top/search";

// Get search engine preference from env
const SEARCH_ENGINE = process.env.SEARCH_ENGINE || "auto"; // auto, searxng, tavily

async function fetchWithProxy(url: string, options: RequestInit = {}): Promise<Response> {
	return fetch(url, options);
}

async function searchSearXNG(query: string, maxResults: number): Promise<SearchResult[]> {
	try {
		const apiUrl = process.env.SEARXNG_URL || DEFAULT_SEARXNG_URL;
		const url = new URL(apiUrl);
		url.searchParams.append("q", query);
		url.searchParams.append("format", "json");
		url.searchParams.append("language", "auto");
		url.searchParams.append("categories", "general");
		url.searchParams.append("safesearch", "0");

		const response = await fetchWithProxy(url.toString());

		if (!response.ok) {
			throw new Error(`SearXNG API failed: ${response.statusText}`);
		}

		const data: SearXNGResponse = await response.json();

		if (!data.results || data.results.length === 0) {
			return [];
		}

		return data.results.slice(0, maxResults).map((result) => ({
			title: result.title,
			url: result.url,
			snippet: result.content.replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&"),
		}));
	} catch (error) {
		console.error("SearXNG search error:", error);
		throw error;
	}
}

async function searchTavily(query: string, maxResults: number): Promise<SearchResult[]> {
	const apiKey = process.env.TAVILY_API_KEY;

	if (!apiKey || apiKey === "your_api_key") {
		throw new Error(
			"TAVILY_API_KEY not set. Get it from https://tavily.com/",
		);
	}

	try {
		const url = "https://api.tavily.com/search";
		const payload = {
			api_key: apiKey,
			query: query,
			max_results: maxResults,
			search_depth: "basic",
			include_answer: true,
			include_raw_content: false,
		};

		const response = await fetchWithProxy(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				`Tavily API failed (${response.status}): ${errorData.error || response.statusText}`,
			);
		}

		const data: TavilyResponse = await response.json();

		if (!data.results || data.results.length === 0) {
			return [];
		}

		return data.results.slice(0, maxResults).map((result) => ({
			title: result.title,
			url: result.url,
			snippet: result.content,
			score: result.score,
		}));
	} catch (error) {
		console.error("Tavily search error:", error);
		throw error;
	}
}

export default function websearchExtension(pi: ExtensionAPI) {
	pi.registerTool({
		name: "websearch",
		label: "Web Search",
		description: "Search the web for information using SearXNG or Tavily",
		parameters: Type.Object({
			query: Type.String({
				description: "Search query or question",
			}),
			maxResults: Type.Optional(
				Type.Number({
					description: "Maximum number of results to return (default: 5, max: 10)",
					minimum: 1,
					maximum: 10,
				}),
			),
			engine: Type.Optional(
				Type.String({
					description: "Search engine: searxng, tavily, or auto (default, tries searxng first)",
				}),
			),
		}),

		async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
			const { query, maxResults = 5, engine = SEARCH_ENGINE } = params as {
				query: string;
				maxResults?: number;
				engine?: string;
			};

			const enginesToTry: string[] = [];

			if (engine === "auto") {
				// Priority: SearXNG → Tavily
				const tavilyKey = process.env.TAVILY_API_KEY;

				enginesToTry.push("searxng"); // Default, always try first
				if (tavilyKey && tavilyKey !== "your_api_key") {
					enginesToTry.push("tavily");
				}
			} else {
				enginesToTry.push(engine);
			}

			let lastError: Error | null = null;

			for (const eng of enginesToTry) {
				try {
					let results: SearchResult[] = [];

					if (eng === "searxng") {
						results = await searchSearXNG(query, maxResults);
					} else if (eng === "tavily") {
						results = await searchTavily(query, maxResults);
					}

					if (results.length > 0) {
						let output = `Search results for "${query}" (${eng}):\n\n`;

						for (const [index, result] of results.entries()) {
							output += `${index + 1}. ${result.title}\n`;
							output += `   URL: ${result.url}\n`;
							if (result.score !== undefined) {
								output += `   Score: ${result.score.toFixed(2)}\n`;
							}
							output += `   ${result.snippet}\n\n`;
						}

						return {
							content: [
								{
									type: "text",
									text: output.trim(),
								},
							],
							details: {
								query,
								engine: eng,
								count: results.length,
							},
						};
					}
				} catch (error) {
					lastError = error as Error;
					console.error(`${eng} search failed:`, error);
				}
			}

			const errorMsg = lastError
				? lastError.message
				: "No search results found.";

			return {
				content: [
					{
						type: "text",
						text: `Search error: ${errorMsg}\n\n` +
							`**SearXNG (Default, no API key required):**\n` +
							`- Uses free meta search engine\n` +
							`- Works out of the box, no configuration needed\n` +
							`- Privacy-respecting, no tracking\n\n` +
							`**Tavily (Optional, 1,000 searches/month free):**\n` +
							`- Get API Key: https://tavily.com/\n` +
							`- AI-powered search with enhanced relevance\n` +
							`- Set environment variable:\n` +
							`   export TAVILY_API_KEY=your_api_key`,
					},
				],
			};
		},
	});
}
