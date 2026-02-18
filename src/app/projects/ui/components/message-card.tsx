import { MessageType, Fragment, MessageRole } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { BuildfyLogo } from "@/components/buildfy-logo";

interface UserMessageProps {
    content: string;
}

interface AssistantMessageProps {
    content: string;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

interface FragmentCardProps {
    fragment: Fragment;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
    fragment,
    isActiveFragment,
    onFragmentClick
}: FragmentCardProps) => {
    return (
        <button
            className={cn(
                "group self-start flex items-center gap-2.5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 mt-2 w-full max-w-[260px]",
                isActiveFragment
                    ? "bg-accent/10 border border-accent/50 text-accent"
                    : "border border-border/50 text-muted-foreground hover:border-accent/40 hover:text-accent hover:bg-accent/5",
            )}
            onClick={() => onFragmentClick(fragment)}
        >
            <Code2Icon className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1 flex-1 text-left">{fragment.title}</span>
            <ChevronRightIcon className="h-2.5 w-2.5 shrink-0 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>
    );
};

const AssistantMessage = ({
    content,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
}: AssistantMessageProps) => {
    return (
        <div className={cn(
            "flex gap-3 px-4 py-3",
            type === "ERROR" && "text-red-700 dark:text-red-500",
        )}>
            {/* Avatar */}
            <div className="shrink-0 mt-0.5 flex items-center justify-center w-5 h-5">
                <BuildfyLogo size={18} animate={false} />
            </div>

            <div className="flex flex-col gap-2 min-w-0 flex-1">
                {/* Name + time */}
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold text-foreground uppercase tracking-wider">
                        Buildfy
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground/35 tabular-nums">
                        {format(createdAt, "HH:mm")}
                    </span>
                </div>

                {/* Content */}
                <p className={cn(
                    "font-mono text-sm leading-relaxed",
                    type === "ERROR"
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                )}>
                    {content}
                </p>

                {/* Fragment card */}
                {fragment && type === "RESULT" && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>
        </div>
    );
};

const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className="flex justify-end px-4 py-2">
            <div className="relative max-w-[82%]">
                {/* Corner accent */}
                <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent/40" />
                <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent/20" />

                <div className="border border-border/60 bg-secondary/20 px-4 py-3">
                    <p className="font-mono text-sm text-foreground leading-relaxed">{content}</p>
                </div>
            </div>
        </div>
    );
};

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

export const MessageCard = ({
    content,
    role,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type
}: MessageCardProps) => {
    if (role === "ASSISTANT") {
        return (
            <AssistantMessage
                content={content}
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        );
    }
    return <UserMessage content={content} />;
};
