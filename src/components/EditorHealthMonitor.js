import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { useMonacoContext } from '../context/MonacoContext';

const FixNotification = styled(motion.div)`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.danger};
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const FixButton = styled(motion.button)`
  background: white;
  color: ${({ theme }) => theme.danger};
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  
  &:hover {
    background: #f8f8f8;
  }
`;

/**
 * A component that monitors Monaco editors for health issues and
 * provides a button to fix typing issues when detected
 */
const EditorHealthMonitor = () => {
  const { hasTypingIssues, fixEditorTypingIssues } = useMonacoContext();
  const [showRetryButton, setShowRetryButton] = useState(false);
  
  useEffect(() => {
    // If issues persist for a while, show retry button
    let timer;
    if (hasTypingIssues) {
      timer = setTimeout(() => {
        setShowRetryButton(true);
      }, 5000);
    } else {
      setShowRetryButton(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [hasTypingIssues]);
  
  const handleFix = () => {
    // Try to fix the editor
    const fixed = fixEditorTypingIssues();
    
    // If fix fails, suggest using the simple editor
    if (!fixed && window.confirm('Could not fix editor issues. Switch to simple editor mode?')) {
      localStorage.setItem('useSimpleEditor', 'true');
      window.location.reload();
    }
  };
  
  // If no issues detected, don't render anything
  if (!hasTypingIssues && !showRetryButton) return null;
  
  return (
    <AnimatePresence>
      {(hasTypingIssues || showRetryButton) && (
        <FixNotification
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <FiAlertCircle size={16} />
          {showRetryButton ? 'Editor issues persist' : 'Editor typing issue detected'}
          <FixButton 
            onClick={handleFix}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw size={12} />
            {showRetryButton ? 'Try Again' : 'Fix Now'}
          </FixButton>
        </FixNotification>
      )}
    </AnimatePresence>
  );
};

export default EditorHealthMonitor;
