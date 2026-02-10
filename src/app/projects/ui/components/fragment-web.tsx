"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon, Edit3Icon, EyeIcon, SaveIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ElementData } from "./element-inspector";

interface Props {
  data: Fragment;
  onElementSelected?: (element: ElementData) => void;
  onElementUpdated?: (element: ElementData) => void;
}

export const FragmentWeb = ({ data, onElementSelected, onElementUpdated }: Props) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editModeReady, setEditModeReady] = useState(false);
  const [pendingHTMLSave, setPendingHTMLSave] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
    setEditModeReady(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    // Refresh iframe to apply/remove edit mode
    setFragmentKey((prev) => prev + 1);
    setEditModeReady(false);
  };

  // Get iframe URL with edit mode parameter
  const getIframeUrl = () => {
    if (!data.sandboxUrl) return '';
    const url = new URL(data.sandboxUrl);
    if (editMode) {
      url.searchParams.set('__edit_mode__', 'true');
    }
    return url.toString();
  };

  // Listen for messages from iframe and inspector
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Messages from iframe
      if (event.source === iframeRef.current?.contentWindow) {
        console.log('[FragmentWeb] Message from iframe:', event.data.type);

        switch (event.data.type) {
          case "EDIT_MODE_READY":
            console.log('[FragmentWeb] Edit mode ready!');
            setEditModeReady(true);
            break;

          case "ELEMENT_SELECTED":
            console.log('[FragmentWeb] Element selected:', event.data.data);
            if (onElementSelected) {
              onElementSelected(event.data.data);
            }
            break;

          case "ELEMENT_UPDATED":
            console.log('[FragmentWeb] Element updated:', event.data.data);
            if (onElementUpdated) {
              onElementUpdated(event.data.data);
            }
            break;

          case "HTML_RESPONSE":
            console.log('[FragmentWeb] HTML received from iframe');
            setPendingHTMLSave(event.data.html);
            break;
        }
      }

      // Messages from inspector (via MessagesContainer)
      if (event.data.type === 'INSPECTOR_UPDATE') {
        console.log('[FragmentWeb] Inspector update:', event.data.updates);
        handleElementUpdate(event.data.updates);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onElementSelected, onElementUpdated]);

  // Send updates to iframe
  const handleElementUpdate = (updates: Partial<ElementData>) => {
    if (!iframeRef.current?.contentWindow) {
      console.warn('[FragmentWeb] No iframe contentWindow available');
      return;
    }

    console.log('[FragmentWeb] Sending update to iframe:', updates);
    iframeRef.current.contentWindow.postMessage(
      {
        type: "UPDATE_ELEMENT",
        updates,
      },
      "*"
    );
  };

  const handleSaveChanges = () => {
    if (!iframeRef.current?.contentWindow || !data.sandboxId) {
      console.error("Cannot save: missing iframe or sandbox ID");
      return;
    }

    // Request HTML from iframe via postMessage
    console.log('[FragmentWeb] Requesting HTML from iframe');
    iframeRef.current.contentWindow.postMessage(
      { type: 'GET_HTML' },
      '*'
    );
  };

  // Process HTML when received from iframe
  useEffect(() => {
    if (!pendingHTMLSave) return;

    const saveHTML = async () => {
      try {
        const updatedHTML = pendingHTMLSave;

        // Extract body content for JSX
        const bodyMatch = updatedHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : updatedHTML;

        // Get current files
        const files = data.files as { [path: string]: string };

        // Find the main page file (could be page.tsx, page.js, etc.)
        const pageFile = Object.keys(files).find(
          path => path.includes('page.tsx') || path.includes('page.js')
        );

        if (!pageFile) {
          throw new Error("Could not find page file to update");
        }

        // For now, we'll store the HTML as a comment in the file
        // A more sophisticated approach would parse and update the JSX
        const updatedFiles = {
          ...files,
          '__edited_html__.html': updatedHTML,
          // You can uncomment this to update the actual page file
          // [pageFile]: updatePageFileContent(files[pageFile], bodyContent)
        };

        // Call API to update sandbox
        const response = await fetch('/api/update-sandbox', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fragmentId: data.id,
            sandboxId: data.sandboxId,
            files: updatedFiles,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to update sandbox');
        }

        const result = await response.json();
        console.log('[FragmentWeb] Save successful:', result);
        alert('Changes saved successfully!');

        // Clear pending HTML
        setPendingHTMLSave(null);

        // Optionally refresh the preview
        onRefresh();
      } catch (error) {
        console.error("Error saving changes:", error);
        alert('Failed to save changes. See console for details.');
        setPendingHTMLSave(null);
      }
    };

    saveHTML();
  }, [pendingHTMLSave, data.files, data.id, data.sandboxId, onRefresh]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Hint
          text={editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          side="bottom"
          align="start"
        >
          <Button
            size="sm"
            variant={editMode ? "default" : "outline"}
            onClick={toggleEditMode}
          >
            {editMode ? <EyeIcon /> : <Edit3Icon />}
          </Button>
        </Hint>

        {editMode && (
          <Hint text="Save Changes" side="bottom" align="start">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveChanges}
              disabled={!editModeReady}
            >
              <SaveIcon />
            </Button>
          </Hint>
        )}

        <Hint text="Click to copy sandbox URL" side="bottom">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 justify-start text-sm font-normal"
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>

        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>

      <iframe
        ref={iframeRef}
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={getIframeUrl()}
      />
    </div>
  );
};
