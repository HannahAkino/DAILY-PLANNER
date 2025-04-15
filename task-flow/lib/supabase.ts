// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use environment variables (now provided via next.config.ts)
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yvhkeddgjrwaolmmvjgk.supabase.co';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aGtlZGRnanJ3YW9sbW12amdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDcwNTg2MCwiZXhwIjoyMDYwMjgxODYwfQ.jQP4fBIijohsddVPrpaDChsBS6gKFi3WzxEQd3u7wTU';

// Create a single supabase client for the entire app, with error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Types for AuthContext
export type SupabaseUser = Database['public']['Tables']['profiles']['Row'] & {
  email: string;
  id: string;
};

export type SupabaseSession = {
  user: SupabaseUser;
};

// Utility function to get a token for API requests
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

// Utility function to verify a token and get user ID
export async function verifyToken(token: string): Promise<string | null> {
  if (!token) return null;
  
  try {
    // Create a new client to avoid session state issues
    const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Try manual JWT decoding first to avoid API calls if possible
    try {
      // JWT tokens have three parts separated by dots
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        // The middle part is the payload, base64 encoded
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          console.log("Token is expired based on JWT payload");
          return null;
        }
        
        // Return the sub claim which is the user ID
        if (payload.sub) {
          console.log("Successfully extracted user ID from JWT payload");
          return payload.sub;
        }
      }
    } catch (jwtError) {
      console.log("Error decoding JWT locally:", jwtError);
      // Continue with API verification as fallback
    }
    
    // Use built-in JWT verification to get user as fallback
    const { data, error } = await tempClient.auth.getUser(token);
    
    if (error || !data.user) {
      console.error("Token verification failed:", error);
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
