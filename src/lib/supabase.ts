import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'pocketide-1.0.0'
    }
  }
})

// Export types for database tables
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          user_id: string
          repository_url: string | null
          is_public: boolean
          language: string | null
          template: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
          repository_url?: string | null
          is_public?: boolean
          language?: string | null
          template?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
          repository_url?: string | null
          is_public?: boolean
          language?: string | null
          template?: string | null
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          name: string
          path: string
          content: string
          language: string
          created_at: string
          updated_at: string
          size: number
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          path: string
          content: string
          language: string
          created_at?: string
          updated_at?: string
          size?: number
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          path?: string
          content?: string
          language?: string
          created_at?: string
          updated_at?: string
          size?: number
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          project_id: string
          file_path: string
          cursor_position: number
          scroll_position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          file_path: string
          cursor_position?: number
          scroll_position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          file_path?: string
          cursor_position?: number
          scroll_position?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}