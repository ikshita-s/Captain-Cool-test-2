import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, lightTheme, darkTheme } from './styles/GlobalStyles';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import FRQDisplay from './components/FRQDisplay';
import JavaEditor from './components/JavaEditor';
import Controls from './components/Controls';
import WelcomeExperience from './components/WelcomeExperience';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

// Styled components for the application layout
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textPrimary};
`;

const MainContent = styled(motion.main)`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  gap: 1rem;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
  
  @media (min-width: 992px) {
    flex-direction: row;
    height: calc(100vh - 60px); /* Adjust based on navbar height */
    padding: 1.5rem;
  }
`;

const FRQSection = styled(motion.section)`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  
  @media (min-width: 992px) {
    max-width: 500px;
    height: 100%;
  }
`;

const EditorSection = styled(motion.section)`
  flex: 2;
  border-radius: 12px;
  overflow: hidden;
  min-height: 400px;
  
  @media (min-width: 992px) {
    height: 100%;
  }
`;

const ControlsSection = styled(motion.section)`
  border-radius: 12px;
  
  @media (min-width: 992px) {
    width: 280px;
  }
`;

// Main application with theming applied
function AppWithTheme() {
  const { darkMode } = useAppContext();
  const theme = darkMode ? darkTheme : lightTheme;
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if we should show welcome experience
  useEffect(() => {
    const dontShow = localStorage.getItem('dontShowWelcome');
    // Show the welcome screen if the user hasn't opted out
    if (!dontShow) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.2,
        duration: 0.4 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <Navbar />
        <MainContent
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <FRQSection variants={itemVariants}>
            <FRQDisplay />
          </FRQSection>
          
          <EditorSection variants={itemVariants}>
            <JavaEditor />
          </EditorSection>
          
          <ControlsSection variants={itemVariants}>
            <Controls />
          </ControlsSection>
        </MainContent>
        
        <AnimatePresence>
          {showWelcome && (
            <WelcomeExperience onClose={() => setShowWelcome(false)} />
          )}
        </AnimatePresence>
      </AppContainer>
    </ThemeProvider>
  );
}

// Wrapper to provide context
function App() {
  return (
    <AppProvider>
      <AppWithTheme />
    </AppProvider>
  );
}

export default App;
