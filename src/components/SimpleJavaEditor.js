import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCode, FiPlayCircle, FiSave, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const EditorContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 12px;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceVariant};
  z-index: 5;
`;

const EditorTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const EditorActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  height: 36px;
  border-radius: 8px;
  background: ${({ theme, variant }) => 
    variant ? theme[variant] || theme.primary : 'transparent'};
  color: ${({ theme, variant }) => 
    variant ? theme.textOnPrimary : theme.textPrimary};
  border: ${({ theme, variant }) => 
    variant ? 'none' : `1px solid ${theme.border}`};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadowHover};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  .monaco-editor .inputarea {
    z-index: 10 !important;
    opacity: 1 !important;
    background: transparent !important;
    pointer-events: auto !important;
  }
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textSecondary};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const StatusInfo = styled.div`
  display: flex;
  gap: 1rem;
`;

const FixButton = styled(motion.button)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: ${({ theme }) => theme.danger};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  
  &:hover {
    transform: scale(1.1);
  }
`;

function SimpleJavaEditor() {
  const { currentFRQ, preferences, saveCode, getSavedCode } = useAppContext();
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const [showFixButton, setShowFixButton] = useState(false);
  
  // Initialize with template code
  useEffect(() => {
    if (currentFRQ) {
      const savedCode = getSavedCode(currentFRQ.id);
      
      if (savedCode) {
        setEditorValue(savedCode);
      } else {
        // Simple template
        const template = `// ${currentFRQ.title || 'FRQ Question'}\n// Write your solution below\n\n${currentFRQ.methodSignature || 'public void solve() {\n    // Your code here\n}'} {\n    // Your code here\n    \n}`;
        setEditorValue(template);
      }
    }
  }, [currentFRQ, getSavedCode]);
  
  // Handle editor mount
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Apply basic configuration
    editor.updateOptions({
      readOnly: false,
      automaticLayout: true,
      minimap: { enabled: true },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontSize: preferences?.fontSize || 14
    });
    
    // Attempt to fix input issues after a delay
    setTimeout(() => {
      try {
        // Focus the editor
        editor.focus();
        
        // Ensure input area is visible and working
        const inputArea = editor._domElement?.querySelector('.inputarea');
        if (inputArea) {
          inputArea.style.zIndex = '10';
          inputArea.style.opacity = '1';
          inputArea.style.pointerEvents = 'auto';
        }
      } catch (err) {
        console.error('Error during editor setup:', err);
        setShowFixButton(true);
      }
    }, 300);
    
    // Monitor for typing issues
    setTimeout(() => {
      try {
        const testTyping = () => {
          const inputArea = editor._domElement?.querySelector('.inputarea');
          if (inputArea && (
              window.getComputedStyle(inputArea).opacity === '0' || 
              window.getComputedStyle(inputArea).pointerEvents === 'none'
          )) {
            setShowFixButton(true);
          }
        };
        
        testTyping();
        // Check again after some time
        setTimeout(testTyping, 3000);
      } catch (err) {
        console.error('Error monitoring editor:', err);
      }
    }, 1000);
  };
  
  // Handle save action
  const handleSave = () => {
    if (!currentFRQ || !editorRef.current) return;
    
    setSaveStatus('saving');
    const code = editorRef.current.getValue();
    
    // Save with small delay to show feedback
    setTimeout(() => {
      try {
        saveCode(currentFRQ.id, code);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } catch (err) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 2000);
      }
    }, 300);
  };
  
  // Handle run action (simplified)
  const handleRun = () => {
    if (!editorRef.current) return;
    
    alert('Code execution is not yet implemented. Your code:\n\n' + 
          editorRef.current.getValue().substring(0, 200) + 
          (editorRef.current.getValue().length > 200 ? '...' : ''));
  };
  
  // Handle fix button click
  const handleFix = () => {
    if (!editorRef.current) return;
    
    try {
      // Find and fix input area
      const editor = editorRef.current;
      const editorElement = editor._domElement;
      
      if (editorElement) {
        const inputArea = editorElement.querySelector('.inputarea');
        if (inputArea) {
          inputArea.style.zIndex = '10';
          inputArea.style.opacity = '1';
          inputArea.style.pointerEvents = 'auto';
          inputArea.focus();
        }
        
        // Force layout recalculation
        const parent = editorElement.parentElement;
        if (parent) {
          const originalDisplay = parent.style.display;
          parent.style.display = 'none';
          void parent.offsetHeight;
          parent.style.display = originalDisplay;
        }
        
        // Update layout
        editor.layout();
      }
      
      setShowFixButton(false);
    } catch (err) {
      console.error('Error fixing editor:', err);
      // If fix fails, suggest refresh
      if (window.confirm('Could not fix editor issues. Reload page?')) {
        window.location.reload();
      }
    }
  };

  return (
    <EditorContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <EditorHeader>
        <EditorTitle>
          <FiCode /> Java Solution
        </EditorTitle>
        <EditorActions>
          <ActionButton
            onClick={handleSave}
            variant={saveStatus === 'saved' ? 'success' : null}
          >
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'saved' ? <FiCheck /> : 
             saveStatus === 'error' ? <FiAlertCircle /> : 
             <FiSave />}
            {!saveStatus && " Save"}
          </ActionButton>
          
          <ActionButton
            onClick={handleRun}
            variant="primary"
          >
            <FiPlayCircle /> Run
          </ActionButton>
        </EditorActions>
      </EditorHeader>
      
      <EditorContent>
        <Editor
          height="100%"
          language="java"
          theme={preferences?.darkMode ? 'vs-dark' : 'vs-light'}
          value={editorValue}
          onChange={setEditorValue}
          onMount={handleEditorMount}
          options={{
            readOnly: false,
            contextmenu: true
          }}
        />
        
        {showFixButton && (
          <FixButton
            onClick={handleFix}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Fix editor typing issues"
          >
            <FiRefreshCw />
          </FixButton>
        )}
      </EditorContent>
      
      <StatusBar>
        <div>
          {saveStatus === 'saved' && "Changes saved"}
          {saveStatus === 'saving' && "Saving..."}
          {saveStatus === 'error' && "Error saving"}
        </div>
        <StatusInfo>
          <span>Java</span>
          {showFixButton && (
            <span style={{ color: '#EF476F' }}>
              Editor issue detected. Click the fix button if you can't type.
            </span>
          )}
        </StatusInfo>
      </StatusBar>
    </EditorContainer>
  );
}

export default SimpleJavaEditor;
