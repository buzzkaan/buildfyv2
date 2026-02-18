export default function ProjectLoading() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes scanMove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(600%); }
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounceDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .sk {
          background: linear-gradient(
            90deg,
            var(--secondary) 25%,
            var(--muted) 50%,
            var(--secondary) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
        .scan-bar {
          animation: scanMove 4s linear infinite;
        }
        .spin-ring {
          animation: spinRing 1.4s linear infinite;
          border-top-color: var(--accent);
        }
        .dot-1 { animation: bounceDot 1.2s ease-in-out infinite; animation-delay: 0ms; }
        .dot-2 { animation: bounceDot 1.2s ease-in-out infinite; animation-delay: 180ms; }
        .dot-3 { animation: bounceDot 1.2s ease-in-out infinite; animation-delay: 360ms; }
      `}</style>

      <div className="h-screen bg-background flex overflow-hidden">

        {/* ── Left panel ── */}
        <div className="w-[35%] flex flex-col border-r border-border/40 min-w-0">

          {/* Header */}
          <div className="flex flex-col border-b border-border/40">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="sk h-4 w-36" />
              <div className="sk h-7 w-7 rounded-full" />
            </div>
            <div className="px-5 pb-3">
              <div className="sk h-3 w-20" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden py-6 space-y-5 px-4">
            {/* User bubble */}
            <div className="flex justify-end pr-2">
              <div className="sk h-10 w-3/4" />
            </div>

            {/* Assistant reply */}
            <div className="px-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="sk h-[18px] w-[18px] rounded-full" />
                <div className="sk h-3 w-14" />
              </div>
              <div className="pl-6 space-y-1.5">
                <div className="sk h-3 w-full" />
                <div className="sk h-3 w-5/6" />
                <div className="sk h-3 w-3/4" />
              </div>
              {/* Fragment card */}
              <div className="pl-6">
                <div className="sk h-14 w-full border border-border/30" />
              </div>
            </div>

            {/* User bubble */}
            <div className="flex justify-end pr-2">
              <div className="sk h-8 w-2/3" />
            </div>

            {/* Pending assistant */}
            <div className="px-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="sk h-[18px] w-[18px] rounded-full" />
                <div className="sk h-3 w-12" />
              </div>
              <div className="pl-6 space-y-1.5">
                <div className="sk h-3 w-4/5" />
                <div className="sk h-3 w-3/5" />
              </div>
            </div>
          </div>

          {/* Message form */}
          <div className="px-4 pb-4 pt-2">
            <div className="sk h-[72px] w-full border border-border/40" />
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Tab bar */}
          <div className="flex items-center px-4 py-2 border-b border-border/40 bg-secondary/10 gap-2">
            <div className="sk h-6 w-16" />
            <div className="sk h-6 w-14" />
            <div className="ml-auto flex items-center gap-2">
              <div className="sk h-6 w-20" />
              <div className="sk h-7 w-7 rounded-full" />
            </div>
          </div>

          {/* Preview area */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: [
                "linear-gradient(var(--border) 1px, transparent 1px)",
                "linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "48px 48px",
              opacity: 1,
            }}
          >
            {/* Subtle grid overlay for opacity control */}
            <div className="absolute inset-0 bg-background/70" />

            {/* Scanline */}
            <div
              className="scan-bar absolute left-0 right-0 h-28 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, oklch(from var(--accent) l c h / 0.06), transparent)",
              }}
            />

            {/* Loading card */}
            <div
              className="relative z-20 flex flex-col items-center gap-5 px-10 py-8 border border-border/60 bg-background/95 backdrop-blur-sm"
              style={{ boxShadow: "0 0 40px oklch(from var(--accent) l c h / 0.06)" }}
            >
              {/* Spinner */}
              <div className="relative w-14 h-14">
                {/* Outer static ring */}
                <div className="absolute inset-0 rounded-full border border-border/40" />
                {/* Spinning accent ring */}
                <div
                  className="spin-ring absolute inset-0 rounded-full border border-transparent"
                  style={{ borderTopColor: "var(--accent)" }}
                />
                {/* Inner ring */}
                <div className="absolute inset-[6px] rounded-full border border-border/30" />
                {/* Center dot */}
                <div
                  className="absolute inset-[10px] rounded-full bg-accent/20"
                  style={{ animation: "shimmer 2s ease-in-out infinite" }}
                />
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Loading preview
                </span>
                {/* Bouncing dots */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="dot-1 block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span
                    className="dot-2 block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span
                    className="dot-3 block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
