import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

if (!useMock) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
}

// Export a single `supabase` binding — either a thin stub in mock mode or the real client.
// This keeps the module shape consistent and avoids invalid `export` usage inside blocks.
export const supabase = useMock
  ? ({} as any)
  : createClient<Database>(supabaseUrl!, supabaseAnonKey!);
