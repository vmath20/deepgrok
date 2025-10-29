import { supabase, isSupabaseConfigured } from './supabase';

export interface CachedPage {
  url: string;
  markdown: string;
  title: string;
  cached_at: string;
  metadata?: any;
}

const CACHE_TTL_MS = 100 * 24 * 60 * 60 * 1000; // 100 days

/**
 * Get cached page from Supabase
 */
export async function getCachedPage(url: string): Promise<CachedPage | null> {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, skipping cache check');
    return null;
  }

  try {
    const { data, error } = await supabase!
      .from('cached_pages')
      .select('*')
      .eq('url', url)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        console.log('📭 Cache miss for:', url);
        return null;
      }
      throw error;
    }

    if (!data) {
      console.log('📭 Cache miss for:', url);
      return null;
    }

    // Check if cache is expired
    const cacheAge = Date.now() - new Date(data.cached_at).getTime();
    if (cacheAge > CACHE_TTL_MS) {
      console.log('⏰ Cache expired for:', url, `(${Math.round(cacheAge / 1000 / 60 / 60)}h old)`);
      // Delete expired entry
      await supabase!.from('cached_pages').delete().eq('url', url);
      return null;
    }

    console.log('✅ Cache hit for:', url, `(${Math.round(cacheAge / 1000 / 60)}m old)`);
    return data as CachedPage;
  } catch (err) {
    console.error('Error fetching from cache:', err);
    return null;
  }
}

/**
 * Store page in Supabase cache
 */
export async function setCachedPage(url: string, markdown: string, title: string, metadata?: any): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, skipping cache storage');
    return;
  }

  try {
    const { error } = await supabase!
      .from('cached_pages')
      .upsert({
        url,
        markdown,
        title,
        cached_at: new Date().toISOString(),
        metadata,
      }, {
        onConflict: 'url',
      });

    if (error) throw error;

    console.log('💾 Cached page:', url);
  } catch (err) {
    console.error('Error caching page:', err);
    // Don't throw - caching failure shouldn't break the request
  }
}

/**
 * Invalidate (delete) cached page
 */
export async function invalidateCachedPage(url: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase!.from('cached_pages').delete().eq('url', url);
    console.log('🗑️ Invalidated cache for:', url);
  } catch (err) {
    console.error('Error invalidating cache:', err);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{ total: number; size: number }> {
  if (!isSupabaseConfigured()) {
    return { total: 0, size: 0 };
  }

  try {
    const { count } = await supabase!
      .from('cached_pages')
      .select('*', { count: 'exact', head: true });

    return {
      total: count || 0,
      size: 0, // Could calculate total markdown size if needed
    };
  } catch (err) {
    console.error('Error getting cache stats:', err);
    return { total: 0, size: 0 };
  }
}


