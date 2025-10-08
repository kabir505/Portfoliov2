import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vizvfwgcwmlwxbgotula.supabase.co"; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpenZmd2djd21sd3hiZ290dWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTI0NzIsImV4cCI6MjA3NTA4ODQ3Mn0.Ya-ek07ZefAFjI8ZOKH2NdwruoAjfVCkTvHNEg5wHuk";

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