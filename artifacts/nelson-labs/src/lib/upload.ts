import { createClient } from "@/lib/supabase/client"

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient()
  const rawExt = file.name.split(".").pop()
  const ext = rawExt && rawExt.length <= 5 ? rawExt : "jpg"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from("images")
    .upload(filename, file, { upsert: false, contentType: file.type })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from("images").getPublicUrl(filename)
  return data.publicUrl
}
