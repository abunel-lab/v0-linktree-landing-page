import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProfileHeader } from "@/components/profile-header"
import { SocialIcons } from "@/components/social-icons"
import { ProductCard } from "@/components/product-card"
import { ContactForm } from "@/components/contact-form"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { trackVisit, getVisitorCount } from "@/lib/analytics"
import type { SiteSettings, SocialLink, Product } from "@/lib/types"
import { Eye } from "lucide-react"

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    Promise.allSettled([
      supabase.from("site_settings").select("*").single(),
      supabase.from("social_links").select("*").order("position"),
      supabase.from("products").select("*").order("position"),
    ]).then(([settingsRes, socialRes, productsRes]) => {
      if (settingsRes.status === "fulfilled" && settingsRes.value.data)
        setSettings(settingsRes.value.data as SiteSettings)
      if (socialRes.status === "fulfilled" && socialRes.value.data)
        setSocialLinks(socialRes.value.data as SocialLink[])
      if (productsRes.status === "fulfilled" && productsRes.value.data)
        setProducts(productsRes.value.data as Product[])
      setLoading(false)
    })

    trackVisit().then(() => getVisitorCount().then(setVisitorCount))
  }, [])

  // Apply theme to <html> whenever settings change
  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme)
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
  }, [settings?.theme])

  const activeProducts = products.filter((p) => p.active).sort((a, b) => a.position - b.position)

  // Fall back to site_settings featured card when products table is empty or not yet created
  const fallbackProduct: Product | null =
    activeProducts.length === 0 && settings !== null
      ? {
          id: "featured-fallback",
          title: settings.featured_title || "SMC Terminal",
          description: settings.featured_description || null,
          url: settings.featured_url || "#",
          image_url: settings.featured_image_url || "/images/product-hero.jpg",
          position: 0,
          active: true,
          created_at: "",
        }
      : null

  const displayProducts = activeProducts.length > 0 ? activeProducts : fallbackProduct ? [fallbackProduct] : []

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 -z-10 page-bg" aria-hidden="true" />
        <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-16">
          <div className="w-full max-w-md space-y-8 animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full bg-muted/40" />
              <div className="h-8 w-48 rounded-xl bg-muted/40" />
              <div className="h-4 w-64 rounded-lg bg-muted/30" />
            </div>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-muted/40" />
              ))}
            </div>
            <div className="h-64 rounded-2xl bg-muted/30" />
            <div className="h-48 rounded-2xl bg-muted/30" />
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="fixed inset-0 -z-10 page-bg" aria-hidden="true" />

      <AnnouncementBanner
        text={settings?.announcement_text || ""}
        active={settings?.announcement_active || false}
      />

      <main className="min-h-screen flex flex-col items-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md space-y-8">
          <ProfileHeader
            displayName={settings?.display_name || "Nelson_Labs"}
            bio={settings?.bio || "Building the future of trading"}
            profileImageUrl={settings?.profile_image_url}
          />

          <SocialIcons links={socialLinks} />

          {displayProducts.map((product, index) => (
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
            <p className="text-xs text-muted-foreground/40">Nelson_Labs</p>
          </footer>
        </div>
      </main>
    </>
  )
}
