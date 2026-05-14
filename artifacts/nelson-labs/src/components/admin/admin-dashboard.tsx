import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLocation } from "wouter"
import type { SiteSettings } from "@/lib/types"
import {
  User,
  Link,
  FileText,
  LogOut,
  Save,
  Loader2,
  Check,
  ExternalLink,
  Image as ImageIcon,
  BarChart2,
  MousePointerClick,
} from "lucide-react"

interface AdminDashboardProps {
  initialSettings: SiteSettings
  userEmail: string
}

interface ClickStat {
  link_type: string
  count: number
}

const LINK_LABELS: Record<string, string> = {
  x: "X (Twitter)",
  youtube: "YouTube",
  tiktok: "TikTok",
  website: "Website",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  featured: "SMC Terminal Card",
  contact_whatsapp: "Contact Form",
}

export function AdminDashboard({ initialSettings, userEmail }: AdminDashboardProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState<"profile" | "social" | "featured" | "analytics">("profile")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [, setLocation] = useLocation()
  const [clickStats, setClickStats] = useState<ClickStat[]>([])
  const [statsLoading, setStatsLoading] = useState(false)
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => {
    if (activeTab === "analytics") {
      loadAnalytics()
    }
  }, [activeTab])

  const loadAnalytics = async () => {
    setStatsLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("link_clicks")
      .select("link_type")

    if (data) {
      const counts: Record<string, number> = {}
      for (const row of data) {
        counts[row.link_type] = (counts[row.link_type] || 0) + 1
      }
      const stats = Object.entries(counts)
        .map(([link_type, count]) => ({ link_type, count }))
        .sort((a, b) => b.count - a.count)
      setClickStats(stats)
      setTotalClicks(data.length)
    }
    setStatsLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("site_settings")
      .update({
        display_name: settings.display_name,
        bio: settings.bio,
        profile_image_url: settings.profile_image_url,
        featured_title: settings.featured_title,
        featured_description: settings.featured_description,
        featured_url: settings.featured_url,
        featured_image_url: settings.featured_image_url,
        social_x: settings.social_x,
        social_youtube: settings.social_youtube,
        social_tiktok: settings.social_tiktok,
        social_website: settings.social_website,
        social_whatsapp: settings.social_whatsapp,
        social_telegram: settings.social_telegram,
        whatsapp_number: settings.whatsapp_number,
      })
      .eq("id", settings.id)

    setSaving(false)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setLocation("/admin/login")
  }

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value || null }))
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "social" as const, label: "Social", icon: Link },
    { id: "featured" as const, label: "Featured", icon: FileText },
    { id: "analytics" as const, label: "Analytics", icon: BarChart2 },
  ]

  const maxCount = clickStats.length > 0 ? clickStats[0].count : 1

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-background" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-foreground text-sm leading-tight">Admin Panel</h1>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-accent text-background shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-5">
          {activeTab === "profile" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-foreground">Profile Settings</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Display Name</label>
                  <input
                    type="text"
                    value={settings.display_name}
                    onChange={(e) => updateField("display_name", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                    placeholder="Your display name"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Bio / Tagline</label>
                  <input
                    type="text"
                    value={settings.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                    placeholder="Your tagline"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.profile_image_url || ""}
                    onChange={(e) => updateField("profile_image_url", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                    placeholder="https://example.com/photo.jpg"
                    autoComplete="off"
                    inputMode="url"
                  />
                  <p className="text-xs text-muted-foreground">Direct link to your profile image (JPG, PNG, WebP)</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={settings.whatsapp_number || ""}
                    onChange={(e) => updateField("whatsapp_number", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                    placeholder="256709331135"
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground">Country code + number, no spaces or + sign</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Social Media Links</h2>
                <p className="text-muted-foreground text-sm mt-1">Leave blank to hide a link.</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "X (Twitter)", field: "social_x" as const, placeholder: "https://x.com/yourusername" },
                  { label: "YouTube", field: "social_youtube" as const, placeholder: "https://youtube.com/@yourchannel" },
                  { label: "TikTok", field: "social_tiktok" as const, placeholder: "https://tiktok.com/@yourusername" },
                  { label: "Website", field: "social_website" as const, placeholder: "https://yourwebsite.com" },
                  { label: "WhatsApp (social link)", field: "social_whatsapp" as const, placeholder: "+256709331135" },
                  { label: "Telegram", field: "social_telegram" as const, placeholder: "https://t.me/yourusername" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">{label}</label>
                    <input
                      type="url"
                      value={settings[field] || ""}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                      placeholder={placeholder}
                      autoComplete="off"
                      inputMode="url"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "featured" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-foreground">Featured Card</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    value={settings.featured_title}
                    onChange={(e) => updateField("featured_title", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                    placeholder="Your Product Name"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={settings.featured_description}
                    onChange={(e) => updateField("featured_description", e.target.value)}
                    rows={3}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none text-base"
                    placeholder="Describe your product or service..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Link URL</label>
                  <input
                    type="url"
                    value={settings.featured_url}
                    onChange={(e) => updateField("featured_url", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                    placeholder="https://yourproduct.com"
                    autoComplete="off"
                    inputMode="url"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.featured_image_url || ""}
                    onChange={(e) => updateField("featured_image_url", e.target.value)}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
                    placeholder="https://example.com/image.jpg"
                    autoComplete="off"
                    inputMode="url"
                  />
                  <p className="text-xs text-muted-foreground">Leave blank to use the default gradient</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Link Analytics</h2>
                <button
                  onClick={loadAnalytics}
                  className="text-xs text-accent hover:underline"
                >
                  Refresh
                </button>
              </div>

              {statsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                </div>
              ) : clickStats.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <MousePointerClick className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-muted-foreground text-sm">No clicks recorded yet.</p>
                  <p className="text-muted-foreground/60 text-xs">Clicks will appear here once visitors start using your links.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total clicks</span>
                    <span className="text-2xl font-bold text-foreground">{totalClicks}</span>
                  </div>

                  <div className="space-y-3">
                    {clickStats.map((stat) => {
                      const pct = Math.round((stat.count / maxCount) * 100)
                      return (
                        <div key={stat.link_type} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">
                              {LINK_LABELS[stat.link_type] ?? stat.link_type}
                            </span>
                            <span className="text-muted-foreground tabular-nums">
                              {stat.count} {stat.count === 1 ? "click" : "clicks"}
                            </span>
                          </div>
                          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {activeTab !== "analytics" && (
          <div className="mt-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-secondary text-background font-semibold py-4 px-6 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
