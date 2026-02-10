"use client";

import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
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
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ProjectHeader projectId={projectId} />
          <Suspense fallback={<p>Loading...</p>}>
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
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAcces && (
                  <Button asChild size="sm" variant="tertiary">
                    <Link href="/pricing">
                      <CrownIcon />
                      Upgrade
                    </Link>
                  </Button>
                )}

                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
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
            <TabsContent value="code" className="min-h-0">
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
