import { ProfileHeader } from "@/components/profile-header"
import { SocialIcons } from "@/components/social-icons"
import { FeaturedCard } from "@/components/featured-card"
import { ContactForm } from "@/components/contact-form"
import { createClient } from "@/lib/supabase/server"
import type { SiteSettings } from "@/lib/types"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function LinkInBioPage() {
  const supabase = await createClient()
  
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single()

  const siteSettings = settings as SiteSettings | null

  return (
    <>
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />
      
      {/* Background gradient */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at top, oklch(0.18 0.03 250) 0%, oklch(0.12 0.02 250) 50%, oklch(0.08 0.015 250) 100%)"
        }}
        aria-hidden="true"
      />

      <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Profile Header */}
          <ProfileHeader 
            displayName={siteSettings?.display_name || "Nelson_Labs"}
            bio={siteSettings?.bio || "Building the future of trading"}
            profileImageUrl={siteSettings?.profile_image_url}
          />

          {/* Social Icons */}
          <SocialIcons 
            socialX={siteSettings?.social_x}
            socialYoutube={siteSettings?.social_youtube}
            socialTiktok={siteSettings?.social_tiktok}
            socialWebsite={siteSettings?.social_website}
            socialWhatsapp={siteSettings?.social_whatsapp}
            socialTelegram={siteSettings?.social_telegram}
          />

          {/* Featured Card */}
          <FeaturedCard 
            title={siteSettings?.featured_title || "SMC TERMINAL"}
            description={siteSettings?.featured_description || "Advanced Smart Money Concepts trading terminal."}
            url={siteSettings?.featured_url || "#"}
            imageUrl={siteSettings?.featured_image_url}
          />

          {/* Contact Form */}
          <ContactForm 
            displayName={siteSettings?.display_name || "Nelson_Labs"}
            whatsappNumber={siteSettings?.whatsapp_number || "256709331135"}
          />

          {/* Footer */}
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
