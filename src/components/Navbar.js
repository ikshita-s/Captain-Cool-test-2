import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FiSun, FiMoon, FiCode, FiAlertCircle, FiBook, FiCoffee, FiHelpCircle, FiGithub, FiList } from 'react-icons/fi';

const StyledHeader = styled(motion.header)`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .logo-icon {
    color: ${({ theme }) => theme.primary};
    font-size: 1.75rem;
  }
  
  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(45deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    text-decoration: none;
    white-space: nowrap;
    
    @media (max-width: 600px) {
      font-size: 1.1rem;
    }
    
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ThemeToggle = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: transparent;
  color: ${({ theme }) => theme.textPrimary};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.stateHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const NavButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: ${({ primary, theme }) => 
    primary ? theme.primary : 'transparent'};
  color: ${({ primary, theme }) => 
    primary ? theme.textOnPrimary : theme.textPrimary};
  border: ${({ primary, theme }) => 
    primary ? 'none' : `1px solid ${theme.border}`};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    background: ${({ primary, theme }) => 
      primary ? theme.primary : theme.stateHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    
    .button-text {
      display: none;
    }
  }
`;

const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: 1rem;
  background: ${({ theme }) => theme.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadowHover};
  overflow: hidden;
  min-width: 200px;
  z-index: 110;
`;

const DropdownItem = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: transparent;
  color: ${({ theme }) => theme.textPrimary};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  text-align: left;
  font-size: 0.875rem;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.stateHover};
  }
  
  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 1.1rem;
  }
`;

function Navbar() {
  const { darkMode, toggleDarkMode } = useAppContext();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const handleShowWelcome = () => {
    localStorage.removeItem('dontShowWelcome');
    setShowWelcome(true);
  };
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  return (
    <StyledHeader
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Logo
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FiCode className="logo-icon" />
        <span className="logo-text">AP CSA FRQ Generator</span>
      </Logo>
      
      <Actions>
        <NavButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShowWelcome}
        >
          <FiHelpCircle />
          <span className="button-text">Help</span>
        </NavButton>
        
        <ThemeToggle
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </ThemeToggle>
        
        <NavButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMenu}
        >
          <FiList />
          <span className="button-text">Menu</span>
        </NavButton>
      </Actions>
      
      <AnimatePresence>
        {showMenu && (
          <MenuDropdown
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <DropdownItem onClick={() => {
              window.open('https://github.com/yourusername/ap-csa-frq-generator', '_blank');
              setShowMenu(false);
            }}>
              <FiGithub /> View on GitHub
            </DropdownItem>
            <DropdownItem onClick={() => {
              // Open documentation or about page
              setShowMenu(false);
            }}>
              <FiBook /> Documentation
            </DropdownItem>
            <DropdownItem onClick={() => {
              window.open('https://apstudents.collegeboard.org/courses/ap-computer-science-a', '_blank');
              setShowMenu(false);
            }}>
              <FiAlertCircle /> AP CSA Exam Info
            </DropdownItem>
            <DropdownItem onClick={() => {
              // Open sponsor or donate page
              setShowMenu(false);
            }}>
              <FiCoffee /> Support This Project
            </DropdownItem>
          </MenuDropdown>
        )}
      </AnimatePresence>
    </StyledHeader>
  );
}

export default Navbar;
