import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiPlayCircle, FiSave, FiCheck, FiAlertCircle, FiTerminal, FiGitCommit, FiCpu } from 'react-icons/fi';

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
  background: ${({ theme, variant }) => {
    switch(variant) {
      case 'primary': return theme.primary;
      case 'success': return theme.success;
      case 'warning': return theme.warning;
      case 'danger': return theme.danger;
      default: return 'transparent';
    }
  }};
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
    background: ${({ theme, variant }) => {
      switch(variant) {
        case 'primary': return theme.primary;
        case 'success': return theme.success;
        case 'warning': return theme.warning;
        case 'danger': return theme.danger;
        default: return theme.stateHover;
      }
    }};
    transform: translateY(-1px);
    box-shadow: ${({ theme, variant }) => 
      variant ? theme.shadowHover : 'none'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .tooltip {
    position: absolute;
    bottom: -30px;
    font-size: 0.75rem;
    background: ${({ theme }) => theme.surfaceVariant};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
    box-shadow: ${({ theme }) => theme.shadow};
    opacity: 0;
    transform: translateY(-4px);
    transition: all 0.2s ease;
    pointer-events: none;
  }
  
  &:hover .tooltip {
    opacity: 1;
    transform: translateY(0);
  }
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
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

const EditorStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .status-icon {
    color: ${({ theme, status }) => {
      switch(status) {
        case 'success': return theme.success;
        case 'error': return theme.danger;
        case 'warning': return theme.warning;
        default: return theme.textSecondary;
      }
    }};
  }
`;

const StatusInfo = styled.div`
  display: flex;
  gap: 1rem;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const RunPanel = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.surfaceVariant};
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 1rem;
  max-height: 40%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const RunPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 0.5rem;
  
  h3 {
    font-size: 0.875rem;
    margin: 0;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: ${({ theme }) => theme.primary};
    }
  }
  
  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.textSecondary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.stateHover};
      color: ${({ theme }) => theme.textPrimary};
    }
  }
`;

const RunOutput = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  overflow-x: auto;
  padding: 0.5rem;
  background: ${({ theme }) => theme.background};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme, error }) => error ? theme.danger : theme.textPrimary};
  flex: 1;
  min-height: 100px;
`;

const AutocompleteItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Fira Code', monospace;
  
  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border-radius: 2px;
    background: ${({ theme, type }) => {
      switch(type) {
        case 'method': return theme.primary;
        case 'class': return theme.secondary;
        case 'variable': return theme.accent;
        default: return theme.border;
      }
    }};
    color: ${({ theme }) => theme.textOnPrimary};
  }
  
  .label {
    font-weight: 500;
  }
  
  .details {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.8em;
  }
