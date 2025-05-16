/**
 * This script contains functions to help reload the Monaco editor when it has issues
 */

/**
 * Force reloads the Monaco editor and its resources
 * This can be called when the editor has input issues
 */
export const reloadMonacoEditor = () => {
  // Find all Monaco editor script tags and remove them
  const monacoScripts = document.querySelectorAll('script[src*="monaco"]');
  monacoScripts.forEach(script => script.remove());
  
  // Find editor containers and reset them
  const editorContainers = document.querySelectorAll('.monaco-editor-container, .monaco-editor');
  editorContainers.forEach(container => {
    // Preserve parent information
    const parent = container.parentElement;
    if (parent) {
      // Remove old container
      container.remove();
      
      // Create placeholder
      const placeholder = document.createElement('div');
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.dataset.monacoPlaceholder = 'true';
      
      // Add placeholder to parent
      parent.appendChild(placeholder);
    }
  });
  
  // Force a full reload of Monaco in 10ms
  setTimeout(() => {
    window.location.reload();
  }, 10);
};

/**
 * Checks if Monaco editor is functioning properly and reloads if needed
 * @param {Object} editor - The Monaco editor instance
 * @returns {boolean} - True if editor is working correctly, false otherwise
 */
export const checkMonacoHealth = (editor) => {
  if (!editor) return false;
  
  try {
    // Check if editor can properly accept input
    const inputArea = editor._domElement?.querySelector('.inputarea');
    
    if (!inputArea || 
        window.getComputedStyle(inputArea).pointerEvents === 'none' ||
        window.getComputedStyle(inputArea).opacity === '0') {
      
      console.warn('Monaco editor input area has issues, attempting to fix...');
      
      // Try to fix the input area
      if (inputArea) {
        inputArea.style.pointerEvents = 'auto';
        inputArea.style.opacity = '1';
        inputArea.style.zIndex = '10';
        
        // Focus it
        inputArea.focus();
        
        // If still not working, suggest a reload
        if (window.getComputedStyle(inputArea).pointerEvents === 'none') {
          console.error('Could not fix input area, a reload may be needed');
          return false;
        }
        
        return true;
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking Monaco health:', error);
    return false;
  }
};
