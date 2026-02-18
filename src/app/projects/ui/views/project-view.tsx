"use client";

import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const MessagesSkeletonFallback = () => (
  <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
    <div className="flex-1 py-6 space-y-5 px-4 overflow-hidden">
      <div className="flex justify-end pr-2">
        <div className="h-10 w-3/4 bg-secondary/60 animate-pulse" />
      </div>
      <div className="px-2 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-[18px] w-[18px] rounded-full bg-secondary/60 animate-pulse" />
          <div className="h-3 w-14 bg-secondary/40 animate-pulse" />
        </div>
        <div className="pl-6 space-y-1.5">
          <div className="h-3 w-full bg-secondary/40 animate-pulse" />
          <div className="h-3 w-5/6 bg-secondary/30 animate-pulse" />
          <div className="h-3 w-3/4 bg-secondary/20 animate-pulse" />
        </div>
        <div className="pl-6">
          <div className="h-14 w-full bg-secondary/30 animate-pulse border border-border/30" />
        </div>
      </div>
      <div className="flex justify-end pr-2">
        <div className="h-8 w-2/3 bg-secondary/50 animate-pulse" />
      </div>
    </div>
    <div className="px-4 pb-4 pt-2">
      <div className="h-[72px] w-full bg-secondary/30 animate-pulse border border-border/40" />
    </div>
  </div>
);

import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { CodeIcon, CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";
import { UserControl } from "@/modules/home/ui/components/user-control";
import { useAuth } from "@clerk/nextjs";
import { ElementData } from "../components/element-inspector";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [showElementInspector, setShowElementInspector] = useState(false);

  const { has } = useAuth();
  const hasProAcces = has?.({ plan: "pro" });

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0 border-r border-border/40"
        >
          <ProjectHeader projectId={projectId} />
          <Suspense fallback={<MessagesSkeletonFallback />}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              showElementInspector={showElementInspector}
              setShowElementInspector={setShowElementInspector}
            />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle className="hover:bg-accent/30 transition-colors duration-200 w-px" />

        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            {/* Tab bar — underline style */}
            <div className="w-full flex items-center px-2 border-b border-border/40 bg-background">
              <TabsList className="h-10 p-0 bg-transparent border-none gap-0">
                <TabsTrigger
                  value="preview"
                  className="h-10 flex items-center gap-1.5 px-4 font-mono text-[10px] uppercase tracking-widest rounded-none border-none shadow-none bg-transparent text-muted-foreground/50 data-[state=active]:text-foreground data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-accent transition-all duration-150"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/50 data-[state=active]:bg-accent" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="h-10 flex items-center gap-1.5 px-4 font-mono text-[10px] uppercase tracking-widest rounded-none border-none shadow-none bg-transparent text-muted-foreground/50 data-[state=active]:text-foreground data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-accent transition-all duration-150"
                >
                  <CodeIcon className="h-3 w-3" />
                  Code
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-x-2 pr-1">
                {!hasProAcces && (
                  <Button
                    asChild
                    size="sm"
                    variant="tertiary"
                    className="font-mono text-[9px] uppercase tracking-wider h-7 px-2.5"
                  >
                    <Link href="/pricing">
                      <CrownIcon className="h-3 w-3" />
                      Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>

            <TabsContent value="preview" className="h-[calc(100%-41px)] mt-0">
              {!!activeFragment && (
                <FragmentWeb
                  data={activeFragment}
                  onElementSelected={(element) => {
                    setSelectedElement(element);
                    setShowElementInspector(true);
                  }}
                  onElementUpdated={setSelectedElement}
                />
              )}
            </TabsContent>
            <TabsContent value="code" className="h-[calc(100%-41px)] mt-0 min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
