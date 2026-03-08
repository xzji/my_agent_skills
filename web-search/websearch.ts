/**
 * Universal Web Search Client
 *
 * A TypeScript implementation of web search functionality that works with any AI agent.
 * Supports SearXNG (default, no config) and Tavily (AI-powered).
 *
 * Features:
 * - SearXNG: Free, no API key required, privacy-respecting
 * - Tavily: AI-enhanced search with relevance scoring (1,000 free searches/month)
 * - Automatic engine selection and fallback
 *
 * @version 1.2.0
 * @license MIT
 */

/**
 * Search result with metadata
 */
export interface SearchResult {
	/** Result title */
	title: string;
	/** Result URL */
	url: string;
	/** Content snippet */
	snippet: string;
	/** Relevance score (only for Tavily) */
	score?: number;
	/** Engine that provided this result */
	engine?: string;
}

/**
 * Search parameters
 */
export interface WebSearchParams {
	/** Search query or question (required) */
	query: string;
	/** Maximum number of results (default: 5, max: 10) */
	maxResults?: number;
	/** Search engine: 'auto', 'searxng', or 'tavily' (default: 'auto') */
	engine?: 'auto' | 'searxng' | 'tavily';
}

/**
 * Configuration options
 */
export interface WebSearchConfig {
	/** Custom SearXNG instance URL */
	searxngUrl?: string;
	/** Tavily API key */
	tavilyApiKey?: string;
	/** HTTP proxy URL */
	httpProxy?: string;
	/** HTTPS proxy URL */
	httpsProxy?: string;
}

/**
 * SearXNG API response structure
 */
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

/**
 * Tavily API response structure
 */
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

/**
 * Universal Web Search Client
 *
 * Example usage:
 * ```typescript
 * import { WebSearchClient } from './websearch.ts';
 *
 * const client = new WebSearchClient({
 *   tavilyApiKey: process.env.TAVILY_API_KEY
 * });
 *
 * const results = await client.search({
 *   query: 'latest Node.js version',
 *   maxResults: 5,
 *   engine: 'auto'
 * });
 *
 * console.log(results);
 * ```
 */
export class WebSearchClient {
	private readonly config: Required<WebSearchConfig>;

	/**
	 * Default SearXNG instance URL
	 */
	private static readonly DEFAULT_SEARXNG_URL = 'https://sousuo.emoe.top/search';

	/**
	 * Create a new WebSearchClient instance
	 *
	 * @param config - Configuration options
	 */
	constructor(config: WebSearchConfig = {}) {
		this.config = {
			searxngUrl: config.searxngUrl || WebSearchClient.DEFAULT_SEARXNG_URL,
			tavilyApiKey: config.tavilyApiKey || process.env.TAVILY_API_KEY || '',
			httpProxy: config.httpProxy || process.env.HTTP_PROXY || '',
			httpsProxy: config.httpsProxy || process.env.HTTPS_PROXY || '',
		};
	}

	/**
	 * Search the web
	 *
	 * @param params - Search parameters
	 * @returns Array of search results
	 *
	 * @example
	 * ```typescript
	 * const results = await client.search({
	 *   query: 'React documentation',
	 *   maxResults: 5,
	 *   engine: 'auto'
	 * });
	 * ```
	 */
	async search(params: WebSearchParams): Promise<SearchResult[]> {
		const { query, maxResults = 5, engine = 'auto' } = params;

		// Validate maxResults
		const validatedMaxResults = Math.max(1, Math.min(10, maxResults));

		const enginesToTry: Array<'searxng' | 'tavily'> = [];

		if (engine === 'auto') {
			// Priority: SearXNG → Tavily
			enginesToTry.push('searxng');
			if (this.config.tavilyApiKey && this.config.tavilyApiKey !== 'your_api_key') {
				enginesToTry.push('tavily');
			}
		} else {
			enginesToTry.push(engine);
		}

		let lastError: Error | null = null;

		for (const eng of enginesToTry) {
			try {
				const results = await this.searchWithEngine(eng, query, validatedMaxResults);
				if (results.length > 0) {
					return results;
				}
			} catch (error) {
				lastError = error as Error;
				console.error(`${eng} search failed:`, error);
			}
		}

		if (lastError) {
			throw lastError;
		}

		return [];
	}

