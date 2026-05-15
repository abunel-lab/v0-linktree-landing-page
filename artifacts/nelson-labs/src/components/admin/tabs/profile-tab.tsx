import type { SiteSettings } from "@/lib/types"
import { ImageField } from "@/components/admin/image-field"
import { User, Megaphone, Palette, AlertTriangle } from "lucide-react"

interface ProfileTabProps {
  settings: SiteSettings
  onChange: (field: string, value: string | boolean | null) => void
}

const THEMES: { id: "teal" | "gold" | "purple"; label: string; primary: string; secondary: string; bg: string }[] = [
  { id: "teal",   label: "Teal",   primary: "#00C9A7", secondary: "#F97316", bg: "#0d1b2a" },
  { id: "gold",   label: "Gold",   primary: "#D4A017", secondary: "#B8820F", bg: "#1a1200" },
  { id: "purple", label: "Purple", primary: "#9F4CE8", secondary: "#E040A0", bg: "#130d1f" },
]

const SQL_MIGRATION = `ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS announcement_text  TEXT,
  ADD COLUMN IF NOT EXISTS announcement_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS theme              TEXT    DEFAULT 'teal';`

export function ProfileTab({ settings, onChange }: ProfileTabProps) {
  const currentTheme = settings.theme || "teal"
  const needsMigration = settings.announcement_active === undefined || settings.theme === undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <User className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Profile</h2>
          <p className="text-xs text-muted-foreground">Your public identity</p>
        </div>
      </div>

      {/* SQL migration notice */}
      {needsMigration && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Run this SQL in your Supabase SQL editor to enable Themes & Announcements
          </div>
          <pre className="text-xs text-amber-300/80 bg-black/30 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap select-all">
            {SQL_MIGRATION}
          </pre>
        </div>
      )}

      {/* Profile fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Display Name</label>
          <input
            type="text"
            value={settings.display_name}
            onChange={(e) => onChange("display_name", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="Your display name"
            autoComplete="off"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Bio / Tagline</label>
          <input
            type="text"
            value={settings.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="Short tagline shown under your name"
            autoComplete="off"
          />
        </div>

        <ImageField
          label="Profile Photo"
          value={settings.profile_image_url}
          fieldKey="profile_image_url"
          placeholder="https://example.com/photo.jpg"
          hint="Paste a URL or tap the upload icon to choose from your gallery. Photo will be cropped square."
          aspect={1}
          onChange={onChange}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
          <input
            type="tel"
            value={settings.whatsapp_number || ""}
            onChange={(e) => onChange("whatsapp_number", e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="256709331135"
            inputMode="numeric"
          />
          <p className="text-xs text-muted-foreground">Country code + number, no spaces or + sign.</p>
        </div>
      </div>

      {/* ── Theme picker ─────────────────────────────────────────────── */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">Page Theme</span>
        </div>
        <p className="text-xs text-muted-foreground">Changes the colour palette across your whole site.</p>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((theme) => {
            const isActive = currentTheme === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => onChange("theme", theme.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  isActive ? "border-accent scale-[1.03] shadow-lg" : "border-border/50 hover:border-border"
                }`}
              >
                {/* Colour preview swatch */}
                <div
                  className="h-16 w-full flex flex-col items-center justify-center gap-1.5"
                  style={{ background: theme.bg }}
                >
                  <div className="flex gap-1.5">
                    <span className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
                    <span className="w-4 h-4 rounded-full" style={{ background: theme.secondary }} />
                  </div>
                  <div
                    className="text-[10px] font-bold tracking-widest"
                    style={{ color: theme.primary }}
                  >
                    NL
                  </div>
                </div>
                <div className="py-1.5 text-center text-xs font-medium bg-muted/30 text-foreground">
                  {theme.label}
                </div>
                {isActive && (
                  <div
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-background text-[10px] font-bold"
                    style={{ background: theme.primary }}
                  >
                    ✓
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Announcement banner ───────────────────────────────────────── */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Announcement Banner</span>
          </div>
          {/* Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={settings.announcement_active || false}
            onClick={() => onChange("announcement_active", !settings.announcement_active)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              settings.announcement_active ? "bg-accent" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                settings.announcement_active ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Shows a dismissable top bar on your page. Visitors can close it — it reappears next session.
        </p>
        <input
          type="text"
          value={settings.announcement_text || ""}
          onChange={(e) => onChange("announcement_text", e.target.value)}
          placeholder="New course dropping Friday — join the waitlist"
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          disabled={!settings.announcement_active}
        />
        {settings.announcement_active && settings.announcement_text && (
          <div className="rounded-xl overflow-hidden border border-border/50">
            <div
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium"
              style={{
                background: "linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)",
                color: "var(--primary-foreground)",
              }}
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-center text-sm font-semibold">{settings.announcement_text}</span>
              <span className="opacity-60 text-xs">preview</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
