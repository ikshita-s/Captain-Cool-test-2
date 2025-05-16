import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import { useMonacoContext } from '../context/MonacoContext';

const FixButtonContainer = styled(motion.button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: ${({ theme }) => theme.danger};
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  
  svg {
    font-size: 20px;
  }
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.surfaceVariant};
  color: ${({ theme }) => theme.textPrimary};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  pointer-events: none;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.2s ease;
  
  ${FixButtonContainer}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    right: 18px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid ${({ theme }) => theme.surfaceVariant};
  }
`;

const EditorFixButton = ({ onSuccess }) => {
  const { fixEditorTypingIssues } = useMonacoContext();
  
  const handleFixClick = () => {
    try {
      const fixed = fixEditorTypingIssues();
      
      if (fixed && onSuccess) {
        onSuccess();
      } else if (!fixed) {
        // If fix fails, suggest switching to simple editor
        if (window.confirm('Could not fix the editor issues. Switch to simple editor mode?')) {
          localStorage.setItem('useSimpleEditor', 'true');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error fixing editor:', error);
      alert('There was an error fixing the editor. Try refreshing the page.');
    }
  };
  
  return (
    <FixButtonContainer
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleFixClick}
      aria-label="Fix editor issues"
      title="Fix editor issues"
    >
      <FiRefreshCw />
      <TooltipContent>Fix editor typing issues</TooltipContent>
    </FixButtonContainer>
  );
};

export default EditorFixButton;

