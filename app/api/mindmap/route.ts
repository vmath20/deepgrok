import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { url, markdown } = await request.json();

    if (!url || !markdown) {
      return NextResponse.json(
        { error: 'URL and markdown are required' },
        { status: 400 }
      );
    }

    // Check cache first
    if (isSupabaseConfigured()) {
      const { data: cached } = await supabase!
        .from('cached_mindmaps')
        .select('mindmap_markdown')
        .eq('page_url', url)
        .single();

      if (cached?.mindmap_markdown) {
        console.log('📦 Returning cached mindmap for:', url);
        return NextResponse.json({ mindmap: cached.mindmap_markdown, cached: true });
      }
    }

    console.log('🧠 Generating mindmap with Gemini...');

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'DeepGrok',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'user',
            content: `Generate a hierarchical mindmap in standard markdown format for the following article. Use markdown headings (# ## ### ####) to show the hierarchy. Structure it to show the main topics and subtopics clearly. Only output the markdown, no explanations.

Example format:
# Main Topic
## Subtopic 1
### Detail A
### Detail B
## Subtopic 2
### Detail C

Article to analyze:

${markdown}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate mindmap', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const mindmapMarkdown = data.choices?.[0]?.message?.content || '';

    if (!mindmapMarkdown) {
      return NextResponse.json(
        { error: 'No mindmap generated' },
        { status: 500 }
      );
    }

    // Clean the response (remove markdown code blocks if present)
    let cleanedMindmap = mindmapMarkdown
      .replace(/^```markdown\n/, '')
      .replace(/^```\n/, '')
      .replace(/\n```$/, '')
      .trim();

    // Cache in Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase!
          .from('cached_mindmaps')
          .upsert({
            page_url: url,
            mindmap_markdown: cleanedMindmap,
            cached_at: new Date().toISOString(),
          }, {
            onConflict: 'page_url',
          });
        console.log('💾 Cached mindmap for:', url);
      } catch (err) {
        console.error('Error caching mindmap:', err);
      }
    }

    return NextResponse.json({ mindmap: cleanedMindmap, cached: false });
  } catch (error) {
    console.error('Error in mindmap API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

