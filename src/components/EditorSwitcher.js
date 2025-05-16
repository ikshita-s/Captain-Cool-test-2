import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const SwitcherContainer = styled(motion.div)`
  position: absolute;
  top: 5px;
  right: 10px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textSecondary};
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
  }
`;

const SwitchButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  padding: 3px;
  font-size: 1.2rem;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const EditorSwitcher = ({ isSimpleEditor, onToggle }) => {
  return (
    <SwitcherContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay: 1 }}
    >
      <span>{isSimpleEditor ? 'Simple Editor' : 'Standard Editor'}</span>
      <SwitchButton 
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isSimpleEditor ? 'Switch to standard editor' : 'Switch to simple editor'}
      >
        {isSimpleEditor ? <FiToggleRight /> : <FiToggleLeft />}
      </SwitchButton>
    </SwitcherContainer>
  );
};

export default EditorSwitcher;
