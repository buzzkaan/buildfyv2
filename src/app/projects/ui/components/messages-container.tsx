import { useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { MessageLoading } from "./message-loading";
import { Fragment } from "@/generated/prisma";
import { ElementInspector, ElementData } from "./element-inspector";
import { Button } from "@/components/ui/button";
import { MessageSquareTextIcon } from "lucide-react";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastAssistantMessageIdRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      {
        projectId: projectId,
      },
      {
        //TODO : TEMPORARY FIX, IMPROVE WITH WEBSOCKETS LATER
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
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  const handleBackToChat = () => {
    setShowElementInspector(false);
    setSelectedElement(null);
  };

  const handleElementUpdate = (updates: Partial<ElementData>) => {
    // Send update to parent window (FragmentWeb will handle the iframe communication)
    window.postMessage({
      type: 'INSPECTOR_UPDATE',
      updates,
    }, '*');
  };

  if (showElementInspector) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-3 border-b flex items-center gap-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBackToChat}
            className="gap-x-2"
          >
            <MessageSquareTextIcon className="h-4 w-4" />
            Back to Chat
          </Button>
        </div>
        <ElementInspector
          selectedElement={selectedElement}
          onUpdate={handleElementUpdate}
          onClose={handleBackToChat}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
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
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b  from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
