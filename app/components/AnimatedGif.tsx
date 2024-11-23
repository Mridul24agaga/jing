import Image from 'next/image'

interface AnimatedGifProps {
  src: string
  alt: string
  width: number
  height: number
}

export default function AnimatedGif({ src, alt, width, height }: AnimatedGifProps) {
  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="contain"
        unoptimized // This is important for GIFs to animate
      />
    </div>
  )
}

