import { NextRequest, NextResponse } from 'next/server';
import { parseMarkdown } from '@/lib/markdown-parser';
import { cleanMarkdown } from '@/lib/markdown-cleaner';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limiter';
import { getCachedPage, setCachedPage } from '@/lib/page-cache';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientId = getClientIdentifier(request);
    const rateCheck = checkRateLimit(clientId);
    
    if (!rateCheck.allowed) {
      const resetInSeconds = Math.ceil(rateCheck.resetIn / 1000);
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${resetInSeconds} seconds.`,
          resetIn: resetInSeconds
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + rateCheck.resetIn).toISOString(),
          }
        }
      );
    }

    const { url, topic } = await request.json();

    if (!url && !topic) {
      return NextResponse.json(
        { error: 'Either url or topic is required' },
        { status: 400 }
      );
    }

    // Construct Grokipedia URL if topic is provided
    const targetUrl = url || `https://grokipedia.com/page/${encodeURIComponent(topic.replace(/\s+/g, '_'))}`;

    // Check cache first
    const cachedPage = await getCachedPage(targetUrl);
    if (cachedPage) {
      console.log('📦 Returning cached page');
      
      // Clean and parse cached markdown
      const markdown = cleanMarkdown(cachedPage.markdown);
      const parsedWiki = parseMarkdown(markdown);
      
      return NextResponse.json({
        ...parsedWiki,
        rawMarkdown: markdown,
        metadata: {
          source: targetUrl,
          lastUpdated: cachedPage.cached_at,
          scraped: false,
          cached: true,
        },
      });
    }

    console.log('🌐 Cache miss, scraping from Firecrawl...');

    // Call Firecrawl API
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    
    if (!firecrawlApiKey) {
      return NextResponse.json(
        { error: 'Firecrawl API key not configured' },
        { status: 500 }
      );
    }

    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url: targetUrl,
        formats: ['markdown'],
      }),
    });

    if (!firecrawlResponse.ok) {
      const errorData = await firecrawlResponse.json().catch(() => ({}));
      console.error('Firecrawl API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to scrape the page', details: errorData },
        { status: firecrawlResponse.status }
      );
    }

    const firecrawlData = await firecrawlResponse.json();
    const markdownRaw = firecrawlData.data?.markdown || firecrawlData.markdown || '';

    if (!markdownRaw) {
      return NextResponse.json(
        { error: 'No markdown content received from Firecrawl' },
        { status: 500 }
      );
    }

    // Clean markdown: remove UI strings and top TOC (but keep URLs at bottom for frontend processing)
    const markdown = cleanMarkdown(markdownRaw);

    // Parse the markdown into structured JSON
    const parsedWiki = parseMarkdown(markdown);

    // Add metadata - pass the cleaned markdown as rawMarkdown for frontend to process
    const wikiData = {
      ...parsedWiki,
      rawMarkdown: markdown, // Frontend will process references from this
      metadata: {
        source: targetUrl,
        lastUpdated: new Date().toISOString(),
        scraped: true,
        cached: false,
      },
    };

    // Cache the page for future requests
    await setCachedPage(targetUrl, markdownRaw, parsedWiki.title, {
      sections: parsedWiki.sections.length,
      tableOfContents: parsedWiki.tableOfContents.length,
    });

    return NextResponse.json(wikiData);
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const topic = searchParams.get('topic');

  if (!topic) {
    return NextResponse.json(
      { error: 'Topic parameter is required' },
      { status: 400 }
    );
  }

  // Forward to POST
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ topic }),
    })
  );
}

