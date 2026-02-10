// Edit Mode Script - Injected into sandbox
(function() {
  console.log('[Edit Mode] Script loaded');

  // Wait for DOM to be ready
  function initEditMode() {
    // Check if edit mode is enabled via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.get('__edit_mode__') === 'true';

    console.log('[Edit Mode] URL params:', window.location.search);
    console.log('[Edit Mode] Edit mode enabled:', editMode);

    if (!editMode) {
      console.log('[Edit Mode] Not enabled, exiting');
      return;
    }

    if (window.__EDIT_MODE_INITIALIZED__) {
      console.log('[Edit Mode] Already initialized, exiting');
      return;
    }

    window.__EDIT_MODE_INITIALIZED__ = true;
    console.log('[Edit Mode] Initializing...');

    let selectedElement = null;
    let hoveredElement = null;

    const IGNORED_TAGS = ['HTML', 'HEAD', 'BODY', 'SCRIPT', 'STYLE', 'META', 'LINK'];

    // Create overlay for hover effect
    const hoverOverlay = document.createElement('div');
    hoverOverlay.id = '__edit-mode-hover-overlay__';
    hoverOverlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      border: 1px dashed #3b82f6;
      background: rgba(59, 130, 246, 0.05);
      z-index: 999998;
      display: none;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
    `;
    document.body.appendChild(hoverOverlay);

    // Create margin overlay (for selected element)
    const marginOverlay = document.createElement('div');
    marginOverlay.id = '__edit-mode-margin-overlay__';
    marginOverlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      background: rgba(251, 146, 60, 0.15);
      border: 1px dashed rgba(251, 146, 60, 0.4);
      z-index: 999997;
      display: none;
    `;
    document.body.appendChild(marginOverlay);

    // Create padding overlay (for selected element)
    const paddingOverlay = document.createElement('div');
    paddingOverlay.id = '__edit-mode-padding-overlay__';
    paddingOverlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      background: rgba(34, 197, 94, 0.15);
      border: 1px dashed rgba(34, 197, 94, 0.4);
      z-index: 999998;
      display: none;
    `;
    document.body.appendChild(paddingOverlay);

    // Create overlay for selected element (content box)
    const selectOverlay = document.createElement('div');
    selectOverlay.id = '__edit-mode-select-overlay__';
    selectOverlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.08);
      z-index: 999999;
      display: none;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5), inset 0 0 0 1px rgba(59, 130, 246, 0.3);
    `;
    document.body.appendChild(selectOverlay);

    // Create tag label for hover
    const tagLabel = document.createElement('div');
    tagLabel.id = '__edit-mode-tag-label__';
    tagLabel.style.cssText = `
      position: absolute;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 4px 8px;
      font-size: 11px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 500;
      border-radius: 4px;
      z-index: 1000001;
      display: none;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      letter-spacing: 0.3px;
    `;
    document.body.appendChild(tagLabel);

    // Create dimensions label
    const dimensionsLabel = document.createElement('div');
    dimensionsLabel.id = '__edit-mode-dimensions-label__';
    dimensionsLabel.style.cssText = `
      position: absolute;
      background: rgba(15, 23, 42, 0.9);
      color: #f1f5f9;
      padding: 4px 8px;
      font-size: 10px;
      font-family: 'SF Mono', Monaco, monospace;
      font-weight: 500;
      border-radius: 4px;
      z-index: 1000001;
      display: none;
      white-space: nowrap;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    document.body.appendChild(dimensionsLabel);

    // Create spacing labels container (for margin/padding values)
    const spacingLabels = {
      marginTop: createSpacingLabel(),
      marginRight: createSpacingLabel(),
      marginBottom: createSpacingLabel(),
      marginLeft: createSpacingLabel(),
      paddingTop: createSpacingLabel(),
      paddingRight: createSpacingLabel(),
      paddingBottom: createSpacingLabel(),
      paddingLeft: createSpacingLabel()
    };

    function createSpacingLabel() {
      const label = document.createElement('div');
      label.className = '__edit-mode-spacing-label__';
      label.style.cssText = `
        position: absolute;
        background: rgba(15, 23, 42, 0.85);
        color: #f59e0b;
        padding: 2px 6px;
        font-size: 9px;
        font-family: 'SF Mono', Monaco, monospace;
        font-weight: 600;
        border-radius: 2px;
        z-index: 1000002;
        display: none;
        white-space: nowrap;
        pointer-events: none;
      `;
      document.body.appendChild(label);
      return label;
    }

    // Container for child element overlays
    const childOverlays = [];
    function createChildOverlay() {
      const overlay = document.createElement('div');
      overlay.className = '__edit-mode-child-overlay__';
      overlay.style.cssText = `
        position: absolute;
        pointer-events: none;
        border: 1px solid rgba(139, 92, 246, 0.4);
        background: rgba(139, 92, 246, 0.05);
        z-index: 999996;
        display: none;
      `;
      document.body.appendChild(overlay);
      return overlay;
    }

    function getElementPath(element) {
      const path = [];
      let current = element;

      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();

        if (current.id) {
          selector += '#' + current.id;
        } else if (current.className && typeof current.className === 'string') {
          const classes = current.className.trim().split(/\s+/).filter(c =>
            !c.startsWith('__edit-mode')
          );
          if (classes.length > 0) {
            selector += '.' + classes.join('.');
          }
        }

        path.unshift(selector);
        current = current.parentElement;
      }

      return path.join(' > ');
    }

    function getElementData(element) {
      if (!element || IGNORED_TAGS.includes(element.tagName)) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);

      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || '',
        classList: Array.from(element.classList).filter(c => !c.startsWith('__edit-mode')),
        textContent: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
          ? element.textContent.trim()
          : '',
        innerHTML: element.innerHTML,
        attributes: Array.from(element.attributes).reduce((acc, attr) => {
          if (!attr.name.startsWith('__edit-mode')) {
            acc[attr.name] = attr.value;
          }
          return acc;
        }, {}),
        styles: {
          display: computedStyle.display,
          position: computedStyle.position,
          width: computedStyle.width,
          height: computedStyle.height,
          margin: computedStyle.margin,
          padding: computedStyle.padding,
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          textAlign: computedStyle.textAlign,
          border: computedStyle.border,
          borderRadius: computedStyle.borderRadius,
        },
        path: getElementPath(element),
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }
      };
    }

    function updateOverlay(overlay, element) {
      if (!element) {
        overlay.style.display = 'none';
        return;
      }

      const rect = element.getBoundingClientRect();
      overlay.style.display = 'block';
      overlay.style.top = rect.top + window.scrollY + 'px';
      overlay.style.left = rect.left + window.scrollX + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
    }

    function updateMarginPaddingOverlays(element) {
      if (!element) {
        marginOverlay.style.display = 'none';
        paddingOverlay.style.display = 'none';
        hideSpacingLabels();
        return;
      }

      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);

      // Parse margin values
      const marginTop = parseFloat(computedStyle.marginTop) || 0;
      const marginRight = parseFloat(computedStyle.marginRight) || 0;
      const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
      const marginLeft = parseFloat(computedStyle.marginLeft) || 0;

      // Parse padding values
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;

      // Update margin overlay (includes margin + element)
      if (marginTop || marginRight || marginBottom || marginLeft) {
        marginOverlay.style.display = 'block';
        marginOverlay.style.top = (rect.top + window.scrollY - marginTop) + 'px';
        marginOverlay.style.left = (rect.left + window.scrollX - marginLeft) + 'px';
        marginOverlay.style.width = (rect.width + marginLeft + marginRight) + 'px';
        marginOverlay.style.height = (rect.height + marginTop + marginBottom) + 'px';
      } else {
        marginOverlay.style.display = 'none';
      }

      // Update padding overlay (content box without padding)
      if (paddingTop || paddingRight || paddingBottom || paddingLeft) {
        paddingOverlay.style.display = 'block';
        paddingOverlay.style.top = (rect.top + window.scrollY + paddingTop) + 'px';
        paddingOverlay.style.left = (rect.left + window.scrollX + paddingLeft) + 'px';
        paddingOverlay.style.width = (rect.width - paddingLeft - paddingRight) + 'px';
        paddingOverlay.style.height = (rect.height - paddingTop - paddingBottom) + 'px';
      } else {
        paddingOverlay.style.display = 'none';
      }

      // Update spacing labels
      updateSpacingLabels(rect, {
        marginTop, marginRight, marginBottom, marginLeft,
        paddingTop, paddingRight, paddingBottom, paddingLeft
      });
    }

    function updateSpacingLabels(rect, spacing) {
      const { marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft } = spacing;

      // Margin labels (orange/amber color)
      if (marginTop > 0) {
        spacingLabels.marginTop.textContent = `M ${Math.round(marginTop)}`;
        spacingLabels.marginTop.style.display = 'block';
        spacingLabels.marginTop.style.color = '#f59e0b';
        spacingLabels.marginTop.style.top = (rect.top + window.scrollY - marginTop / 2 - 10) + 'px';
        spacingLabels.marginTop.style.left = (rect.left + window.scrollX + rect.width / 2 - 20) + 'px';
      } else {
        spacingLabels.marginTop.style.display = 'none';
      }

      if (marginBottom > 0) {
        spacingLabels.marginBottom.textContent = `M ${Math.round(marginBottom)}`;
        spacingLabels.marginBottom.style.display = 'block';
        spacingLabels.marginBottom.style.color = '#f59e0b';
        spacingLabels.marginBottom.style.top = (rect.bottom + window.scrollY + marginBottom / 2 - 10) + 'px';
        spacingLabels.marginBottom.style.left = (rect.left + window.scrollX + rect.width / 2 - 20) + 'px';
      } else {
        spacingLabels.marginBottom.style.display = 'none';
      }

      if (marginLeft > 0) {
        spacingLabels.marginLeft.textContent = `M ${Math.round(marginLeft)}`;
        spacingLabels.marginLeft.style.display = 'block';
        spacingLabels.marginLeft.style.color = '#f59e0b';
        spacingLabels.marginLeft.style.top = (rect.top + window.scrollY + rect.height / 2 - 10) + 'px';
        spacingLabels.marginLeft.style.left = (rect.left + window.scrollX - marginLeft / 2 - 20) + 'px';
      } else {
        spacingLabels.marginLeft.style.display = 'none';
      }

      if (marginRight > 0) {
        spacingLabels.marginRight.textContent = `M ${Math.round(marginRight)}`;
        spacingLabels.marginRight.style.display = 'block';
        spacingLabels.marginRight.style.color = '#f59e0b';
        spacingLabels.marginRight.style.top = (rect.top + window.scrollY + rect.height / 2 - 10) + 'px';
        spacingLabels.marginRight.style.left = (rect.right + window.scrollX + marginRight / 2 - 20) + 'px';
      } else {
        spacingLabels.marginRight.style.display = 'none';
      }

      // Padding labels (green color)
      if (paddingTop > 0) {
        spacingLabels.paddingTop.textContent = `P ${Math.round(paddingTop)}`;
        spacingLabels.paddingTop.style.display = 'block';
        spacingLabels.paddingTop.style.color = '#22c55e';
        spacingLabels.paddingTop.style.top = (rect.top + window.scrollY + paddingTop / 2 - 10) + 'px';
        spacingLabels.paddingTop.style.left = (rect.left + window.scrollX + rect.width / 2 - 18) + 'px';
      } else {
        spacingLabels.paddingTop.style.display = 'none';
      }

      if (paddingBottom > 0) {
        spacingLabels.paddingBottom.textContent = `P ${Math.round(paddingBottom)}`;
        spacingLabels.paddingBottom.style.display = 'block';
        spacingLabels.paddingBottom.style.color = '#22c55e';
        spacingLabels.paddingBottom.style.top = (rect.bottom + window.scrollY - paddingBottom / 2 - 10) + 'px';
        spacingLabels.paddingBottom.style.left = (rect.left + window.scrollX + rect.width / 2 - 18) + 'px';
      } else {
        spacingLabels.paddingBottom.style.display = 'none';
      }

      if (paddingLeft > 0) {
        spacingLabels.paddingLeft.textContent = `P ${Math.round(paddingLeft)}`;
        spacingLabels.paddingLeft.style.display = 'block';
        spacingLabels.paddingLeft.style.color = '#22c55e';
        spacingLabels.paddingLeft.style.top = (rect.top + window.scrollY + rect.height / 2 - 10) + 'px';
        spacingLabels.paddingLeft.style.left = (rect.left + window.scrollX + paddingLeft / 2 - 18) + 'px';
      } else {
        spacingLabels.paddingLeft.style.display = 'none';
      }

      if (paddingRight > 0) {
        spacingLabels.paddingRight.textContent = `P ${Math.round(paddingRight)}`;
        spacingLabels.paddingRight.style.display = 'block';
        spacingLabels.paddingRight.style.color = '#22c55e';
        spacingLabels.paddingRight.style.top = (rect.top + window.scrollY + rect.height / 2 - 10) + 'px';
        spacingLabels.paddingRight.style.left = (rect.right + window.scrollX - paddingRight / 2 - 18) + 'px';
      } else {
        spacingLabels.paddingRight.style.display = 'none';
      }
    }

    function hideSpacingLabels() {
      Object.values(spacingLabels).forEach(label => {
        label.style.display = 'none';
      });
    }

    function updateChildOverlays(element) {
      // Hide all existing child overlays
      childOverlays.forEach(overlay => {
        overlay.style.display = 'none';
      });

      if (!element) return;

      // Get ALL nested children (not just direct children)
      const allChildren = Array.from(element.querySelectorAll('*')).filter(child =>
        !IGNORED_TAGS.includes(child.tagName) &&
        !child.id?.startsWith('__edit-mode') &&
        !child.className?.includes?.('__edit-mode')
      );

      console.log(`[Edit Mode] Showing ${allChildren.length} nested children`);

      // Create or reuse overlays for children
      allChildren.forEach((child, index) => {
        if (!childOverlays[index]) {
          childOverlays[index] = createChildOverlay();
        }

        const overlay = childOverlays[index];
        const rect = child.getBoundingClientRect();

        // Calculate depth level (distance from selected element)
        let depth = 0;
        let current = child;
        while (current && current !== element) {
          depth++;
          current = current.parentElement;
        }

        // Set color based on depth (different shades of purple/violet)
        let borderColor, bgColor;
        switch (depth) {
          case 1: // Direct children
            borderColor = 'rgba(139, 92, 246, 0.6)'; // Bright purple
            bgColor = 'rgba(139, 92, 246, 0.08)';
            break;
          case 2: // Grandchildren
            borderColor = 'rgba(168, 85, 247, 0.5)'; // Purple
            bgColor = 'rgba(168, 85, 247, 0.06)';
            break;
          case 3: // Great-grandchildren
            borderColor = 'rgba(192, 132, 252, 0.4)'; // Light purple
            bgColor = 'rgba(192, 132, 252, 0.04)';
            break;
          default: // Deeper levels
            borderColor = 'rgba(216, 180, 254, 0.3)'; // Very light purple
            bgColor = 'rgba(216, 180, 254, 0.03)';
        }

        overlay.style.display = 'block';
        overlay.style.border = \`1px solid \${borderColor}\`;
        overlay.style.background = bgColor;
        overlay.style.top = rect.top + window.scrollY + 'px';
        overlay.style.left = rect.left + window.scrollX + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
      });
    }

    function updateTagLabel(element) {
      if (!element) {
        tagLabel.style.display = 'none';
        dimensionsLabel.style.display = 'none';
        return;
      }

      const rect = element.getBoundingClientRect();
      const tag = element.tagName.toLowerCase();
      const id = element.id ? '#' + element.id : '';
      const classes = Array.from(element.classList)
        .filter(c => !c.startsWith('__edit-mode'))
        .slice(0, 2)
        .map(c => '.' + c)
        .join('');

      // Update tag label
      tagLabel.textContent = tag + id + classes;
      tagLabel.style.display = 'block';

      const labelTop = rect.top + window.scrollY - 24;
      const labelLeft = rect.left + window.scrollX;

      tagLabel.style.top = (labelTop > 0 ? labelTop : rect.top + window.scrollY + 4) + 'px';
      tagLabel.style.left = labelLeft + 'px';

      // Update dimensions label
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      dimensionsLabel.textContent = `${width} × ${height}`;
      dimensionsLabel.style.display = 'block';

      // Position at bottom-right of element
      dimensionsLabel.style.top = (rect.bottom + window.scrollY - 24) + 'px';
      dimensionsLabel.style.left = (rect.right + window.scrollX - 80) + 'px';
    }

    function handleMouseMove(e) {
      if (e.target.id && e.target.id.startsWith('__edit-mode')) return;

      const element = e.target;
      if (IGNORED_TAGS.includes(element.tagName)) return;

      if (hoveredElement !== element) {
        hoveredElement = element;
        updateOverlay(hoverOverlay, element);
        updateTagLabel(element);
        updateMarginPaddingOverlays(element);
      }
    }

    function handleClick(e) {
      if (e.target.id && e.target.id.startsWith('__edit-mode')) return;
      if (e.target.className?.includes && e.target.className.includes('__edit-mode')) return;

      e.preventDefault();
      e.stopPropagation();

      const element = e.target;
      if (IGNORED_TAGS.includes(element.tagName)) return;

      console.log('[Edit Mode] Element clicked:', element);

      selectedElement = element;
      updateOverlay(selectOverlay, element);
      updateMarginPaddingOverlays(element);
      updateChildOverlays(element);
      updateTagLabel(element);

      const elementData = getElementData(element);
      if (elementData) {
        // Store reference to element for updates
        selectedElement.__editModeId__ = Date.now();
        elementData.elementId = selectedElement.__editModeId__;

        console.log('[Edit Mode] Sending ELEMENT_SELECTED to parent:', elementData);
        window.parent.postMessage({
          type: 'ELEMENT_SELECTED',
          data: elementData
        }, '*');
      }
    }

    function handleMouseLeave(e) {
      if (e.target === document.body) {
        hoveredElement = null;
        updateOverlay(hoverOverlay, null);
        if (!selectedElement) {
          updateTagLabel(null);
        }
      }
    }

    // Listen for updates from parent
    window.addEventListener('message', (event) => {
      console.log('[Edit Mode] Received message:', event.data.type, event.data);

      if (event.data.type === 'UPDATE_ELEMENT' && selectedElement) {
        console.log('[Edit Mode] Updating element:', event.data.updates);
        const { updates } = event.data;

        if (updates.textContent !== undefined && selectedElement.childNodes.length === 1) {
          selectedElement.textContent = updates.textContent;
        }

        if (updates.classList) {
          selectedElement.className = updates.classList.join(' ');
        }

        if (updates.id !== undefined) {
          selectedElement.id = updates.id;
        }

        if (updates.attributes) {
          Object.entries(updates.attributes).forEach(([key, value]) => {
            if (value === null || value === '') {
              selectedElement.removeAttribute(key);
            } else {
              selectedElement.setAttribute(key, value);
            }
          });
        }

        if (updates.styles) {
          Object.entries(updates.styles).forEach(([key, value]) => {
            selectedElement.style[key] = value;
          });
        }

        // Update overlays
        updateOverlay(selectOverlay, selectedElement);

        // Send updated data back
        const elementData = getElementData(selectedElement);
        if (elementData) {
          elementData.elementId = selectedElement.__editModeId__;
          window.parent.postMessage({
            type: 'ELEMENT_UPDATED',
            data: elementData
          }, '*');
        }
      }

      if (event.data.type === 'DESELECT_ELEMENT') {
        selectedElement = null;
        updateOverlay(selectOverlay, null);
        updateMarginPaddingOverlays(null);
        updateChildOverlays(null);
        updateTagLabel(null);
      }

      if (event.data.type === 'GET_HTML') {
        // Clone and clean the document
        const clone = document.cloneNode(true);

        // Remove edit mode elements
        const editModeElements = clone.querySelectorAll('[id^="__edit-mode"], [class*="__edit-mode"]');
        editModeElements.forEach(el => el.remove());

        // Remove edit mode scripts
        const scripts = clone.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.textContent?.includes('__EDIT_MODE_INITIALIZED__') ||
              script.src?.includes('edit-mode.js')) {
            script.remove();
          }
        });

        const cleanedHTML = clone.documentElement.outerHTML;

        // Send cleaned HTML back to parent
        window.parent.postMessage({
          type: 'HTML_RESPONSE',
          html: cleanedHTML
        }, '*');
      }
    });

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Handle scroll
    window.addEventListener('scroll', () => {
      updateOverlay(hoverOverlay, hoveredElement);
      updateOverlay(selectOverlay, selectedElement);
      updateMarginPaddingOverlays(selectedElement);
      updateChildOverlays(selectedElement);
      updateTagLabel(selectedElement || hoveredElement);
    }, true);

    // Handle Esc key to select parent element
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && selectedElement) {
        e.preventDefault();
        const parent = selectedElement.parentElement;
        if (parent && parent !== document.body && !IGNORED_TAGS.includes(parent.tagName)) {
          // Simulate click on parent
          selectedElement = parent;
          updateOverlay(selectOverlay, parent);
          updateMarginPaddingOverlays(parent);
          updateChildOverlays(parent);
          updateTagLabel(parent);

          const elementData = getElementData(parent);
          if (elementData) {
            selectedElement.__editModeId__ = Date.now();
            elementData.elementId = selectedElement.__editModeId__;
            window.parent.postMessage({
              type: 'ELEMENT_SELECTED',
              data: elementData
            }, '*');
          }
        }
      }
    }, true);

    // Notify parent that edit mode is ready
    console.log('[Edit Mode] Sending EDIT_MODE_READY to parent');
    window.parent.postMessage({ type: 'EDIT_MODE_READY' }, '*');

    console.log('[Edit Mode] ✅ Initialization complete!');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditMode);
  } else {
    initEditMode();
  }
})();
