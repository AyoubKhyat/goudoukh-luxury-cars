import Image from "next/image";

/** Tiny 1x1 transparent PNG used as blur placeholder */
const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  priority = false,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  width,
  height,
  fill,
  quality = 80,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className={className}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      quality={quality}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
    />
  );
}
