"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"

export default function DrawArrows() {
  const containerRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  })

  // Line drawing animation
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Arrow fade in near end
  const opacity = useTransform(scrollYProgress, [0.7, 1], [0, 1])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-[300px] pointer-events-none"
      style={{ width: "100%", height: "300px" }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
      >
        {/* LEFT ARROW CURVE - starts from left edge of title, curves down */}
        <motion.path
          d="M100,40 C50,120 150,220 280,290"
          stroke="#4a5f7f"
          strokeWidth="3"
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength,
          }}
        />

        {/* RIGHT ARROW CURVE - starts from right edge of title, curves down */}
        <motion.path
          d="M900,40 C950,120 850,220 720,290"
          stroke="#4a5f7f"
          strokeWidth="3"
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength,
          }}
        />

        {/* LEFT ARROWHEAD */}
        <motion.polygon
          points="280,290 265,275 285,280"
          fill="#4a5f7f"
          style={{ opacity }}
        />

        {/* RIGHT ARROWHEAD */}
        <motion.polygon
          points="720,290 735,275 715,280"
          fill="#4a5f7f"
          style={{ opacity }}
        />
      </svg>
    </div>
  )
}
