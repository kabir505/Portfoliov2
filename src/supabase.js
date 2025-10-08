import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vizvfwgcwmlwxbgotula.supabase.co"; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_dwASLpM64CaKfB48NAWDJA_TkGiK7EN";

// Create a mock supabase client if environment variables are missing
let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase not configured, using mock client");
  
  // Create a mock supabase client that returns empty data
  supabase = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null })
      })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };