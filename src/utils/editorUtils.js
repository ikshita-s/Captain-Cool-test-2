/**
 * Utility functions for Monaco Editor
 */

/**
 * Attempts to fix common Monaco editor issues by resetting the DOM state
 * @param {Element} editorContainer - The container element of the editor
 */
export const resetEditorState = (editorContainer) => {
  if (!editorContainer) {
    // If no container specified, try to find all Monaco editors
    const editors = document.querySelectorAll('.monaco-editor');
    if (editors.length > 0) {
      editors.forEach(editor => resetEditorState(editor));
    }
    return;
  }
  
  try {
    // Remove any hidden input areas that might be blocking events
    const hiddenInputs = editorContainer.querySelectorAll('.inputarea[style*="opacity: 0"]');
    hiddenInputs.forEach(input => {
      input.style.opacity = '1';
      input.style.zIndex = '10';
      input.style.pointerEvents = 'auto';
    });
    
    // Ensure textareas are properly positioned
    const textareas = editorContainer.querySelectorAll('.inputarea');
    textareas.forEach(textarea => {
      textarea.style.position = 'absolute';
      textarea.style.pointerEvents = 'auto';
      textarea.style.visibility = 'visible';
      textarea.style.display = 'block';
      textarea.style.top = '0px'; // Ensure visible in viewport
    });
    
    // Make sure all monaco widgets are properly positioned
    const widgets = editorContainer.querySelectorAll('.monaco-editor-overlaymessage');
    widgets.forEach(widget => {
      widget.style.zIndex = '100';
    });
    
    // Fix content widgets
    const contentWidgets = editorContainer.querySelector('.contentWidgets');
    if (contentWidgets) {
      contentWidgets.style.zIndex = '5';
    }
    
    // Fix overlay widgets
    const overlayWidgets = editorContainer.querySelector('.overlayWidgets');
    if (overlayWidgets) {
      overlayWidgets.style.zIndex = '6';
    }
    
    // Try to focus the input area
    const inputArea = editorContainer.querySelector('.inputarea');
    if (inputArea) {
      setTimeout(() => {
        try {
          inputArea.focus();
        } catch (e) {
          console.error('Error focusing input area:', e);
        }
      }, 100);
    }
  } catch (error) {
    console.error('Error in resetEditorState:', error);
  }
};

/**
 * Forces Monaco Editor to reload and recalculate its layout
 * @param {Object} editor - The Monaco editor instance
 */
export const forceEditorReflow = (editor) => {
  if (!editor) return;
  
  try {
    // Force a reflow by temporarily hiding and showing the editor
    const container = editor._domElement;
    if (container) {
      const originalDisplay = container.style.display || 'block';
      container.style.display = 'none';
      
      // Trigger reflow
      void container.offsetHeight;
      
      // Restore display
      container.style.display = originalDisplay;
      
      // Force layout update
      setTimeout(() => {
        try {
          editor.layout();
          
          // Also check if input area is working
          const inputArea = container.querySelector('.inputarea');
          if (inputArea) {
            inputArea.style.opacity = '1';
            inputArea.style.zIndex = '10';
            inputArea.style.pointerEvents = 'auto';
          }
        } catch (error) {
          console.error("Error during editor layout:", error);
        }
      }, 10);
    }
  } catch (error) {
    console.error('Error in forceEditorReflow:', error);
  }
};

/**
 * Checks if typing is working in the editor
 * @param {Element} editorElement - The editor element to check
 * @returns {boolean} - Whether typing appears to be working
 */
export const isTypingWorking = (editorElement) => {
  if (!editorElement) return true;
  
  try {
    const inputArea = editorElement.querySelector('.inputarea');
    if (!inputArea) return false;
    
    const styles = window.getComputedStyle(inputArea);
    return !(
      styles.opacity === '0' || 
      styles.pointerEvents === 'none' ||
      styles.visibility === 'hidden' ||
      styles.display === 'none' ||
      parseInt(styles.zIndex) < 5
    );
  } catch (error) {
    console.error('Error checking if typing works:', error);
    return false;
  }
};

/**
 * Apply fix for Monaco editor input issues 
 * @param {Element} editorElement - The editor element to fix
 * @returns {boolean} - Whether fix was applied
 */
export const applyMonacoInputFix = (editorElement) => {
  if (!editorElement) {
    // Try to find all Monaco editors
    const editors = document.querySelectorAll('.monaco-editor');
    let fixed = false;
    
    if (editors.length > 0) {
      editors.forEach(editor => {
        if (applyMonacoInputFix(editor)) {
          fixed = true;
        }
      });
    }
    
    return fixed;
  }
  
  try {
    // Reset editor state
    resetEditorState(editorElement);
    
    // Force reflow on container
    const container = editorElement.closest('.monaco-editor-container') || editorElement;
    const originalDisplay = container.style.display || '';
    container.style.display = 'none';
    void container.offsetHeight;
    container.style.display = originalDisplay;
    
    // Add global CSS fix if needed
    if (!document.getElementById('monaco-input-fix')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'monaco-input-fix';
      styleEl.textContent = `
        .monaco-editor .inputarea {
          z-index: 10 !important;
          opacity: 1 !important;
          background: transparent !important;
          pointer-events: auto !important;
          position: absolute !important;
        }
        .monaco-editor .contentWidgets {
          z-index: 5 !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    return true;
  } catch (error) {
    console.error('Error applying Monaco input fix:', error);
    return false;
  }
};
