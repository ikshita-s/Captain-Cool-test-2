import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiCode, FiPlay, FiCheckCircle, FiStar, FiUser, FiClock, FiBook, FiSettings } from 'react-icons/fi';

const WelcomeOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(8px);
`;

const WelcomeCard = styled(motion.div)`
  background: ${({ theme }) => theme.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadowHover};
  position: relative;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.surfaceVariant};
  color: ${({ theme }) => theme.textSecondary};
  border: none;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: ${({ theme }) => theme.stateHover};
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const CardHeader = styled.div`
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  
  h2 {
    margin-bottom: 0.5rem;
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(45deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
  
  p {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 0;
    font-size: 1.05rem;
  }
`;

const CardContent = styled.div`
  padding: 0;
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
`;

const CardFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
  ${({ primary, theme }) => primary ? `
    background: ${theme.primary};
    color: ${theme.textOnPrimary};
    border: none;
  ` : `
    background: transparent;
    color: ${theme.textPrimary};
    border: 1px solid ${theme.border};
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProgressDots = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
`;

const ProgressDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: ${({ active, theme }) => active ? theme.primary : theme.border};
  transition: all 0.3s ease;
  
  ${({ active }) => active && `
    width: 20px;
  `}
`;

const DontShowOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  
  input {
    accent-color: ${({ theme }) => theme.primary};
  }
`;

const WelcomeStep = styled(motion.div)`
  padding: 2rem;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 1.5rem 0;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  
  .icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
    background: ${({ theme, color }) => {
      switch(color) {
        case 'primary': return `${theme.primary}20`;
        case 'success': return `${theme.success}20`;
        case 'warning': return `${theme.warning}20`;
        case 'danger': return `${theme.danger}20`;
        case 'secondary': return `${theme.secondary}20`;
        case 'accent': return `${theme.accent}20`;
        default: return `${theme.primary}20`;
      }
    }};
    color: ${({ theme, color }) => {
      switch(color) {
        case 'primary': return theme.primary;
        case 'success': return theme.success;
        case 'warning': return theme.warning;
        case 'danger': return theme.danger;
        case 'secondary': return theme.secondary;
        case 'accent': return theme.accent;
        default: return theme.primary;
      }
    }};
  }
  
  .content {
    flex: 1;
    
    h4 {
      margin: 0 0 0.25rem;
      font-size: 1.1rem;
    }
    
    p {
      margin: 0;
      color: ${({ theme }) => theme.textSecondary};
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
`;

const StepImage = styled.div`
  margin: 1.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const GettingStarted = styled.div`
  background: ${({ theme }) => theme.surfaceVariant};
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  
  h4 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: ${({ theme }) => theme.primary};
    }
  }
  
  ol {
    margin: 0;
    padding-left: 1.25rem;
    
    li {
      margin-bottom: 0.75rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { 
      duration: 0.2 
    } 
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    x: -50,
    transition: { 
      duration: 0.2 
    } 
  }
};

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1,
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    }
  })
};

