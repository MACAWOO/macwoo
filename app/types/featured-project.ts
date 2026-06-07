/**
 * Featured Project type — maps 1:1 to the `featured_projects` Supabase table.
 *
 * Table schema:
 *   id            BIGINT  PRIMARY KEY GENERATED ALWAYS AS IDENTITY
 *   title         TEXT    NOT NULL
 *   slug          TEXT    NOT NULL UNIQUE
 *   category      TEXT    NOT NULL
 *   image_path    TEXT    NOT NULL          -- relative path inside Supabase Storage bucket
 *   description   TEXT
 *   display_order INT     NOT NULL DEFAULT 0
 *   featured      BOOLEAN NOT NULL DEFAULT false
 *   created_at    TIMESTAMPTZ DEFAULT now()
 *   updated_at    TIMESTAMPTZ DEFAULT now()
 */
export interface FeaturedProject {
  id: number
  title: string
  slug: string
  category: string
  image_path: string
  description: string | null
  display_order: number
  featured: boolean
  created_at: string
  updated_at: string
}

/**
 * Resolved version with a full image URL ready for rendering.
 */
export interface ResolvedFeaturedProject extends FeaturedProject {
  image_url: string
}
