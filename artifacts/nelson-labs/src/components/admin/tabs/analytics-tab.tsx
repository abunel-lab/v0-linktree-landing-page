import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { getVisitorCount } from "@/lib/analytics"
import { getPlatformLabel } from "@/lib/platforms"
import { BarChart2, Eye, MousePointerClick, Loader2 } from "lucide-react"

interface ClickStat {
  link_type: string
  count: number
}

const CLICK_LABELS: Record<string, string> = {
  contact_whatsapp: "Contact Form",
}

function getLabel(linkType: string) {
  return CLICK_LABELS[linkType] ?? getPlatformLabel(linkType)
}

export function AnalyticsTab() {
  const [clickStats, setClickStats] = useState<ClickStat[]>([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const [{ data }, visitors] = await Promise.all([
      supabase.from("link_clicks").select("link_type"),
      getVisitorCount(),
    ])

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
    setTotalVisitors(visitors)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const maxCount = clickStats.length > 0 ? clickStats[0].count : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Analytics</h2>
            <p className="text-xs text-muted-foreground">Visitors & link clicks</p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-xs text-accent hover:underline px-2 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-xl px-4 py-4 space-y-1 border border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="w-3.5 h-3.5" />
                Total visitors
              </div>
              <p className="text-3xl font-bold text-foreground">
                {totalVisitors !== null ? totalVisitors.toLocaleString() : "—"}
              </p>
            </div>
            <div className="bg-muted/30 rounded-xl px-4 py-4 space-y-1 border border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MousePointerClick className="w-3.5 h-3.5" />
                Total clicks
              </div>
              <p className="text-3xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
            </div>
          </div>

          {clickStats.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <MousePointerClick className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground text-sm">No clicks recorded yet.</p>
              <p className="text-muted-foreground/60 text-xs">Clicks appear here once visitors start using your links.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">By link</p>
              {clickStats.map((stat) => {
                const pct = Math.round((stat.count / maxCount) * 100)
                return (
                  <div key={stat.link_type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">{getLabel(stat.link_type)}</span>
                      <span className="text-muted-foreground tabular-nums text-xs">
                        {stat.count.toLocaleString()} {stat.count === 1 ? "click" : "clicks"}
                      </span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
