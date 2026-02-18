"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpIcon, Loader2Icon, ChevronDownIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import { Usage } from "./usage";
import { useRouter } from "next/navigation";
import { BuildfyLogo } from "@/components/buildfy-logo";

interface Props {
  projectId: string;
}

type ModelId = "gpt-4.1" | "gpt-4o" | "gpt-4o-mini";

const MODELS: { id: ModelId; label: string; desc: string }[] = [
  { id: "gpt-4.1",      label: "GPT-4.1",      desc: "Most capable" },
  { id: "gpt-4o",       label: "GPT-4o",        desc: "Balanced" },
  { id: "gpt-4o-mini",  label: "GPT-4o-mini",   desc: "Fastest" },
];

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedModel, setSelectedModel] = useState<ModelId>("gpt-4.1");
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  const { data: usage } = useQuery(trpc.usage.status.queryOptions());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  });

  // Close model menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setModelMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }));
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "TOO_MANY_REQUESTS") router.push("/pricing");
      },
    }),
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({ value: values.value, projectId, model: selectedModel });
  };

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = !!usage;
  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;
  const currentModel = MODELS.find((m) => m.id === selectedModel)!;

  return (
    <Form {...form}>
      {showUsage && (
        <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border border-border/60 bg-card/30 backdrop-blur-sm transition-colors duration-200",
          isFocused && "border-accent/40",
          showUsage && "border-t-0",
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
                minRows={2}
                maxRows={8}
                placeholder="What would you like to build"
                className="w-full resize-none bg-transparent px-4 pt-4 pb-10 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-relaxed border-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            </FormItem>
          )}
        />

        <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between">
          {/* Left: logo + model picker */}
          <div className="flex items-center gap-2">
            <BuildfyLogo size={16} animate={false} />

            {/* Model picker */}
            <div ref={modelMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setModelMenuOpen((v) => !v)}
                className="flex items-center gap-1 border border-border/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 hover:border-accent/40 hover:text-accent transition-colors"
              >
                {currentModel.label}
                <ChevronDownIcon className={cn("h-2.5 w-2.5 transition-transform", modelMenuOpen && "rotate-180")} />
              </button>

              {modelMenuOpen && (
                <div className="absolute bottom-full mb-1.5 left-0 z-50 border border-border/60 bg-card/95 backdrop-blur-sm shadow-lg min-w-[160px]">
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setSelectedModel(m.id); setModelMenuOpen(false); }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 font-mono text-[10px] hover:bg-secondary/50 transition-colors",
                        selectedModel === m.id ? "text-accent" : "text-muted-foreground",
                      )}
                    >
                      <span className="uppercase tracking-wider">{m.label}</span>
                      <span className="text-muted-foreground/50 normal-case tracking-normal ml-3">{m.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: hint + submit */}
          <div className="flex items-center gap-2">
            <kbd className="inline-flex items-center gap-1 border border-border/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
              ⌘ Enter
            </kbd>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="flex h-7 w-7 items-center justify-center border border-border/40 text-muted-foreground transition-all duration-200 hover:border-accent hover:text-accent disabled:opacity-20"
              aria-label="Submit"
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
  );
};