	/**
	 * Search with a specific engine
	 */
	private async searchWithEngine(
		engine: 'searxng' | 'tavily',
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

	/**
	 * Search using SearXNG
	 */
	private async searchSearXNG(query: string, maxResults: number): Promise<SearchResult[]> {
		const url = new URL(this.config.searxngUrl);
		url.searchParams.append('q', query);
		url.searchParams.append('format', 'json');
		url.searchParams.append('language', 'auto');
		url.searchParams.append('categories', 'general');
		url.searchParams.append('safesearch', '0');

		const response = await this.fetchWithProxy(url.toString());

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
			snippet: this.cleanHTML(result.content),
			engine: 'searxng',
		}));
	}

	/**
	 * Search using Tavily
	 */
	private async searchTavily(query: string, maxResults: number): Promise<SearchResult[]> {
		if (!this.config.tavilyApiKey || this.config.tavilyApiKey === 'your_api_key') {
			throw new Error('TAVILY_API_KEY not set. Get it from https://tavily.com/');
		}

		const url = 'https://api.tavily.com/search';
		const payload = {
			api_key: this.config.tavilyApiKey,
			query: query,
			max_results: maxResults,
			search_depth: 'basic',
			include_answer: true,
			include_raw_content: false,
		};

		const response = await this.fetchWithProxy(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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
			engine: 'tavily',
		}));
	}

	/**
	 * Fetch with proxy support
	 */
	private async fetchWithProxy(url: string, options: RequestInit = {}): Promise<Response> {
		if (this.config.httpProxy && url.startsWith('http://')) {
			// Note: Fetch API doesn't support HTTP_PROXY directly
			// Use a proxy agent library like https-proxy-agent for Node.js
			console.warn('HTTP proxy configured but not supported by fetch API directly');
		}
		if (this.config.httpsProxy && url.startsWith('https://')) {
			// Note: Fetch API doesn't support HTTPS_PROXY directly
			// Use a proxy agent library like https-proxy-agent for Node.js
			console.warn('HTTPS proxy configured but not supported by fetch API directly');
		}

		return fetch(url, options);
	}

	/**
	 * Clean HTML tags and entities from text
	 */
	private cleanHTML(text: string): string {
		return text
			.replace(/<[^>]*>/g, '')
			.replace(/&quot;/g, '"')
			.replace(/&apos;/g, "'")
			.replace(/&amp;/g, '&');
	}

	/**
	 * Format results as a readable string
	 *
	 * @param results - Search results
	 * @param engine - Engine name
	 * @returns Formatted string
	 *
	 * @example
	 * ```typescript
	 * const formatted = client.formatResults(results, 'searxng');
	 * console.log(formatted);
	 * ```
	 */
	formatResults(results: SearchResult[], engine: string): string {
		if (results.length === 0) {
			return 'No results found. Try a different search query or engine.';
		}

		let output = `Search results (${engine}):\n\n`;

		for (const [index, result] of results.entries()) {
			output += `${index + 1}. ${result.title}\n`;
			output += `   URL: ${result.url}\n`;
			if (result.score !== undefined) {
				output += `   Score: ${result.score.toFixed(2)}\n`;
			}
			output += `   ${result.snippet}\n\n`;
		}

		return output.trim();
	}

	/**
	 * Get the current configuration
	 */
	getConfig(): Readonly<WebSearchConfig> {
		return { ...this.config };
	}
}

/**
 * Quick search function for simple use cases
 *
 * @param query - Search query
 * @param options - Optional configuration
 * @returns Array of search results
 *
 * @example
 * ```typescript
 * import { search } from './websearch.ts';
 *
 * const results = await search('latest Node.js version', {
 *   tavilyApiKey: process.env.TAVILY_API_KEY,
 *   maxResults: 5
 * });
 * ```
 */
export async function search(
	query: string,
	options: WebSearchConfig & { maxResults?: number; engine?: 'auto' | 'searxng' | 'tavily' } = {}
): Promise<SearchResult[]> {
	const { maxResults, engine, ...config } = options;
	const client = new WebSearchClient(config);
	return client.search({ query, maxResults, engine });
}

/**
 * Export types and utilities
 */
export type { WebSearchConfig };

// Node.js compatibility for environments without fetch
if (typeof globalThis.fetch === 'undefined') {
	// @ts-ignore - Polyfill for Node.js environments
	globalThis.fetch = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
		const nodeFetch = await import('node-fetch').catch(() => null);
		if (!nodeFetch) {
			throw new Error('fetch is not available. Please install node-fetch or use a runtime with fetch support.');
		}
		return nodeFetch.default(url, options);
	};
}
