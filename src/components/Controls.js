import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiUpload, FiClock, FiSettings, FiCheckCircle, FiAlertTriangle, FiPause, FiPlay, FiSend } from 'react-icons/fi';

const ControlsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  padding: 0.5rem;
`;

const ControlSection = styled(motion.div)`
  background: ${({ theme }) => theme.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const SectionHeader = styled.div`
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.surfaceVariant};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const SectionContent = styled.div`
  padding: 1rem 1.25rem;
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 0.85rem 1rem;
  background: ${({ theme, variant }) => {
    switch(variant) {
      case 'primary': return theme.primary;
      case 'success': return theme.success;
      case 'warning': return theme.warning;
      case 'danger': return theme.danger;
      case 'outlined': return 'transparent';
      default: return theme.primary;
    }
  }};
  color: ${({ theme, variant }) => 
    variant === 'outlined' 
      ? theme.textPrimary 
      : theme.textOnPrimary};
  border: ${({ theme, variant }) => 
    variant === 'outlined' 
      ? `1px solid ${theme.border}` 
      : 'none'};
  border-radius: 8px;
  font-size: 0.925rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
    background: ${({ theme, variant }) => {
      if (variant === 'outlined') return theme.stateHover;
      return variant === 'primary' ? theme.primary : theme[variant];
    }};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`;

const TimerDisplay = styled(motion.div)`
  background: ${({ theme, active, danger }) => {
    if (danger) return `${theme.danger}15`;
    if (active) return `${theme.success}15`;
    return theme.surfaceVariant;
  }};
  border-radius: 8px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme, active, danger }) => {
    if (danger) return `${theme.danger}30`;
    if (active) return `${theme.success}30`;
    return 'transparent';
  }};
  
  .time {
    font-size: 2rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${({ theme, active, danger }) => {
      if (danger) return theme.danger;
      if (active) return theme.success;
      return theme.textPrimary;
    }};
  }
  
  .label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 500;
  }
  
  .timer-icon {
    color: ${({ theme, active, danger }) => {
      if (danger) return theme.danger;
      if (active) return theme.success;
      return theme.textSecondary;
    }};
    font-size: 1.25rem;
  }
`;

const SettingsGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  input {
    width: 18px;
    height: 18px;
    margin-right: 0.75rem;
    accent-color: ${({ theme }) => theme.primary};
  }
  
  label {
    margin-bottom: 0;
    font-size: 0.875rem;
    cursor: pointer;
  }
`;

const ResultIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  text-align: center;
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: ${({ theme, success }) => 
      success ? `${theme.success}20` : `${theme.warning}20`};
    color: ${({ theme, success }) => 
      success ? theme.success : theme.warning};
  }
  
  .message {
    font-weight: 500;
  }
  
  .details {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

function Controls() {
  const { getRandomFRQ, preferences, updatePreferences } = useAppContext();
  const [countdown, setCountdown] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerStatus, setTimerStatus] = useState('idle'); // 'idle', 'running', 'warning', 'danger'
  const [showResult, setShowResult] = useState(null); // null, 'success', 'partial'
  
  // Timer setup
  const startTimer = () => {
    setTimerActive(true);
    setTimerStatus('running');
    setCountdown(25 * 60); // 25 minutes in seconds
  };
  
  const pauseTimer = () => {
    setTimerActive(false);
  };
  
  const resumeTimer = () => {
    setTimerActive(true);
  };
  
  const stopTimer = () => {
    setTimerActive(false);
    setTimerStatus('idle');
    setCountdown(null);
  };

  // Handle new FRQ generation
  const handleGenerateNew = () => {
    // Reset any existing submission result
    setShowResult(null);
    
    // Get a new FRQ
    getRandomFRQ();
  };

  // Handle code submission
  const handleSubmit = () => {
    // This would normally send the code for evaluation
    // For this demo, we'll just show a random result
    const isSuccess = Math.random() > 0.5;
    setShowResult(isSuccess ? 'success' : 'partial');
    
    // If the timer was running, stop it
    if (timerActive) {
      stopTimer();
    }
  };
  
  // Update countdown every second
  useEffect(() => {
    let interval;
    if (timerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          const newTime = prev - 1;
          
          // Update timer status based on remaining time
          if (newTime < 60) { // Less than 1 minute
            setTimerStatus('danger');
          } else if (newTime < 300) { // Less than 5 minutes
            setTimerStatus('warning');
          }
          
          return newTime;
        });
      }, 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
      setTimerStatus('danger');
    }
    return () => clearInterval(interval);
  }, [timerActive, countdown]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ControlsContainer
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {showResult ? (
          <ControlSection
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <SectionHeader>
              <span className="title">
                <FiCheckCircle /> Submission Result
              </span>
            </SectionHeader>
            <SectionContent>
              <ResultIndicator
                success={showResult === 'success'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="icon">
                  {showResult === 'success' ? <FiCheckCircle /> : <FiAlertTriangle />}
                </div>
                <div className="message">
                  {showResult === 'success' 
                    ? 'All tests passed!' 
                    : 'Some tests failed'}
                </div>
                <div className="details">
                  {showResult === 'success'
                    ? 'Your solution works correctly for all test cases.'
                    : 'Your code works for some but not all test cases.'}
                </div>
              </ResultIndicator>
              <ActionButton
                variant="primary"
                onClick={() => setShowResult(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiRefreshCw /> Try Again
              </ActionButton>
              <ActionButton
                variant="outlined"
                onClick={handleGenerateNew}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                New FRQ Question
              </ActionButton>
            </SectionContent>
          </ControlSection>
        ) : (
          <>
            <ControlSection
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <span className="title">
                  <FiSettings /> Controls
                </span>
              </SectionHeader>
              <SectionContent>
                {countdown !== null && (
                  <TimerDisplay 
                    active={timerActive}
                    danger={timerStatus === 'danger'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" }}
                  >
                    <FiClock className="timer-icon" />
                    <div className="time">{formatTime(countdown)}</div>
                    <div className="label">
                      {timerStatus === 'danger' ? 'Time almost up!' : 'Remaining time'}
                    </div>
                  </TimerDisplay>
                )}
              
                {countdown === null && (
                  <ActionButton
                    variant="primary"
                    onClick={startTimer}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiClock /> Start Exam Timer
                  </ActionButton>
                )}
                
                {countdown !== null && !timerActive && (
                  <ActionButton
                    variant="primary"
                    onClick={resumeTimer}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPlay /> Resume Timer
                  </ActionButton>
                )}
                
                {countdown !== null && timerActive && (
                  <ActionButton
                    variant="warning"
                    onClick={pauseTimer}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPause /> Pause Timer
                  </ActionButton>
                )}
                
                {countdown !== null && (
                  <ActionButton
                    variant="danger"
                    onClick={stopTimer}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiRefreshCw /> Reset Timer
                  </ActionButton>
                )}
                
                <ActionButton
                  variant="success"
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiSend /> Submit Solution
                </ActionButton>
                
                <ActionButton
                  variant="outlined"
                  onClick={handleGenerateNew}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiRefreshCw /> New FRQ Question
                </ActionButton>
              </SectionContent>
            </ControlSection>
            
            <ControlSection
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <SectionHeader>
                <span className="title">
                  <FiSettings /> Settings
                </span>
              </SectionHeader>
              <SectionContent>
                <SettingsGroup>
                  <label htmlFor="fontSize">Font Size</label>
                  <Select
                    id="fontSize"
                    value={preferences.fontSize}
                    onChange={(e) => updatePreferences({ fontSize: Number(e.target.value) })}
                  >
                    <option value={12}>Small (12px)</option>
                    <option value={14}>Medium (14px)</option>
                    <option value={16}>Large (16px)</option>
                    <option value={18}>Extra Large (18px)</option>
                  </Select>
                </SettingsGroup>
                
                <SettingsGroup>
                  <Checkbox>
                    <input
                      type="checkbox"
                      id="autoSave"
                      checked={preferences.autoSave}
                      onChange={(e) => updatePreferences({ autoSave: e.target.checked })}
                    />
                    <label htmlFor="autoSave">Auto-save code</label>
                  </Checkbox>
                  
                  <Checkbox>
                    <input
                      type="checkbox"
                      id="minimap"
                      checked={preferences.minimap?.enabled}
                      onChange={(e) => updatePreferences({ 
                        minimap: { enabled: e.target.checked } 
                      })}
                    />
                    <label htmlFor="minimap">Show code minimap</label>
                  </Checkbox>
                </SettingsGroup>
              </SectionContent>
            </ControlSection>
          </>
        )}
      </AnimatePresence>
    </ControlsContainer>
  );
}

export default Controls;
