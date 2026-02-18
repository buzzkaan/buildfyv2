"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, EyeIcon, SaveIcon, RotateCcw, Pencil, PowerIcon, Loader2Icon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ElementData } from "./element-inspector";

const IframeLoadingOverlay = () => (
  <>
    <style>{`
      @keyframes iframeScan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(700%); }
      }
      @keyframes iframeSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes iframeBounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
        40% { transform: translateY(-5px); opacity: 1; }
      }
      @keyframes iframeGlow {
        0%, 100% { box-shadow: 0 0 20px oklch(from var(--accent) l c h / 0.0); }
        50% { box-shadow: 0 0 40px oklch(from var(--accent) l c h / 0.12); }
      }
      .iframe-scan { animation: iframeScan 5s linear infinite; }
      .iframe-spin { animation: iframeSpin 1.4s linear infinite; border-top-color: var(--accent) !important; }
      .iframe-glow { animation: iframeGlow 3s ease-in-out infinite; }
      .iframe-d1 { animation: iframeBounce 1.2s ease-in-out infinite; animation-delay: 0ms; }
      .iframe-d2 { animation: iframeBounce 1.2s ease-in-out infinite; animation-delay: 180ms; }
      .iframe-d3 { animation: iframeBounce 1.2s ease-in-out infinite; animation-delay: 360ms; }
    `}</style>
    <div
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-background"
      style={{
        backgroundImage: [
          "linear-gradient(var(--border) 1px, transparent 1px)",
          "linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "48px 48px",
      }}
    >
      {/* Darken grid so it's subtle */}
      <div className="absolute inset-0 bg-background/75" />

      {/* Scanline sweep */}
      <div
        className="iframe-scan absolute left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(from var(--accent) l c h / 0.07), transparent)",
        }}
      />

      {/* Card */}
      <div
        className="iframe-glow relative z-20 flex flex-col items-center gap-6 px-10 py-8 border border-border/60 bg-background/95"
      >
        {/* Spinner rings */}
        <div className="relative w-16 h-16">
          {/* Static outer */}
          <div className="absolute inset-0 rounded-full border border-border/30" />
          {/* Spinning accent */}
          <div
            className="iframe-spin absolute inset-0 rounded-full border-2 border-transparent"
            style={{ borderTopColor: "var(--accent)" }}
          />
          {/* Middle static */}
          <div className="absolute inset-[5px] rounded-full border border-border/20" />
          {/* Inner spinning (slower, reverse) */}
          <div
            className="absolute inset-[5px] rounded-full border border-transparent"
            style={{
              borderBottomColor: "var(--accent)",
              opacity: 0.4,
              animation: "iframeSpin 2.2s linear infinite reverse",
            }}
          />
          {/* Center */}
          <div
            className="absolute inset-[11px] rounded-full"
            style={{ backgroundColor: "var(--accent)", opacity: 0.15 }}
          />
        </div>

        {/* Labels */}
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Initializing preview
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="iframe-d1 block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="iframe-d2 block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="iframe-d3 block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>
        </div>
      </div>
    </div>
  </>
);

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
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [isRestarting, setIsRestarting] = useState(false);
  const [overrideSandboxUrl, setOverrideSandboxUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Re-show loading overlay each time the iframe reloads
  useEffect(() => {
    setIsIframeLoading(true);
  }, [fragmentKey]);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
    setEditModeReady(false);
  };

  const handleCopy = () => {
    if (!activeSandboxUrl) return;
    navigator.clipboard.writeText(activeSandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    setFragmentKey((prev) => prev + 1);
    setEditModeReady(false);
  };

  const activeSandboxUrl = overrideSandboxUrl ?? data.sandboxUrl;

  const getIframeUrl = () => {
    if (!activeSandboxUrl) return '';
    const url = new URL(activeSandboxUrl);
    if (editMode) {
      url.searchParams.set('__edit_mode__', 'true');
    }
    return url.toString();
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    setIsIframeLoading(true);
    try {
      const res = await fetch('/api/restart-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragmentId: data.id }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed');
      setOverrideSandboxUrl(result.sandboxUrl);
      setFragmentKey((prev) => prev + 1);
      setEditModeReady(false);
      toast.success('Sandbox restarted');
    } catch (err) {
      toast.error('Could not restart sandbox');
      setIsIframeLoading(false);
    } finally {
      setIsRestarting(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow) {
        switch (event.data.type) {
          case "EDIT_MODE_READY":
            setEditModeReady(true);
            break;
          case "ELEMENT_SELECTED":
            if (onElementSelected) {
              onElementSelected(event.data.data);
            }
            break;
          case "ELEMENT_UPDATED":
            if (onElementUpdated) {
              onElementUpdated(event.data.data);
            }
            break;
          case "HTML_RESPONSE":
            setPendingHTMLSave(event.data.html);
            break;
        }
      }

      if (event.data.type === 'INSPECTOR_UPDATE') {
        handleElementUpdate(event.data.updates);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onElementSelected, onElementUpdated]);

  const handleElementUpdate = (updates: Partial<ElementData>) => {
    if (!iframeRef.current?.contentWindow) {
      return;
    }
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
    iframeRef.current.contentWindow.postMessage(
      { type: 'GET_HTML' },
      '*'
    );
  };

  useEffect(() => {
    if (!pendingHTMLSave) return;

    const saveHTML = async () => {
      try {
        const updatedHTML = pendingHTMLSave;
        const bodyMatch = updatedHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : updatedHTML;
        const files = data.files as { [path: string]: string };
        const pageFile = Object.keys(files).find(
          path => path.includes('page.tsx') || path.includes('page.js')
        );

        if (!pageFile) {
          throw new Error("Could not find page file to update");
        }

        const updatedFiles = {
          ...files,
          '__edited_html__.html': updatedHTML,
        };

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
        toast.success('Changes saved successfully!');
        setPendingHTMLSave(null);
        onRefresh();
      } catch (error) {
        console.error("Error saving changes:", error);
        toast.error('Failed to save changes.');
        setPendingHTMLSave(null);
      }
    };

    saveHTML();
  }, [pendingHTMLSave, data.files, data.id, data.sandboxId, onRefresh]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Address bar — browser-style */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/40 bg-background">
        {/* Reload */}
        <button
          onClick={onRefresh}
          disabled={isRestarting}
          className="flex items-center justify-center h-6 w-6 text-muted-foreground/50 hover:text-foreground transition-colors rounded-sm hover:bg-secondary/40 disabled:opacity-30"
          aria-label="Reload"
        >
          <RotateCcw className="h-3 w-3" />
        </button>

        {/* Restart sandbox */}
        <button
          onClick={handleRestart}
          disabled={isRestarting}
          title="Restart sandbox"
          className={`flex items-center justify-center h-6 w-6 transition-colors rounded-sm ${
            isRestarting
              ? 'text-accent opacity-70'
              : 'text-muted-foreground/50 hover:text-accent hover:bg-secondary/40'
          }`}
          aria-label="Restart sandbox"
        >
          {isRestarting
            ? <Loader2Icon className="h-3 w-3 animate-spin" />
            : <PowerIcon className="h-3 w-3" />
          }
        </button>

        {/* Edit mode toggle */}
        <button
          onClick={toggleEditMode}
          className={`flex items-center justify-center h-6 w-6 transition-colors rounded-sm ${
            editMode
              ? "text-accent bg-accent/10"
              : "text-muted-foreground/50 hover:text-foreground hover:bg-secondary/40"
          }`}
          aria-label={editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        >
          {editMode ? <EyeIcon className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
        </button>

        {editMode && (
          <button
            onClick={handleSaveChanges}
            disabled={!editModeReady}
            className="flex items-center justify-center h-6 w-6 text-muted-foreground/50 hover:text-foreground transition-colors rounded-sm hover:bg-secondary/40 disabled:opacity-30"
            aria-label="Save Changes"
          >
            <SaveIcon className="h-3 w-3" />
          </button>
        )}

        {/* URL pill */}
        <button
          onClick={handleCopy}
          disabled={!activeSandboxUrl || copied || isRestarting}
          className="flex-1 flex items-center gap-2 bg-secondary/20 border border-border/30 rounded-full px-3 py-1 font-mono text-[10px] text-muted-foreground/60 truncate text-left hover:bg-secondary/40 hover:text-muted-foreground transition-all duration-150 disabled:opacity-40"
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isRestarting ? 'bg-orange-400 animate-pulse' : 'bg-emerald-500/70'}`} />
          <span className="truncate">
            {isRestarting ? "Restarting sandbox..." : copied ? "Copied to clipboard!" : activeSandboxUrl}
          </span>
        </button>

        {/* Open in new tab */}
        <button
          onClick={() => {
            if (!activeSandboxUrl) return;
            window.open(activeSandboxUrl, "_blank");
          }}
          disabled={!activeSandboxUrl || isRestarting}
          className="flex items-center justify-center h-6 w-6 text-muted-foreground/50 hover:text-foreground transition-colors rounded-sm hover:bg-secondary/40 disabled:opacity-30"
          aria-label="Open in new tab"
        >
          <ExternalLinkIcon className="h-3 w-3" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        {isIframeLoading && <IframeLoadingOverlay />}
        <iframe
          ref={iframeRef}
          key={fragmentKey}
          className="absolute inset-0 h-full w-full"
          sandbox="allow-forms allow-scripts allow-same-origin"
          loading="lazy"
          src={getIframeUrl()}
          onLoad={() => setIsIframeLoading(false)}
        />
      </div>
    </div>
  );
};
