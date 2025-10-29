import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Generate a unique visitor ID (stored in localStorage)
 */
function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  
  const key = 'deepgrok_visitor_id';
  let visitorId = localStorage.getItem(key);
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, visitorId);
  }
  
  return visitorId;
}

/**
 * Track a visitor (create or update their record)
 */
export async function trackVisitor(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, skipping analytics');
    return;
  }

  try {
    const visitorId = getVisitorId();
    const userAgent = navigator.userAgent;

    // Check if visitor exists
    const { data: existing } = await supabase!
      .from('visitor_analytics')
      .select('id, visit_count')
      .eq('visitor_id', visitorId)
      .single();

    if (existing) {
      // Update existing visitor
      await supabase!
        .from('visitor_analytics')
        .update({
          last_visit: new Date().toISOString(),
          visit_count: existing.visit_count + 1,
          user_agent: userAgent,
        })
        .eq('visitor_id', visitorId);
      
      console.log('📊 Updated visitor:', visitorId, '(visit', existing.visit_count + 1, ')');
    } else {
      // New visitor
      await supabase!
        .from('visitor_analytics')
        .insert({
          visitor_id: visitorId,
          first_visit: new Date().toISOString(),
          last_visit: new Date().toISOString(),
          visit_count: 1,
          user_agent: userAgent,
        });
      
      console.log('📊 New visitor tracked:', visitorId);
    }
  } catch (err) {
    console.error('Error tracking visitor:', err);
  }
}

/**
 * Get analytics stats
 */
export async function getAnalytics(): Promise<{
  totalUniqueVisitors: number;
  todayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
}> {
  if (!isSupabaseConfigured()) {
    return {
      totalUniqueVisitors: 0,
      todayVisitors: 0,
      thisWeekVisitors: 0,
      thisMonthVisitors: 0,
    };
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total unique visitors
    const { count: total } = await supabase!
      .from('visitor_analytics')
      .select('*', { count: 'exact', head: true });

    // Today's visitors
    const { count: today } = await supabase!
      .from('visitor_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('first_visit', todayStart.toISOString());

    // This week's visitors
    const { count: week } = await supabase!
      .from('visitor_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('first_visit', weekStart.toISOString());

    // This month's visitors
    const { count: month } = await supabase!
      .from('visitor_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('first_visit', monthStart.toISOString());

    return {
      totalUniqueVisitors: total || 0,
      todayVisitors: today || 0,
      thisWeekVisitors: week || 0,
      thisMonthVisitors: month || 0,
    };
  } catch (err) {
    console.error('Error getting analytics:', err);
    return {
      totalUniqueVisitors: 0,
      todayVisitors: 0,
      thisWeekVisitors: 0,
      thisMonthVisitors: 0,
    };
  }
}