`;

function JavaEditor() {
  const { currentFRQ, preferences, saveCode, getSavedCode } = useAppContext();
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useState('');
  const [editorStatus, setEditorStatus] = useState('idle'); // idle, loading, ready, error, success
  const [showRunPanel, setShowRunPanel] = useState(false);
  const [runOutput, setRunOutput] = useState('');
  const [isRunError, setIsRunError] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null); // null, saving, saved, error
  
  // Initialize editor with template based on current FRQ
  useEffect(() => {
    if (currentFRQ) {
      // Check if we have saved code for this FRQ
      const savedCode = getSavedCode(currentFRQ.id);
      
      if (savedCode) {
        setEditorValue(savedCode);
      } else {
        // Generate template code based on method signature
        const template = generateTemplateCode(currentFRQ);
        setEditorValue(template);
      }
      setEditorStatus('ready');
    }
  }, [currentFRQ, getSavedCode]);
  
  // Generate template code from method signature
  const generateTemplateCode = (frq) => {
    if (!frq || !frq.methodSignature) return '// Loading...';
    
    // Extract method name and signature
    const methodSig = frq.methodSignature.trim();
    
    // Simple template that includes the method signature and a comment
    return `// ${frq.title || 'FRQ Question'}\n// Write your solution below\n\n${methodSig} {\n    // Your code here\n    \n}`;
  };
  
  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set editor options based on preferences
    if (preferences) {
      editor.updateOptions({
        fontSize: preferences.fontSize || 14,
        minimap: preferences.minimap || { enabled: true },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontFamily: "'Fira Code', monospace",
        fontLigatures: true
      });
    }
    
    // Configure Java language features
    monaco.languages.registerCompletionItemProvider('java', {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'sout',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'System.out.println(${1});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Print to standard output'
          },
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop'
          },
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${2}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If statement'
          }
        ];
        return { suggestions };
      }
    });

    // Add event listeners
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setEditorValue(value);
      setCharCount(value.length);
      setLineCount(value.split('\n').length);
      
      // Auto-save if enabled
      if (preferences.autoSave && currentFRQ) {
        handleSaveCode();
      }
    });
  };
  
  // Handle code execution simulation
  const handleRunCode = () => {
    setShowRunPanel(true);
    setRunOutput('Running code...');
    setIsRunError(false);
    
    // Simulate code execution
    setTimeout(() => {
      try {
        const code = editorRef.current.getValue();
        
        if (!code.trim()) {
          setRunOutput('Error: No code to execute');
          setIsRunError(true);
          return;
        }
        
        // Simple validation
        if (!code.includes('return')) {
          setRunOutput('Warning: Your method may not return a value.\n\nTest execution:\n> Method called\n> No return value detected');
          setIsRunError(true);
          return;
        }
        
        // Simulate successful execution
        let output = 'Compiling Java code...\n> Compilation successful\n\nRunning tests...\n';
        
        // Simulate test results
        if (currentFRQ && currentFRQ.testCases) {
          currentFRQ.testCases.forEach((test, index) => {
            const passed = Math.random() > 0.3; // 70% chance of test passing
            output += `> Test case ${index + 1}: ${passed ? 'PASSED ✓' : 'FAILED ✗'}\n`;
            if (!passed) {
              output += `  Input: ${test.input}\n  Expected: ${test.output}\n  Actual: (different value)\n\n`;
              setIsRunError(true);
            }
          });
        } else {
          output += '> No test cases available for this question.\n';
        }
        
        if (!isRunError) {
          output += '\nAll tests passed successfully!';
        }
        
        setRunOutput(output);
      } catch (error) {
        setRunOutput(`Error executing code: ${error.message}`);
        setIsRunError(true);
      }
    }, 1500);
  };
  
  // Handle saving code
  const handleSaveCode = () => {
    if (!currentFRQ) return;
    
    setSaveStatus('saving');
    
    // Simulate network delay
    setTimeout(() => {
      try {
        const code = editorRef.current.getValue();
        saveCode(currentFRQ.id, code);
        setSaveStatus('saved');
        
        // Reset save status after a few seconds
        setTimeout(() => setSaveStatus(null), 2000);
      } catch (error) {
        setSaveStatus('error');
        console.error('Error saving code:', error);
        
        // Reset save status after a few seconds
        setTimeout(() => setSaveStatus(null), 2000);
      }
    }, 600);
  };

  return (
    <EditorContainer
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <EditorHeader>
        <EditorTitle>
          <FiCode /> Java Solution
        </EditorTitle>
        <EditorActions>
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveCode}
            variant={saveStatus === 'saved' ? 'success' : null}
          >
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'saved' ? <FiCheck /> : 
             saveStatus === 'error' ? <FiAlertCircle /> : 
             <FiSave />}
            <span className="tooltip">Save Code</span>
          </ActionButton>
          
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunCode}
            variant="primary"
          >
            <FiPlayCircle /> Run
            <span className="tooltip">Run Code</span>
          </ActionButton>
        </EditorActions>
      </EditorHeader>
      
      <EditorContent>
        <Editor
          height="100%"
          language="java"
          theme={preferences?.darkMode ? 'vs-dark' : 'vs-light'}
          value={editorValue}
          options={{
            fontSize: preferences?.fontSize || 14,
            minimap: preferences?.minimap || { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: "'Fira Code', monospace",
            fontLigatures: true,
            wordWrap: 'on',
            tabSize: 2,
            lineNumbers: 'on',
          }}
          onMount={handleEditorDidMount}
        />
        
        <AnimatePresence>
          {showRunPanel && (
            <RunPanel
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <RunPanelHeader>
                <h3><FiTerminal /> Execution Output</h3>
                <button onClick={() => setShowRunPanel(false)}>×</button>
              </RunPanelHeader>
              <RunOutput error={isRunError}>
                {runOutput}
              </RunOutput>
            </RunPanel>
          )}
        </AnimatePresence>
      </EditorContent>
      
      <StatusBar>
        <EditorStatus status={editorStatus}>
          {editorStatus === 'error' && <FiAlertCircle className="status-icon" />}
          {editorStatus === 'success' && <FiCheck className="status-icon" />}
          {saveStatus === 'saved' && <span>Changes saved</span>}
          {saveStatus === 'saving' && <span>Saving...</span>}
          {saveStatus === 'error' && <span>Error saving</span>}
        </EditorStatus>
        
        <StatusInfo>
          <span>
            <FiCpu /> Java
          </span>
          <span>
            <FiGitCommit /> Lines: {lineCount}
          </span>
          <span>
            Chars: {charCount}
          </span>
        </StatusInfo>
      </StatusBar>
    </EditorContainer>
  );
}

export default JavaEditor;
