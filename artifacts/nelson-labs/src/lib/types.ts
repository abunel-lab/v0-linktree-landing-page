export interface SiteSettings {
  id: string
  display_name: string
  bio: string
  profile_image_url: string | null
  featured_title: string
  featured_description: string
  featured_url: string
  featured_image_url: string | null
  social_x: string | null
  social_youtube: string | null
  social_tiktok: string | null
  social_website: string | null
  social_whatsapp: string | null
  social_telegram: string | null
  whatsapp_number: string | null
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  platform: string
  label: string
  url: string
  position: number
  active: boolean
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string | null
  url: string
  image_url: string | null
  position: number
  active: boolean
  created_at: string
}
