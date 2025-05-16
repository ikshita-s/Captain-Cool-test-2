import React, { createContext, useContext, useEffect, useState } from 'react';

// Create Monaco context
const MonacoContext = createContext();

// Provider component
export function MonacoProvider({ children }) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [hasTypingIssues, setHasTypingIssues] = useState(false);

  // Configure Monaco editor globally
  useEffect(() => {
    // Ensure window.monaco exists
    if (window.monaco) {
      configureMonaco(window.monaco);
      setIsEditorReady(true);
    }
    
    // Monaco might be loaded after this component mounts
    window.addEventListener('monaco-ready', (e) => {
      if (e.detail?.monaco) {
        configureMonaco(e.detail.monaco);
        setIsEditorReady(true);
      }
    });
    
    // Set up global monitoring for typing issues
    const monitorInterval = setInterval(() => {
      const editors = document.querySelectorAll('.monaco-editor');
      let issuesDetected = false;
      
      editors.forEach(editor => {
        const inputArea = editor.querySelector('.inputarea');
        if (inputArea) {
          const styles = window.getComputedStyle(inputArea);
          if (styles.opacity === '0' || styles.pointerEvents === 'none') {
            issuesDetected = true;
          }
        }
      });
      
      setHasTypingIssues(issuesDetected);
    }, 2000);
    
    return () => {
      window.removeEventListener('monaco-ready', () => {});
      clearInterval(monitorInterval);
    };
  }, []);
  
  // Configure Monaco editor globally
  const configureMonaco = (monaco) => {
    // Configure keyboard input handling
    const originalKeyDown = monaco.editor.StandaloneEditor.prototype._standaloneKeyDown;
    
    // Override the keydown handler to ensure it always receives keyboard events
    monaco.editor.StandaloneEditor.prototype._standaloneKeyDown = function(e) {
      // Make sure the event doesn't get stopped by other handlers
      e.stopPropagation = function() {};
      
      // Call the original handler
      return originalKeyDown.call(this, e);
    };
    
    // Add global keyboard event handlers
    document.addEventListener('keydown', function(e) {
      // Only if we have an active editor instance
      const activeEditor = document.querySelector('.monaco-editor.focused');
      if (activeEditor) {
        // Ensure the editor receives focus when typing starts
        const textArea = activeEditor.querySelector('.inputarea');
        if (textArea && document.activeElement !== textArea) {
          textArea.focus();
        }
      }
    }, true);
    
    // Configure editor options globally
    monaco.editor.EditorOptions.readOnly.defaultValue = false;
    monaco.editor.EditorOptions.automaticLayout.defaultValue = true;
    monaco.editor.EditorOptions.fixedOverflowWidgets.defaultValue = true;
    
    // Make the input text area visible and clickable in all Monaco instances
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .monaco-editor .inputarea {
        z-index: 10 !important;
        opacity: 1 !important;
        background: transparent !important;
        pointer-events: auto !important;
        position: absolute !important;
      }
    `;
    document.head.appendChild(styleSheet);
  };
  
  // Fix typing issues in the editor
  const fixEditorTypingIssues = () => {
    try {
      const editors = document.querySelectorAll('.monaco-editor');
      
      editors.forEach(editor => {
        const inputArea = editor.querySelector('.inputarea');
        if (inputArea) {
          // Fix the input area styles
          inputArea.style.zIndex = '10';
          inputArea.style.opacity = '1';
          inputArea.style.pointerEvents = 'auto';
          inputArea.style.position = 'absolute';
          
          // Focus the input area
          inputArea.focus();
          
          // Force editor container to recalculate layout
          const container = editor.closest('.monaco-editor-container') || editor;
          if (container) {
            const originalDisplay = container.style.display;
            container.style.display = 'none';
            void container.offsetHeight;
            container.style.display = originalDisplay;
          }
        }
      });
      
      setHasTypingIssues(false);
      return true;
    } catch (error) {
      console.error('Error fixing typing issues:', error);
      return false;
    }
  };
  
  return (
    <MonacoContext.Provider value={{
      isEditorReady,
      hasTypingIssues,
      fixEditorTypingIssues
    }}>
      {children}
    </MonacoContext.Provider>
  );
}

// Custom hook for using the context
export function useMonacoContext() {
  const context = useContext(MonacoContext);
  if (!context) {
    throw new Error('useMonacoContext must be used within a MonacoProvider');
  }
  return context;
}
