import { useRef, useState } from "react"
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react"
import { CropModal } from "@/components/admin/crop-modal"

interface ImageFieldProps {
  label: string
  value: string | null
  fieldKey: string
  placeholder: string
  hint: string
  aspect?: number
  onChange: (field: string, value: string) => void
}

export function ImageField({ label, value, fieldKey, placeholder, hint, aspect, onChange }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(file)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleCropDone = (url: string) => {
    setCropSrc(null)
    onChange(fieldKey, url)
  }

  const handleCropCancel = () => {
    setCropSrc(null)
  }

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          aspect={aspect}
          onDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {label}
        </label>

        {value && (
          <div className="relative w-full h-24 rounded-xl overflow-hidden border border-border">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(fieldKey, "")}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-base"
            placeholder={placeholder}
            autoComplete="off"
            inputMode="url"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="shrink-0 flex items-center gap-1.5 bg-muted/50 border border-border hover:bg-muted hover:border-accent/50 text-muted-foreground hover:text-foreground px-3 py-3 rounded-xl transition-all disabled:opacity-50"
            title="Upload from gallery"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {uploadError ? (
          <p className="text-xs text-red-400">{uploadError}. Make sure your Supabase "images" storage bucket exists and is public.</p>
        ) : (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </>
  )
}
