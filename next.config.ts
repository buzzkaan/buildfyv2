import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  serverExternalPackages: [
    "@opentelemetry/instrumentation-winston",
    "@opentelemetry/auto-instrumentations-node",
    "@e2b/code-interpreter",
    "e2b",
  ],
};

export default nextConfig;
