import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProfileHeader } from "@/components/profile-header"
import { SocialIcons } from "@/components/social-icons"
import { ProductCard } from "@/components/product-card"
import { ContactForm } from "@/components/contact-form"
import { trackVisit, getVisitorCount } from "@/lib/analytics"
import type { SiteSettings, SocialLink, Product } from "@/lib/types"
import { Eye } from "lucide-react"

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [visitorCount, setVisitorCount] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient()

    Promise.all([
      supabase.from("site_settings").select("*").single(),
      supabase.from("social_links").select("*").order("position"),
      supabase.from("products").select("*").order("position"),
    ]).then(([settingsRes, socialRes, productsRes]) => {
      if (settingsRes.data) setSettings(settingsRes.data as SiteSettings)
      if (socialRes.data) setSocialLinks(socialRes.data as SocialLink[])
      if (productsRes.data) setProducts(productsRes.data as Product[])
    })

    trackVisit().then(() => getVisitorCount().then(setVisitorCount))
  }, [])

  const activeProducts = products.filter((p) => p.active).sort((a, b) => a.position - b.position)

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.18 0.03 250) 0%, oklch(0.12 0.02 250) 50%, oklch(0.08 0.015 250) 100%)",
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

          <SocialIcons links={socialLinks} />

          {activeProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}

          <ContactForm
            displayName={settings?.display_name || "Nelson_Labs"}
            whatsappNumber={settings?.whatsapp_number || "256709331135"}
          />

          <footer className="text-center pt-4 opacity-0 animate-fade-in delay-500 space-y-2">
            {visitorCount !== null && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50">
                <Eye className="w-3 h-3" />
                <span>
                  {visitorCount.toLocaleString()} {visitorCount === 1 ? "visit" : "visits"}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground/40">Powered by passion</p>
          </footer>
        </div>
      </main>
    </>
  )
}
