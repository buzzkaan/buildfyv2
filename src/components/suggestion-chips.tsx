"use client"

import { motion } from "framer-motion"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { PROJECT_TEMPLATES } from "@/modules/home/constants"

interface SuggestionChipsProps {
  onSelect?: (label: string) => void
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto mt-8"
    >
      {PROJECT_TEMPLATES.map((template, index) => (
        <motion.button
          key={template.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + index * 0.05, duration: 0.3 }}
          onClick={() => onSelect?.(template.title)}
          className="group flex items-center gap-2 border border-border/60 px-4 py-2 font-mono text-xs text-muted-foreground transition-all duration-200 hover:border-accent/50 hover:text-foreground"
        >
          <span className="text-sm" role="img" aria-hidden="true">
            {template.emoji}
          </span>
          <ScrambleTextOnHover text={template.title} duration={0.4} />
        </motion.button>
      ))}
    </motion.div>
  )
}
