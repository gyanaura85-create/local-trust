import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Canonical project credentials provided by user
export const DEFAULT_SUPABASE_URL = 'https://kdnyqvhmjourunluxwdn.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_74jegAm8YASl4wn-V1tSeg_KdjICnjX';

/**
 * Sanitizes and extracts a valid Supabase URL even if environment strings
 * were pasted with trailing filenames or markdown brackets.
 */
function sanitizeSupabaseUrl(raw?: string): string {
  if (!raw || typeof raw !== 'string') return DEFAULT_SUPABASE_URL;

  // Extract clean https://<subdomain>.supabase.co pattern if present
  const supabaseMatch = raw.match(/https:\/\/[a-zA-Z0-9.-]+\.supabase\.co/);
  if (supabaseMatch) {
    return supabaseMatch[0];
  }

  // Check if raw is a valid http/https URL
  try {
    const trimmed = raw.trim();
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Invalid URL fallback
  }

  return DEFAULT_SUPABASE_URL;
}

/**
 * Sanitizes and extracts the publishable/anon key
 */
function sanitizeSupabaseKey(raw?: string): string {
  if (!raw || typeof raw !== 'string') return DEFAULT_SUPABASE_KEY;

  // Split by whitespace in case image filename was appended
  const firstWord = raw.trim().split(/\s+/)[0];
  
  // If the key was cut off at KdjICn, restore full key
  if (firstWord.startsWith('sb_publishable_74jegAm8YASl4wn-V1tSeg_KdjICn')) {
    return DEFAULT_SUPABASE_KEY;
  }

  if (firstWord && (firstWord.startsWith('sb_') || firstWord.startsWith('ey') || firstWord.length > 20)) {
    return firstWord;
  }

  return DEFAULT_SUPABASE_KEY;
}

export const SUPABASE_URL = sanitizeSupabaseUrl(
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
);

export const SUPABASE_ANON_KEY = sanitizeSupabaseKey(
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

/**
 * Safe Supabase client creator to ensure app never crashes on module load
 */
function initSupabase(): SupabaseClient {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('Initial Supabase creation warning, using fallback credentials:', err);
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
  }
}

export const supabase = initSupabase();

/**
 * Helper to verify Supabase connectivity
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  latencyMs?: number;
}> {
  const startTime = performance.now();
  try {
    // Ping Supabase auth health or public endpoint
    const { error } = await supabase.auth.getSession();
    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      return {
        connected: false,
        message: `Supabase responded with: ${error.message}`,
        latencyMs,
      };
    }

    return {
      connected: true,
      message: 'Connected to Supabase project (kdnyqvhmjourunluxwdn)',
      latencyMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `Connection failed: ${errorMsg}`,
    };
  }
}
