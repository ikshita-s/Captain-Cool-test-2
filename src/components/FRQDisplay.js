import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiClock, FiClipboard, FiAward, FiCheckCircle, FiAlertCircle, FiCode } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const FRQContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceVariant};
`;

const Title = styled.h2`
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

const InfoBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textSecondary};
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  svg {
    color: ${({ theme }) => theme.accent};
  }
`;

const Content = styled(motion.div)`
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

const FRQDescription = styled(motion.div)`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
  }
  
  strong {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
  }
`;

const ExampleSection = styled(motion.div)`
  margin: 1.5rem 0;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: ${({ theme }) => theme.secondary};
    }
  }
`;

const ExampleItem = styled(motion.div)`
  background: ${({ theme }) => theme.surfaceVariant};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  .label {
    font-weight: 500;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .value {
    font-family: 'Fira Code', monospace;
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const MethodSignature = styled(motion.div)`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${({ theme }) => theme.primary};
`;

const CopyButton = styled(motion.button)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: ${({ theme }) => theme.stateHover};
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const ConstraintsBox = styled(motion.div)`
  background: ${({ theme }) => theme.surfaceVariant};
  border-left: 4px solid ${({ theme }) => theme.accent};
  padding: 1.25rem;
  border-radius: 0 8px 8px 0;
  margin-top: 2rem;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: ${({ theme }) => theme.accent};
    }
  }
  
  ul {
    margin: 0;
    padding-left: 1.25rem;
    
    li {
      margin-bottom: 0.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const DifficultyBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  background: ${({ theme, difficulty }) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return `${theme.success}20`;
      case 'medium': return `${theme.warning}20`;
      case 'hard': return `${theme.danger}20`;
      default: return `${theme.primary}20`;
    }
  }};
  color: ${({ theme, difficulty }) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return theme.success;
      case 'medium': return theme.warning;
      case 'hard': return theme.danger;
      default: return theme.primary;
    }
  }};
  
  svg {
    font-size: 1rem;
  }
`;

const LoadingState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  
  .loader {
    width: 48px;
    height: 48px;
    border: 4px solid ${({ theme }) => theme.border};
    border-top-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${({ theme }) => theme.textSecondary};
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function FRQDisplay() {
  const { currentFRQ, darkMode } = useAppContext();
  const [copied, setCopied] = useState(false);

  const handleCopyMethod = () => {
    if (currentFRQ?.methodSignature) {
      navigator.clipboard.writeText(currentFRQ.methodSignature);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const entryAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (!currentFRQ) {
    return (
      <FRQContainer>
        <LoadingState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="loader" />
          <p>Loading FRQ question...</p>
        </LoadingState>
      </FRQContainer>
    );
  }

  return (
    <FRQContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <Title>
          <FiBook /> FRQ Question
        </Title>
        <InfoBadge>
          <FiAward /> #{currentFRQ.id}
        </InfoBadge>
      </Header>
      
      <Content>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFRQ.id}
            variants={entryAnimation}
            initial="hidden"
            animate="visible"
          >
            <FRQDescription variants={itemAnimation}>
              <h3>{currentFRQ.title}</h3>
              <DifficultyBadge 
                difficulty={currentFRQ.difficulty || 'Medium'} 
                variants={itemAnimation}
              >
                {currentFRQ.difficulty === 'Easy' && <FiCheckCircle />}
                {currentFRQ.difficulty === 'Medium' && <FiClock />}
                {currentFRQ.difficulty === 'Hard' && <FiAlertCircle />}
                {currentFRQ.difficulty || 'Medium'} Difficulty
              </DifficultyBadge>
              <div className="description-content" dangerouslySetInnerHTML={{ __html: currentFRQ.description?.replace(/\n/g, '<br>') }} />
            </FRQDescription>
            
            <MethodSignature variants={itemAnimation}>
              <CopyButton
                onClick={handleCopyMethod}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Copy method signature"
                title="Copy method signature"
              >
                {copied ? <FiCheckCircle /> : <FiClipboard />}
              </CopyButton>
              <SyntaxHighlighter
                language="java"
                style={darkMode ? atomOneDark : atomOneLight}
                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
              >
                {currentFRQ.methodSignature || '// Method signature not available'}
              </SyntaxHighlighter>
            </MethodSignature>
            
            {currentFRQ.testCases && currentFRQ.testCases.length > 0 && (
              <ExampleSection variants={itemAnimation}>
                <h4><FiCode /> Example Cases</h4>
                {currentFRQ.testCases.map((testCase, index) => (
                  <ExampleItem key={index} variants={itemAnimation}>
                    <div className="label">Input:</div>
                    <div className="value">{testCase.input}</div>
                    <div className="label" style={{ marginTop: '0.75rem' }}>Expected Output:</div>
                    <div className="value">{testCase.output}</div>
                  </ExampleItem>
                ))}
              </ExampleSection>
            )}
            
            {currentFRQ.constraints && (
              <ConstraintsBox variants={itemAnimation}>
                <h4><FiAlertCircle /> Constraints</h4>
                {typeof currentFRQ.constraints === 'string' ? (
                  <p>{currentFRQ.constraints}</p>
                ) : (
                  <ul>
                    {currentFRQ.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                )}
              </ConstraintsBox>
            )}
          </motion.div>
        </AnimatePresence>
      </Content>
    </FRQContainer>
  );
}

export default FRQDisplay;
