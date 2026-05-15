import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLocation } from "wouter"
import type { SiteSettings, SocialLink, Product } from "@/lib/types"
import { ProfileTab } from "@/components/admin/tabs/profile-tab"
import { SocialTab } from "@/components/admin/tabs/social-tab"
import { ProductsTab } from "@/components/admin/tabs/products-tab"
import { AnalyticsTab } from "@/components/admin/tabs/analytics-tab"
import {
  User, Share2, Package, BarChart2,
  LogOut, ExternalLink, Save, Loader2, Check
} from "lucide-react"

interface AdminDashboardProps {
  initialSettings: SiteSettings
  initialSocialLinks: SocialLink[]
  initialProducts: Product[]
  userEmail: string
}

type Tab = "profile" | "social" | "products" | "analytics"

const TABS = [
  { id: "profile" as Tab,   label: "Profile",   icon: User },
  { id: "social" as Tab,    label: "Social",    icon: Share2 },
  { id: "products" as Tab,  label: "Products",  icon: Package },
  { id: "analytics" as Tab, label: "Analytics", icon: BarChart2 },
]

export function AdminDashboard({
  initialSettings,
  initialSocialLinks,
  initialProducts,
  userEmail,
}: AdminDashboardProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [, setLocation] = useLocation()

  // Apply theme live as admin changes it
  useEffect(() => {
    if (settings.theme) {
      document.documentElement.setAttribute("data-theme", settings.theme)
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
  }, [settings.theme])

  const reloadSocialLinks = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("social_links").select("*").order("position")
    if (data) setSocialLinks(data as SocialLink[])
  }

  const reloadProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("products").select("*").order("position")
    if (data) setProducts(data as Product[])
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("site_settings").update({
      display_name: settings.display_name,
      bio: settings.bio,
      profile_image_url: settings.profile_image_url,
      whatsapp_number: settings.whatsapp_number,
      announcement_text: settings.announcement_text,
      announcement_active: settings.announcement_active,
      theme: settings.theme || "teal",
    }).eq("id", settings.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setLocation("/admin/login")
  }

  const updateField = (field: string, value: string | boolean | null) => {
    setSettings((prev) => ({ ...prev, [field]: value === "" ? null : value }))
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card/30 backdrop-blur-sm sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-background" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">Admin</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-accent text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="text-sm font-semibold text-foreground">Admin</span>
            </div>
            <div className="flex items-center gap-1">
              <a href="/" target="_blank" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-1 px-3 pb-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-accent text-background"
                    : "text-muted-foreground hover:text-foreground bg-muted/50"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-2xl w-full">
          <div className="bg-card/30 border border-border rounded-2xl p-5">
            {activeTab === "profile" && (
              <ProfileTab settings={settings} onChange={updateField} />
            )}
            {activeTab === "social" && (
              <SocialTab links={socialLinks} onReload={reloadSocialLinks} />
            )}
            {activeTab === "products" && (
              <ProductsTab products={products} onReload={reloadProducts} />
            )}
            {activeTab === "analytics" && (
              <AnalyticsTab />
            )}
          </div>

          {activeTab === "profile" && (
            <div className="mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-secondary text-background font-semibold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Saving...</>
                ) : saved ? (
                  <><Check className="w-5 h-5" />Saved!</>
                ) : (
                  <><Save className="w-5 h-5" />Save Changes</>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
