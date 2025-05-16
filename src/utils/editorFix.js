/**
 * Utility script to help fix Monaco editor typing issues
 * This can be executed in the browser console to fix the editor
 */

(function() {
  // Function to fix Monaco editor input issues
  function fixMonacoEditor() {
    try {
      // Find all Monaco editor instances
      const editors = document.querySelectorAll('.monaco-editor');
      console.log(`Found ${editors.length} Monaco editor instances`);
      
      editors.forEach((editor, index) => {
        console.log(`Fixing editor #${index + 1}`);
        
        // Find the input area
        const inputArea = editor.querySelector('.inputarea');
        if (inputArea) {
          console.log('Found input area, fixing styles...');
          
          // Fix input area styles
          inputArea.style.position = 'absolute';
          inputArea.style.zIndex = '10'; 
          inputArea.style.opacity = '1';
          inputArea.style.pointerEvents = 'auto';
          inputArea.style.background = 'transparent';
          
          // Try to focus
          setTimeout(() => {
            try {
              inputArea.focus();
              console.log('Input area focused');
            } catch (e) {
              console.warn('Could not focus input area:', e);
            }
          }, 10);
        } else {
          console.warn('No input area found for editor');
        }
        
        // Fix content widgets
        const contentWidgets = editor.querySelector('.contentWidgets');
        if (contentWidgets) {
          contentWidgets.style.zIndex = '5';
        }
        
        // Fix overlay widgets
        const overlayWidgets = editor.querySelector('.overlayWidgets');
        if (overlayWidgets) {
          overlayWidgets.style.zIndex = '6';
        }
      });
      
      console.log('Monaco editor fix applied. Please try typing now.');
      return 'Editor fix applied';
    } catch (error) {
      console.error('Error fixing Monaco editor:', error);
      return 'Error: ' + error.message;
    }
  }
  
  // Make available globally
  window.fixMonacoEditor = fixMonacoEditor;
  
  // Add button to page for easy access
  function addFixButton() {
    const button = document.createElement('button');
    button.textContent = 'Fix Editor';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = '#ef476f';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.fontWeight = 'bold';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    button.addEventListener('click', () => {
      const result = fixMonacoEditor();
      alert(result);
    });
    
    document.body.appendChild(button);
    console.log('Fix button added to page');
  }
  
  // Initialize
  function initialize() {
    if (document.readyState === 'complete') {
      addFixButton();
    } else {
      window.addEventListener('load', addFixButton);
    }
  }
  
  initialize();
})();
