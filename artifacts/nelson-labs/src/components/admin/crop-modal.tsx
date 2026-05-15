import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { X, Check, Loader2 } from "lucide-react"
import { uploadImage } from "@/lib/upload"

interface CropModalProps {
  src: string
  aspect?: number
  onDone: (url: string) => void
  onCancel: () => void
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  )
}

export function CropModal({ src, aspect, onDone, onCancel }: CropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      const initialAspect = aspect ?? 16 / 9
      setCrop(centerAspectCrop(width, height, initialAspect))
    },
    [aspect]
  )

  const getCroppedBlob = (): Promise<Blob | null> => {
    const image = imgRef.current
    if (!image || !completedCrop) return Promise.resolve(null)

    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    const ctx = canvas.getContext("2d")
    if (!ctx) return Promise.resolve(null)

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )

    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92))
  }

  const handleConfirm = async () => {
    setError(null)
    setUploading(true)
    try {
      const blob = await getCroppedBlob()
      if (!blob) {
        setError("Crop failed. Please try again.")
        setUploading(false)
        return
      }
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" })
      const url = await uploadImage(file)
      onDone(url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Crop Image</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {aspect === 1 ? "Drag to crop (square)" : "Drag to crop (16:9)"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex items-center justify-center bg-black/40 max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            ruleOfThirds
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{ maxWidth: "100%", maxHeight: "55vh", display: "block" }}
            />
          </ReactCrop>
        </div>

        {error && (
          <p className="text-xs text-red-400 px-5 pt-2">{error}</p>
        )}

        <div className="flex gap-3 p-4 border-t border-border">
          <button
            onClick={onCancel}
            disabled={uploading}
            className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={uploading || !completedCrop}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-background font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Use this crop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
