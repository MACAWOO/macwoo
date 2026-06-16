export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body: Json
          category_id: string | null
          created_at: string | null
          date: string
          excerpt: string
          id: string
          image: string
          published: boolean
          read_time: string
          slug: string
          sort_order: number
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body?: Json
          category_id?: string | null
          created_at?: string | null
          date?: string
          excerpt?: string
          id?: string
          image?: string
          published?: boolean
          read_time?: string
          slug: string
          sort_order?: number
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: Json
          category_id?: string | null
          created_at?: string | null
          date?: string
          excerpt?: string
          id?: string
          image?: string
          published?: boolean
          read_time?: string
          slug?: string
          sort_order?: number
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'blog_posts_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      careers: {
        Row: {
          created_at: string | null
          department: string
          description: string | null
          experience: string
          id: string
          is_active: boolean
          location: string
          sort_order: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          description?: string | null
          experience?: string
          id?: string
          is_active?: boolean
          location?: string
          sort_order?: number
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          description?: string | null
          experience?: string
          id?: string
          is_active?: boolean
          location?: string
          sort_order?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          approach: string | null
          approach_paragraphs: string[] | null
          category_id: string | null
          challenge: string | null
          challenge_paragraphs: string[] | null
          client: string
          created_at: string | null
          date: string | null
          hero_image: string
          id: string
          image: string
          industry: string | null
          published: boolean
          results: Json | null
          results_summary: string | null
          services: string | null
          slug: string
          solution: string[] | null
          sort_order: number
          tagline: string | null
          tags: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          approach?: string | null
          approach_paragraphs?: string[] | null
          category_id?: string | null
          challenge?: string | null
          challenge_paragraphs?: string[] | null
          client: string
          created_at?: string | null
          date?: string | null
          hero_image?: string
          id?: string
          image?: string
          industry?: string | null
          published?: boolean
          results?: Json | null
          results_summary?: string | null
          services?: string | null
          slug: string
          solution?: string[] | null
          sort_order?: number
          tagline?: string | null
          tags?: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          approach?: string | null
          approach_paragraphs?: string[] | null
          category_id?: string | null
          challenge?: string | null
          challenge_paragraphs?: string[] | null
          client?: string
          created_at?: string | null
          date?: string | null
          hero_image?: string
          id?: string
          image?: string
          industry?: string | null
          published?: boolean
          results?: Json | null
          results_summary?: string | null
          services?: string | null
          slug?: string
          solution?: string[] | null
          sort_order?: number
          tagline?: string | null
          tags?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'case_studies_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      page_settings: {
        Row: {
          about_hero_image: string | null
          about_hero_video: string | null
          blog_hero_image: string | null
          blog_hero_video: string | null
          careers_hero_image: string | null
          careers_hero_video: string | null
          contact_hero_image: string | null
          contact_hero_video: string | null
          id: string
          index_hero_image: string | null
          index_hero_video: string | null
          services_branding_image: string | null
          services_marketing_image: string | null
          services_video_image: string | null
          services_video_showreel: string | null
          updated_at: string | null
        }
        Insert: {
          about_hero_image?: string | null
          about_hero_video?: string | null
          blog_hero_image?: string | null
          blog_hero_video?: string | null
          careers_hero_image?: string | null
          careers_hero_video?: string | null
          contact_hero_image?: string | null
          contact_hero_video?: string | null
          id?: string
          index_hero_image?: string | null
          index_hero_video?: string | null
          services_branding_image?: string | null
          services_marketing_image?: string | null
          services_video_image?: string | null
          services_video_showreel?: string | null
          updated_at?: string | null
        }
        Update: {
          about_hero_image?: string | null
          about_hero_video?: string | null
          blog_hero_image?: string | null
          blog_hero_video?: string | null
          careers_hero_image?: string | null
          careers_hero_video?: string | null
          contact_hero_image?: string | null
          contact_hero_video?: string | null
          id?: string
          index_hero_image?: string | null
          index_hero_video?: string | null
          services_branding_image?: string | null
          services_marketing_image?: string | null
          services_video_image?: string | null
          services_video_showreel?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category_id: string | null
          created_at: string | null
          date: string | null
          gallery_images: string[] | null
          hero_image: string
          id: string
          image: string
          industry: string | null
          published: boolean
          services: string | null
          slug: string
          sort_order: number
          story: string | null
          story_paragraphs: string[] | null
          subtitle: string
          tagline: string | null
          tags: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          date?: string | null
          gallery_images?: string[] | null
          hero_image?: string
          id?: string
          image?: string
          industry?: string | null
          published?: boolean
          services?: string | null
          slug: string
          sort_order?: number
          story?: string | null
          story_paragraphs?: string[] | null
          subtitle?: string
          tagline?: string | null
          tags?: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          date?: string | null
          gallery_images?: string[] | null
          hero_image?: string
          id?: string
          image?: string
          industry?: string | null
          published?: boolean
          services?: string | null
          slug?: string
          sort_order?: number
          story?: string | null
          story_paragraphs?: string[] | null
          subtitle?: string
          tagline?: string | null
          tags?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'portfolio_projects_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      site_media: {
        Row: {
          height: number | null
          id: string
          mime_type: string | null
          name: string
          size_bytes: number | null
          type: string
          uploaded_at: string | null
          url: string
          width: number | null
        }
        Insert: {
          height?: number | null
          id?: string
          mime_type?: string | null
          name: string
          size_bytes?: number | null
          type?: string
          uploaded_at?: string | null
          url: string
          width?: number | null
        }
        Update: {
          height?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          size_bytes?: number | null
          type?: string
          uploaded_at?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables']
    & DefaultSchema['Views'])
    ? (DefaultSchema['Tables']
      & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema['Enums']
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema['CompositeTypes']
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {}
  }
} as const
