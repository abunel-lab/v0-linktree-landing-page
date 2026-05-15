import { createClient } from "@/lib/supabase/client"

export async function trackClick(linkType: string) {
  try {
    const supabase = createClient()
    await supabase.from("link_clicks").insert({ link_type: linkType })
  } catch {
  }
}

export async function trackVisit() {
  try {
    const supabase = createClient()
    await supabase.from("page_views").insert({})
  } catch {
  }
}

export async function getVisitorCount(): Promise<number> {
  try {
    const supabase = createClient()
    const { count } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
    return count ?? 0
  } catch {
    return 0
  }
}
