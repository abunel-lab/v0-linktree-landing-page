import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"
import { ImageField } from "@/components/admin/image-field"
import {
  Package, Plus, Trash2, Eye, EyeOff, Loader2, ChevronUp, ChevronDown
} from "lucide-react"

interface ProductsTabProps {
  products: Product[]
  onReload: () => void
}

function ProductRow({
  product,
  index,
  total,
  onDelete,
  onToggle,
  onMove,
  onUpdate,
}: {
  product: Product
  index: number
  total: number
  onDelete: (id: string) => void
  onToggle: (product: Product) => void
  onMove: (index: number, dir: "up" | "down") => void
  onUpdate: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [localProduct, setLocalProduct] = useState(product)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("products").update({
      title: localProduct.title,
      description: localProduct.description,
      url: localProduct.url,
      image_url: localProduct.image_url,
    }).eq("id", product.id)
    setSaving(false)
    setSaved(true)
    onUpdate()
    setTimeout(() => setSaved(false), 2000)
  }

  const updateLocal = (field: string, value: string) => {
    setLocalProduct((prev) => ({ ...prev, [field]: value || null }))
  }

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${product.active ? "border-border" : "border-border/40 opacity-60"}`}>
      <div className="flex items-center gap-2 p-3 bg-muted/20">
        <div className="flex flex-col gap-0.5">
          <button onClick={() => onMove(index, "up")} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onMove(index, "down")} disabled={index === total - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {localProduct.image_url && (
          <img src={localProduct.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{localProduct.title || "Untitled product"}</p>
          <p className="text-xs text-muted-foreground truncate">{localProduct.url || "No URL set"}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggle(product)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            {product.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-border space-y-3 bg-muted/10">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Title</label>
            <input
              type="text"
              value={localProduct.title}
              onChange={(e) => updateLocal("title", e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea
              value={localProduct.description || ""}
              onChange={(e) => updateLocal("description", e.target.value)}
              rows={2}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Link URL</label>
            <input
              type="url"
              value={localProduct.url}
              onChange={(e) => updateLocal("url", e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              inputMode="url"
            />
          </div>
          <ImageField
            label="Background Image"
            value={localProduct.image_url}
            fieldKey="image_url"
            placeholder="https://example.com/image.jpg"
            hint="Paste URL or upload from gallery. Image will be cropped 16:9."
            aspect={16 / 9}
            onChange={(_, value) => updateLocal("image_url", value)}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-accent text-background font-medium py-2 rounded-lg text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "Saved!" : "Save"}
          </button>
        </div>
      )}
    </div>
  )
}

export function ProductsTab({ products, onReload }: ProductsTabProps) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const sorted = [...products].sort((a, b) => a.position - b.position)

  const handleAdd = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return
    setAdding(true)
    const supabase = createClient()
    await supabase.from("products").insert({
      title: newTitle.trim(),
      url: newUrl.trim(),
      position: products.length,
      active: true,
    })
    setNewTitle("")
    setNewUrl("")
    setAdding(false)
    onReload()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from("products").delete().eq("id", id)
    onReload()
  }

  const handleToggle = async (product: Product) => {
    const supabase = createClient()
    await supabase.from("products").update({ active: !product.active }).eq("id", product.id)
    onReload()
  }

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sorted.length) return
    const supabase = createClient()
    const a = sorted[index]
    const b = sorted[targetIndex]
    await Promise.all([
      supabase.from("products").update({ position: b.position }).eq("id", a.id),
      supabase.from("products").update({ position: a.position }).eq("id", b.id),
    ])
    onReload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Package className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Products</h2>
          <p className="text-xs text-muted-foreground">Add unlimited products & links</p>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No products yet. Add your first one below.
          </div>
        )}
        {sorted.map((product, index) => (
          <ProductRow
            key={product.id}
            product={product}
            index={index}
            total={sorted.length}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onMove={handleMove}
            onUpdate={() => onReload()}
          />
        ))}
      </div>

      <div className="border border-dashed border-border rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add new product</p>
        <div className="space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Product title"
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://yourproduct.com"
            className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            inputMode="url"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={adding || !newTitle.trim() || !newUrl.trim()}
          className="w-full flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 text-sm"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Product
        </button>
        <p className="text-xs text-muted-foreground text-center">After adding, tap the arrow to expand and add image + description</p>
      </div>
    </div>
  )
}
