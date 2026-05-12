"use client"

import Image from "next/image"
import { ImageOffIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

const isValidImageUrl = (src: string) => {
  try {
    const url = new URL(src)

    return url.protocol === "https:"
  } catch {
    return false
  }
}

export const ProductImage = ({
  src,
  alt,
  className,
  priority,
}: ProductImageProps) => {
  const [hasError, setHasError] = useState(false)
  const shouldShowImage = !hasError && isValidImageUrl(src)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (!shouldShowImage) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-muted text-muted-foreground">
        <ImageOffIcon className="h-6 w-6" />
        <span className="mt-2 text-xs">Sem imagem</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
