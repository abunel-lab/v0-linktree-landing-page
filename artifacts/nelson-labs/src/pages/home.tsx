import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProfileHeader } from "@/components/profile-header"
import { SocialIcons } from "@/components/social-icons"
import { FeaturedCard } from "@/components/featured-card"
import { ContactForm } from "@/components/contact-form"
import type { SiteSettings } from "@/lib/types"

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("site_settings")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) setSettings(data as SiteSettings)
      })
  }, [])

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at top, oklch(0.18 0.03 250) 0%, oklch(0.12 0.02 250) 50%, oklch(0.08 0.015 250) 100%)"
        }}
        aria-hidden="true"
      />

      <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md space-y-8">
          <ProfileHeader
            displayName={settings?.display_name || "Nelson_Labs"}
            bio={settings?.bio || "Building the future of trading"}
            profileImageUrl={settings?.profile_image_url}
          />

          <SocialIcons
            socialX={settings?.social_x}
            socialYoutube={settings?.social_youtube}
            socialTiktok={settings?.social_tiktok}
            socialWebsite={settings?.social_website}
            socialWhatsapp={settings?.social_whatsapp}
            socialTelegram={settings?.social_telegram}
          />

          <FeaturedCard
            title={settings?.featured_title || "SMC TERMINAL"}
            description={settings?.featured_description || "Advanced Smart Money Concepts trading terminal."}
            url={settings?.featured_url || "#"}
            imageUrl={settings?.featured_image_url}
          />

          <ContactForm
            displayName={settings?.display_name || "Nelson_Labs"}
            whatsappNumber={settings?.whatsapp_number || "256709331135"}
          />

          <footer className="text-center pt-4 opacity-0 animate-fade-in delay-500">
            <p className="text-xs text-muted-foreground/60">
              Powered by passion
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
