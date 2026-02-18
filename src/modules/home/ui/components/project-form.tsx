"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowUpIcon, Loader2Icon, SparklesIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTRPC } from "@/trpc/client"
import { cn } from "@/lib/utils"
import TextareaAutosize from "react-textarea-autosize"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PROJECT_TEMPLATES } from "../../constants"
import { BuildfyLogo } from "@/components/buildfy-logo"
import { SuggestionChips } from "@/components/suggestion-chips"

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(1000, { message: "Value is too long" }),
})

export const ProjectForm = () => {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [isFocused, setIsFocused] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  })

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions())
        queryClient.invalidateQueries(trpc.usage.status.queryOptions())
        router.push(`/projects/${data.id}`)
      },
      onError: (error) => {
        if (error?.data?.code === "UNAUTHORIZED") {
          toast.error("Please sign in to create a project")
          router.push("/sign-in")
          return
        }
        if (error?.data?.code === "TOO_MANY_REQUESTS") {
          toast.error(error.message)
          router.push("/pricing")
          return
        }
        toast.error(error.message)
      },
    }),
  )

  const isPending = createProject.isPending
  const isButtonDisabled = isPending || !form.formState.isValid

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({ value: values.value })
  }

  const handleEnhance = async () => {
    const current = form.getValues("value").trim()
    if (!current) return
    setIsEnhancing(true)
    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: current }),
      })
      const data = await res.json()
      if (data.enhanced) {
        form.setValue("value", data.enhanced, { shouldDirty: true, shouldValidate: true, shouldTouch: true })
      }
    } catch {
      toast.error("Failed to enhance prompt")
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleChipSelect = (label: string) => {
    const template = PROJECT_TEMPLATES.find((t) => t.title === label)
    const value = template?.prompt ?? label
    form.setValue("value", value, { shouldDirty: true, shouldValidate: true, shouldTouch: true })
  }

  return (
    <div className="flex flex-col gap-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border bg-background/60 backdrop-blur-sm transition-colors duration-200",
            isFocused ? "border-accent/60" : "border-border",
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <TextareaAutosize
                  {...field}
                  disabled={isPending}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  minRows={3}
                  maxRows={10}
                  placeholder="What would you like to build"
                  className="w-full resize-none bg-transparent px-4 pt-4 pb-12 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed border-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      form.handleSubmit(onSubmit)(e)
                    }
                  }}
                />
              </FormItem>
            )}
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BuildfyLogo size={16} animate={false} />
              <kbd className="inline-flex items-center gap-1 border border-border/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">
                <span>&#8984;</span>
                Enter
              </kbd>
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                to submit
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isPending || isEnhancing || !form.watch("value").trim()}
                title="Enhance prompt with AI"
                className="flex h-7 items-center gap-1.5 border border-border px-2.5 text-foreground/70 transition-all duration-200 hover:border-accent hover:text-accent disabled:opacity-30"
              >
                {isEnhancing ? (
                  <Loader2Icon className="h-3 w-3 animate-spin" />
                ) : (
                  <SparklesIcon className="h-3 w-3" />
                )}
                <span className="font-mono text-[9px] uppercase tracking-wider">
                  {isEnhancing ? "enhancing..." : "enhance"}
                </span>
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="flex h-7 w-7 items-center justify-center bg-accent text-accent-foreground transition-all duration-200 hover:bg-accent/80 disabled:opacity-30 disabled:bg-border disabled:text-muted-foreground"
              >
                {isPending ? (
                  <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </form>
      </Form>

      <SuggestionChips onSelect={handleChipSelect} />
    </div>
  )
}
