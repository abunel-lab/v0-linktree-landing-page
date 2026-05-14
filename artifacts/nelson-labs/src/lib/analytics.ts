import { createClient } from "@/lib/supabase/client"

export async function trackClick(linkType: string) {
  try {
    const supabase = createClient()
    await supabase.from("link_clicks").insert({ link_type: linkType })
  } catch {
  }
}
