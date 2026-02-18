import Link from "next/link";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ChevronsDownIcon, Home, SunMoonIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
} from "@radix-ui/react-dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId }),
  );

  const { setTheme, theme } = useTheme();

  return (
    <div className="border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="focus-visible:ring-0 hover:bg-transparent hover:opacity-70 transition-opacity pl-0 gap-2 group"
            >
              {/* Live status dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="font-mono text-xs text-foreground font-medium tracking-tight">
                {project.name}
              </span>
              <ChevronsDownIcon className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="min-w-[160px]">
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home size={13} className="text-muted-foreground" />
                <span className="font-mono text-xs">Go to Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <SunMoonIcon className="size-3.5 text-muted-foreground" />
                <span className="font-mono text-xs">Appearance</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                      <span className="font-mono text-xs">Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <span className="font-mono text-xs">Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <span className="font-mono text-xs">System</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
      </div>

      {/* Breadcrumb */}
      <div className="px-4 pb-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/35 hover:text-accent transition-colors duration-200"
        >
          <Home className="h-2.5 w-2.5" />
          <span>Dashboard</span>
          <span className="text-muted-foreground/20">/</span>
          <span className="text-muted-foreground/50 truncate max-w-[120px]">{project.name}</span>
        </Link>
      </div>
    </div>
  );
};
