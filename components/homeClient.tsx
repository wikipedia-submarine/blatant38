"use client"

import dynamic from "next/dynamic"

const ParallaxCircles = dynamic(
  () =>
    import("@/components/parallaxCircles").then((mod) => ({
      default: mod.ParallaxCircles,
    })),
  { ssr: false }
)

export function HomeClient() {
  return <ParallaxCircles />
}
