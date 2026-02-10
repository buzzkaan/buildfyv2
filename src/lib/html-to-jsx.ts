// Utility to convert HTML to JSX and update the page file

export function extractBodyContent(html: string): string {
  // Extract content between <body> tags
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return html;

  return bodyMatch[1].trim();
}

export function updatePageWithNewHTML(
  currentPageContent: string,
  newHTML: string
): string {
  // This is a simple implementation - you might need to make it more sophisticated
  // depending on your Next.js app structure

  // Try to find the return statement in the component
  const returnMatch = currentPageContent.match(
    /(return\s*\([\s\S]*?\n\s*\))/
  );

  if (!returnMatch) {
    // If no return found, try to find JSX
    const jsxMatch = currentPageContent.match(
      /(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s+)([\s\S]*?)(\n\})/
    );

    if (jsxMatch) {
      const bodyContent = extractBodyContent(newHTML);
      return currentPageContent.replace(
        jsxMatch[2],
        `(\n    <>\n${bodyContent}\n    </>\n  )`
      );
    }
  }

  // For now, just return a warning comment
  return `/*
  WARNING: Automatic HTML to JSX conversion is complex.
  Please manually update your component with the changes.

  New HTML:
  ${newHTML}
  */\n\n${currentPageContent}`;
}

export function getIframeHTML(iframe: HTMLIFrameElement): string | null {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return null;

    // Remove edit mode elements
    const clone = doc.cloneNode(true) as Document;
    const editModeElements = clone.querySelectorAll('[id^="__edit-mode"]');
    editModeElements.forEach(el => el.remove());

    // Remove edit mode scripts
    const scripts = clone.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.textContent?.includes('__EDIT_MODE_INITIALIZED__')) {
        script.remove();
      }
    });

    return clone.documentElement.outerHTML;
  } catch (error) {
    console.error('Error extracting HTML from iframe:', error);
    return null;
  }
}
