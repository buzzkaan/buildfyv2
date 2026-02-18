"use client"

import { motion } from "framer-motion"

interface BuildfyLogoProps {
  size?: number
  className?: string
  animate?: boolean
}

export function BuildfyLogo({ size = 40, className = "", animate = true }: BuildfyLogoProps) {
  const Wrapper = animate ? motion.div : "div"
  const wrapperProps = animate
    ? {
        initial: { rotate: -180, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1] as const },
      }
    : {}

  return (
    <Wrapper className={`inline-flex items-center justify-center ${className}`} {...wrapperProps}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 4L44 24L24 44L4 24L24 4Z" className="fill-accent" opacity="0.9" />
        <path d="M24 10L38 24L24 38L10 24L24 10Z" className="fill-accent/60" opacity="0.8" />
        <path d="M24 16L32 24L24 32L16 24L24 16Z" className="fill-accent" />
      </svg>
    </Wrapper>
  )
}
