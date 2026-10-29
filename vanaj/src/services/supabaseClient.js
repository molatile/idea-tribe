import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in Vite (import.meta.env) or Node.js (process.env)
const getEnvVar = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

// Get and sanitize environment variables
const rawUrl = (getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL') || '').trim();
// Strip any trailing /rest/v1 or /rest/v1/ in case it was passed
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

export const supabaseAnonKey = (
  getEnvVar('VITE_SUPABASE_ANON_KEY') || 
  getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') || 
  getEnvVar('SUPABASE_ANON_KEY') ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client instance (or null if unconfigured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Health check to verify connection to Supabase and whether the feedback table exists
 */
export async function checkSupabaseFeedbackHealth() {
  if (!isSupabaseConfigured || !supabase) {
    return { configured: false, tableReady: false, error: 'Environment variables not configured' };
  }

  try {
    const { error } = await supabase
      .from('feedback')
      .select('id')
      .limit(1);

    if (error) {
      // PGRST205 indicates table doesn't exist yet in PostgreSQL schema cache
      if (error.code === 'PGRST205') {
        return { 
          configured: true, 
          tableReady: false, 
          error: 'Feedback table not found in Supabase. Please run the SQL schema script.' 
        };
      }
      return { configured: true, tableReady: false, error: error.message };
    }

    return { configured: true, tableReady: true, error: null };
  } catch (err) {
    return { configured: true, tableReady: false, error: err.message };
  }
}
