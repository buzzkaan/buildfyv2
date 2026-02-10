#!/bin/bash

# Add edit mode script loader to Next.js layout

LAYOUT_FILE="/home/user/app/layout.tsx"

if [ -f "$LAYOUT_FILE" ]; then
  # Check if edit mode script is already added
  if ! grep -q "edit-mode.js" "$LAYOUT_FILE"; then
    # Add Script tag to head section
    sed -i '/<\/head>/i \        <Script src="/edit-mode.js" strategy="afterInteractive" />' "$LAYOUT_FILE"

    # Add Script import if not exists
    if ! grep -q "next/script" "$LAYOUT_FILE"; then
      sed -i '/^import/a import Script from "next/script"' "$LAYOUT_FILE"
    fi

    echo "Edit mode setup completed"
  else
    echo "Edit mode already configured"
  fi
else
  echo "Layout file not found at $LAYOUT_FILE"
fi
