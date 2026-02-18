"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { motion } from "framer-motion"

interface PromptInputProps {
  onSubmit?: (value: string) => void
}

export function PromptInput({ onSubmit }: PromptInputProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (value.trim() && onSubmit) {
        onSubmit(value.trim())
        setValue("")
      }
    }
  }

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim())
      setValue("")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative border border-border bg-card/50 backdrop-blur-sm transition-colors duration-200 focus-within:border-accent/50">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What would you like to build"
          rows={1}
          className="w-full resize-none bg-transparent px-5 pt-5 pb-12 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed"
        />
        <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <kbd className="inline-flex items-center gap-1 border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="text-[11px]">{"\u2318"}</span> Enter
            </kbd>
            <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
              to submit
            </span>
          </div>
          <button
            onClick={handleSubmit}
            className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-all duration-200 hover:border-accent hover:text-accent disabled:opacity-30"
            disabled={!value.trim()}
            aria-label="Submit prompt"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
