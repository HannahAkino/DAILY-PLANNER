// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = 'https://yvhkeddgjrwaolmmvjgk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aGtlZGRnanJ3YW9sbW12amdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDcwNTg2MCwiZXhwIjoyMDYwMjgxODYwfQ.jQP4fBIijohsddVPrpaDChsBS6gKFi3WzxEQd3u7wTU';

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Types for AuthContext
export type SupabaseUser = Database['public']['Tables']['profiles']['Row'] & {
  email: string;
  id: string;
};

export type SupabaseSession = {
  user: SupabaseUser;
};
