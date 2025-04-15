import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['logo.clearbit.com', 'randomuser.me'],
  },
  // Make Supabase credentials available as environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://yvhkeddgjrwaolmmvjgk.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aGtlZGRnanJ3YW9sbW12amdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDcwNTg2MCwiZXhwIjoyMDYwMjgxODYwfQ.jQP4fBIijohsddVPrpaDChsBS6gKFi3WzxEQd3u7wTU'
  },
};

export default nextConfig;
