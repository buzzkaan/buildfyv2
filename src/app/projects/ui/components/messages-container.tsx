import { useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { MessageLoading } from "./message-loading";
import { Fragment } from "@/generated/prisma";
import { ElementInspector, ElementData } from "./element-inspector";
import { Button } from "@/components/ui/button";
import { MessageSquareTextIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
  selectedElement: ElementData | null;
  setSelectedElement: (element: ElementData | null) => void;
  showElementInspector: boolean;
  setShowElementInspector: (show: boolean) => void;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
  selectedElement,
  setSelectedElement,
  showElementInspector,
  setShowElementInspector,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastAssistantMessageIdRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      {
        projectId: projectId,
      },
      {
        refetchInterval: 5000,
      },
    ),
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT",
    );

    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id != lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }));
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
        // Switch back to chat after asking AI from inspector
        setShowElementInspector(false);
        setSelectedElement(null);
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "TOO_MANY_REQUESTS") router.push("/pricing");
      },
    }),
  );

  const handleAskAI = async (
    prompt: string,
    element: ElementData,
    model: "gpt-4.1" | "gpt-4o" | "gpt-4o-mini",
  ) => {
    const elementContext = [
      `[Element: <${element.tag}${element.id ? ` id="${element.id}"` : ""}${element.classList.length ? ` class="${element.classList.join(" ")}"` : ""}>]`,
      element.innerHTML ? `[HTML: ${element.innerHTML.slice(0, 500)}${element.innerHTML.length > 500 ? "…" : ""}]` : "",
      element.path ? `[Path: ${element.path}]` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const fullPrompt = `${prompt}\n\n${elementContext}`;

    await createMessage.mutateAsync({ value: fullPrompt, projectId, model });
  };

  const handleBackToChat = () => {
    setShowElementInspector(false);
    setSelectedElement(null);
  };

  const handleElementUpdate = (updates: Partial<ElementData>) => {
    window.postMessage({
      type: 'INSPECTOR_UPDATE',
      updates,
    }, '*');
  };

  if (showElementInspector) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-4 py-2.5 border-b border-border/40 flex items-center gap-x-2 bg-secondary/5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBackToChat}
            className="gap-x-1.5 font-mono text-[9px] uppercase tracking-wider h-7 px-2.5 border-border/50 hover:border-accent/40 hover:text-accent transition-colors"
          >
            <MessageSquareTextIcon className="h-3 w-3" />
            Back to Chat
          </Button>
        </div>
        <ElementInspector
          selectedElement={selectedElement}
          onUpdate={handleElementUpdate}
          onClose={handleBackToChat}
          onAskAI={handleAskAI}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
        <div className="py-4 space-y-1">
          {messages?.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              type={message.type}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() => {
                setActiveFragment(message.fragment);
              }}
            />
          ))}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="px-4 pb-4 pt-2">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
