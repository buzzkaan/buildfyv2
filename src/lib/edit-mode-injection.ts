// This script will be injected into the iframe to enable element editing
export const EDIT_MODE_SCRIPT = `
(function() {
  function initEditMode() {
    if (window.__EDIT_MODE_INITIALIZED__) return;
    window.__EDIT_MODE_INITIALIZED__ = true;

    let selectedElement = null;
    let hoveredElement = null;

    const IGNORED_TAGS = ['HTML', 'HEAD', 'BODY', 'SCRIPT', 'STYLE', 'META', 'LINK'];

    // Create overlay for hover effect
    const hoverOverlay = document.createElement('div');
    hoverOverlay.id = '__edit-mode-hover-overlay__';
    hoverOverlay.style.cssText = \`
      position: absolute;
      pointer-events: none;
      border: 2px dashed #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      z-index: 999998;
      display: none;
    \`;
    document.body.appendChild(hoverOverlay);

    // Create overlay for selected element
    const selectOverlay = document.createElement('div');
    selectOverlay.id = '__edit-mode-select-overlay__';
    selectOverlay.style.cssText = \`
      position: absolute;
      pointer-events: none;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.2);
      z-index: 999999;
      display: none;
    \`;
    document.body.appendChild(selectOverlay);

    // Create tag label for hover
    const tagLabel = document.createElement('div');
    tagLabel.id = '__edit-mode-tag-label__';
    tagLabel.style.cssText = \`
      position: absolute;
      background: #3b82f6;
      color: white;
      padding: 2px 6px;
      font-size: 11px;
      font-family: monospace;
      border-radius: 3px;
      z-index: 1000000;
      display: none;
      white-space: nowrap;
    \`;
    document.body.appendChild(tagLabel);

    function getElementPath(element) {
      const path = [];
      let current = element;

      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();

        if (current.id) {
          selector += '#' + current.id;
        } else if (current.className && typeof current.className === 'string') {
          const classes = current.className.trim().split(/\\s+/).filter(c =>
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

    function updateTagLabel(element) {
      if (!element) {
        tagLabel.style.display = 'none';
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

      tagLabel.textContent = tag + id + classes;
      tagLabel.style.display = 'block';
      tagLabel.style.top = (rect.top + window.scrollY - 20) + 'px';
      tagLabel.style.left = (rect.left + window.scrollX) + 'px';
    }

    function handleMouseMove(e) {
      if (e.target.id && e.target.id.startsWith('__edit-mode')) return;

      const element = e.target;
      if (IGNORED_TAGS.includes(element.tagName)) return;

      if (hoveredElement !== element) {
        hoveredElement = element;
        updateOverlay(hoverOverlay, element);
        updateTagLabel(element);
      }
    }

    function handleClick(e) {
      if (e.target.id && e.target.id.startsWith('__edit-mode')) return;

      e.preventDefault();
      e.stopPropagation();

      const element = e.target;
      if (IGNORED_TAGS.includes(element.tagName)) return;

      selectedElement = element;
      updateOverlay(selectOverlay, element);

      const elementData = getElementData(element);
      if (elementData) {
        // Store reference to element for updates
        selectedElement.__editModeId__ = Date.now();
        elementData.elementId = selectedElement.__editModeId__;

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
        updateTagLabel(null);
      }
    }

    // Listen for updates from parent
    window.addEventListener('message', (event) => {
      if (event.data.type === 'UPDATE_ELEMENT' && selectedElement) {
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
      updateTagLabel(hoveredElement);
    }, true);

    // Notify parent that edit mode is ready
    window.parent.postMessage({ type: 'EDIT_MODE_READY' }, '*');

    console.log('Edit mode initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditMode);
  } else {
    initEditMode();
  }
})();
`;
