import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialized Supabase client.
// This avoids crashing at build time when env vars aren't available.
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '⚠️ Supabase credentials not configured. Please update .env.local with your Supabase URL and Anon Key.'
    );
    // Return a dummy client that won't crash but will fail gracefully at runtime
    _supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
    return _supabase;
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

// Proxy object so all existing `import { supabase }` usage keeps working
// without needing to change any call sites.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Helper to get the current session
export async function getSession() {
  const {
    data: { session },
    error,
  } = await getSupabaseClient().auth.getSession();
  if (error) {
    console.error('Error fetching session:', error.message);
    return null;
  }
  return session;
}

// Helper to get the current user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
  return data;
}
