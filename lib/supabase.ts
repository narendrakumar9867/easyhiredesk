import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

// Client-side supabase client (for components)
export const createClient = () => createClientComponentClient();

// Server-side supabase client (for API routes and server components)
export const createServerClient = () => createServerComponentClient({ cookies });

// Default client export for backward compatibility
export const supabase = createClientComponentClient();

// Database types (you can generate these later)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};