function WelcomeExperience({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShow, setDontShow] = useState(false);
  
  const totalSteps = 3;
  
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleClose = () => {
    if (dontShow) {
      localStorage.setItem('dontShowWelcome', 'true');
    }
    onClose();
  };
  
  return (
    <WelcomeOverlay
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <WelcomeCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CloseButton
          onClick={handleClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiX />
        </CloseButton>
        
        <CardHeader>
          <h2>Welcome to AP CSA FRQ Practice</h2>
          <p>Your interactive environment for mastering Java Free Response Questions</p>
          <ProgressDots>
            {Array(totalSteps).fill(0).map((_, i) => (
              <ProgressDot key={i} active={i === currentStep} />
            ))}
          </ProgressDots>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <WelcomeStep
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3>AP CSA FRQ Generator</h3>
                <p>
                  This application helps you practice Free Response Questions (FRQs) for the AP Computer Science A exam, 
                  simulating the actual exam environment with authentic question formats.
                </p>
                
                <FeatureList>
                  <FeatureItem 
                    color="primary"
                    variants={featureVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="icon">
                      <FiBook />
                    </div>
                    <div className="content">
                      <h4>Authentic FRQ Format</h4>
                      <p>Practice with questions that mimic real AP exam questions, including method implementations,
                      class designs, and array manipulations.</p>
                    </div>
                  </FeatureItem>
                  
                  <FeatureItem 
                    color="success"
                    variants={featureVariants}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="icon">
                      <FiCode />
                    </div>
                    <div className="content">
                      <h4>Real-time Java Editor</h4>
                      <p>Write your solutions in a full-featured Java editor with syntax highlighting, 
                      code completion, and error detection.</p>
                    </div>
                  </FeatureItem>
                  
                  <FeatureItem 
                    color="accent"
                    variants={featureVariants}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="icon">
                      <FiClock />
                    </div>
                    <div className="content">
                      <h4>Timed Practice Mode</h4>
                      <p>Simulate exam conditions with a countdown timer that helps you practice 
                      working under time constraints.</p>
                    </div>
                  </FeatureItem>
                </FeatureList>
                
                <StepImage>
                  <img src="https://via.placeholder.com/600x300" alt="AP CSA FRQ Generator Interface" />
                </StepImage>
              </WelcomeStep>
            )}
            
            {currentStep === 1 && (
              <WelcomeStep
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3>Key Features</h3>
                <p>
                  Everything you need to excel in your AP Computer Science A exam preparation:
                </p>
                
                <FeatureList>
                  <FeatureItem 
                    color="secondary"
                    variants={featureVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="icon">
                      <FiPlay />
                    </div>
                    <div className="content">
                      <h4>Run & Test Your Code</h4>
                      <p>Execute your Java code and test it against our suite of test cases to ensure your solution works correctly.</p>
                    </div>
                  </FeatureItem>
                  
                  <FeatureItem 
                    color="warning"
                    variants={featureVariants}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="icon">
                      <FiSettings />
                    </div>
                    <div className="content">
                      <h4>Customizable Environment</h4>
                      <p>Personalize your learning experience with adjustable editor settings, font sizes, and other preferences.</p>
                    </div>
                  </FeatureItem>
                  
                  <FeatureItem 
                    color="primary"
                    variants={featureVariants}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="icon">
                      <FiStar />
                    </div>
                    <div className="content">
                      <h4>Progress Tracking</h4>
                      <p>Monitor your improvement over time with detailed statistics and completion history for each question.</p>
                    </div>
                  </FeatureItem>
                  
                  <FeatureItem 
                    color="success"
                    variants={featureVariants}
                    custom={3}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="icon">
                      <FiCheckCircle />
                    </div>
                    <div className="content">
                      <h4>Auto-Saving</h4>
                      <p>Never lose your work with automatic saving of your solutions as you type.</p>
                    </div>
                  </FeatureItem>
                </FeatureList>
              </WelcomeStep>
            )}
            
            {currentStep === 2 && (
              <WelcomeStep
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3>Getting Started</h3>
                <p>
                  You're ready to begin practicing! Here's how to make the most of this application:
                </p>
                
                <GettingStarted>
                  <h4><FiArrowRight /> Quick Start Guide</h4>
                  <ol>
                    <li>Read the FRQ question in the left panel carefully</li>
                    <li>Write your Java solution in the center code editor</li>
                    <li>Use the "Run" button to test your solution</li>
                    <li>Start the timer to simulate exam conditions</li>
                    <li>Click "Submit Solution" when you've finished</li>
                    <li>Review feedback and generate a new question when ready</li>
                  </ol>
                </GettingStarted>
                
                <p>
                  <strong>Pro Tip:</strong> The AP CSA exam allocates approximately 20-25 minutes per FRQ. 
                  Practice with our timer to ensure you can complete questions within this timeframe.
                </p>
                
                <p>
                  Your progress and preferences will be automatically saved. Click "Get Started" below to begin
                  your AP CSA FRQ practice!
                </p>
              </WelcomeStep>
            )}
          </AnimatePresence>
        </CardContent>
        
        <CardFooter>
          <DontShowOption>
            <input 
              type="checkbox" 
              id="dontShow" 
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
            />
            <span>Don't show again</span>
          </DontShowOption>
          
          <div className="buttons">
            {currentStep > 0 && (
              <FooterButton
                onClick={prevStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </FooterButton>
            )}
            <FooterButton
              primary
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentStep < totalSteps - 1 ? 'Next' : 'Get Started'} <FiArrowRight />
            </FooterButton>
          </div>
        </CardFooter>
      </WelcomeCard>
    </WelcomeOverlay>
  );
}

export default WelcomeExperience;
