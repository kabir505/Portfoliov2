// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Read env vars (must start with VITE_ for Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] URL =', supabaseUrl)
  console.error('[Supabase] ANON =', supabaseKey ? 'loaded' : 'missing')
  throw new Error(
    'Supabase URL and Anon Key are required. Check your .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) and restart the dev server.'
  )
}

// Create and export the client
export const supabase = createClient(supabaseUrl, supabaseKey)
