import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { SocialLink } from "@/lib/types"
import { PLATFORMS, getPlatformIcon, getPlatformLabel } from "@/lib/platforms"
import {
  Share2, Plus, Trash2, GripVertical, Eye, EyeOff, Loader2, Check, ChevronUp, ChevronDown
} from "lucide-react"

interface SocialTabProps {
  links: SocialLink[]
  onReload: () => void
}

const PLATFORM_OPTIONS = Object.entries(PLATFORMS).map(([key, meta]) => ({
  value: key,
  label: meta.label,
}))

export function SocialTab({ links, onReload }: SocialTabProps) {
  const [saving, setSaving] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newPlatform, setNewPlatform] = useState("instagram")
  const [newLabel, setNewLabel] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const handleAdd = async () => {
    if (!newUrl.trim()) return
    setAdding(true)
    const supabase = createClient()
    const label = newLabel.trim() || getPlatformLabel(newPlatform)
    await supabase.from("social_links").insert({
      platform: newPlatform,
      label,
      url: newUrl.trim(),
      position: links.length,
      active: true,
    })
    setNewPlatform("instagram")
    setNewLabel("")
    setNewUrl("")
    setAdding(false)
    onReload()
  }

  const handleDelete = async (id: string) => {
    setSaving(id + "_del")
    const supabase = createClient()
    await supabase.from("social_links").delete().eq("id", id)
    setSaving(null)
    onReload()
  }

  const handleToggle = async (link: SocialLink) => {
    setSaving(link.id + "_toggle")
    const supabase = createClient()
    await supabase.from("social_links").update({ active: !link.active }).eq("id", link.id)
    setSaving(null)
    onReload()
  }

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newLinks = [...links]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newLinks.length) return

    const supabase = createClient()
    const a = newLinks[index]
    const b = newLinks[targetIndex]

    setSaving("move")
    await Promise.all([
      supabase.from("social_links").update({ position: b.position }).eq("id", a.id),
      supabase.from("social_links").update({ position: a.position }).eq("id", b.id),
    ])
    setSaving(null)
    onReload()
  }

  const handleUrlChange = async (id: string, url: string) => {
    const supabase = createClient()
    await supabase.from("social_links").update({ url }).eq("id", id)
    onReload()
  }

  const sorted = [...links].sort((a, b) => a.position - b.position)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Social Links</h2>
          <p className="text-xs text-muted-foreground">Add any platform — no limits</p>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No social links yet. Add your first one below.
          </div>
        )}
        {sorted.map((link, index) => {
          const Icon = getPlatformIcon(link.platform)
          const isSaving = saving === link.id + "_del" || saving === link.id + "_toggle" || saving === "move"
          return (
            <div
              key={link.id}
              className={`flex items-center gap-2 bg-muted/30 rounded-xl p-3 border transition-all ${
                link.active ? "border-border" : "border-border/40 opacity-50"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0 || !!saving}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(index, "down")}
                  disabled={index === sorted.length - 1 || !!saving}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-foreground" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{getPlatformLabel(link.platform)}</p>
                <input
                  type="url"
                  defaultValue={link.url}
                  onBlur={(e) => {
                    if (e.target.value !== link.url) handleUrlChange(link.id, e.target.value)
                  }}
                  className="w-full text-xs bg-transparent border-b border-border/50 focus:border-accent outline-none text-foreground py-0.5 transition-colors truncate"
                  inputMode="url"
                />
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(link)}
                  disabled={isSaving}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title={link.active ? "Hide" : "Show"}
                >
                  {isSaving && saving === link.id + "_toggle" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : link.active ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  disabled={isSaving}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Delete"
                >
                  {saving === link.id + "_del" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border border-dashed border-border rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add new link</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Platform</label>
            <select
              value={newPlatform}
              onChange={(e) => {
                setNewPlatform(e.target.value)
                setNewLabel("")
              }}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            >
              {PLATFORM_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Custom label (optional)</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={getPlatformLabel(newPlatform)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">URL</label>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            inputMode="url"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={adding || !newUrl.trim()}
          className="w-full flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Link
        </button>
      </div>
    </div>
  )
}
