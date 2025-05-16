import { createGlobalStyle } from 'styled-components';

// Light theme colors
export const lightTheme = {
  // Primary and accent colors
  primary: '#4361EE',      // Vibrant blue - primary actions
  secondary: '#3A0CA3',    // Deep purple - secondary actions
  accent: '#F72585',       // Hot pink - accents and highlights
  
  // State colors
  success: '#4CAF50',      // Green - success states
  warning: '#FF9800',      // Amber - warning states
  danger: '#EF476F',       // Red - error states
  
  // Neutrals
  background: '#F8FAFC',   // Light gray-blue background
  surface: '#FFFFFF',      // White surface
  surfaceVariant: '#F1F5F9', // Light gray surface variant
  
  // Text colors
  textPrimary: '#1E293B',  // Dark blue-gray - primary text
  textSecondary: '#475569', // Medium blue-gray - secondary text
  textTertiary: '#64748B', // Light blue-gray - tertiary text
  textOnPrimary: '#FFFFFF', // White text on dark backgrounds
  
  // UI elements
  border: '#E2E8F0',       // Light gray border
  divider: '#E2E8F0',      // Same as border color
  shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  shadowHover: '0 4px 6px rgba(0, 0, 0, 0.1)',
  
  // Editor specific
  editorBackground: '#FFFFFF',
  editorActiveLineBackground: '#F8FAFC',
  editorLineNumber: '#CBD5E1',
  editorSelectionBackground: 'rgba(79, 70, 229, 0.1)',
  
  // State colors
  stateHover: 'rgba(79, 70, 229, 0.08)',
  stateActive: 'rgba(79, 70, 229, 0.12)',
  stateFocus: 'rgba(79, 70, 229, 0.16)'
};

// Dark theme colors
export const darkTheme = {
  // Primary and accent colors
  primary: '#4361EE',      // Vibrant blue - primary actions
  secondary: '#7209B7',    // Deep purple - secondary actions
  accent: '#F72585',       // Hot pink - accents and highlights
  
  // State colors
  success: '#4CAF50',      // Green - success states
  warning: '#FF9800',      // Amber - warning states
  danger: '#EF476F',         // Keep danger consistent
  
  // Neutrals
  background: '#0F172A',     // Dark blue-gray background
  surface: '#1E293B',        // Slightly lighter surface
  surfaceVariant: '#334155', // Medium blue-gray surfaces
  
  // Text colors
  textPrimary: '#F1F5F9',    // Off-white - primary text
  textSecondary: '#CBD5E1',  // Light gray - secondary text
  textTertiary: '#94A3B8',   // Medium gray - tertiary text
  textOnPrimary: '#FFFFFF',  // White text on dark backgrounds
  
  // UI elements
  border: '#334155',         // Medium blue-gray for borders
  divider: '#334155',        // Same as border color
  shadow: '0 4px 12px rgba(0, 0, 0, 0.3)', 
  shadowHover: '0 8px 24px rgba(0, 0, 0, 0.4)',
  
  // Editor specific
  editorBackground: '#1E293B',
  editorActiveLineBackground: '#273344',
  editorLineNumber: '#64748B',
  editorSelectionBackground: 'rgba(79, 70, 229, 0.25)',
  
  // State colors
  stateHover: 'rgba(79, 70, 229, 0.12)',
  stateActive: 'rgba(79, 70, 229, 0.16)',
  stateFocus: 'rgba(79, 70, 229, 0.24)'
};

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.textPrimary};
    line-height: 1.5;
    transition: background-color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  h4 {
    font-size: 1.25rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
  }
  
  button {
    cursor: pointer;
  }
  
  pre, code {
    font-family: 'Fira Code', monospace;
  }
  
  /* App Layout Specific Styles */
  .App {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .App-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    @media (min-width: 992px) {
      flex-direction: row;
    }
  }
  
  /* Animation Utility Classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  /* Scrollbar Styling */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  *::-webkit-scrollbar-track {
    background: transparent;
  }
  
  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.textTertiary};
  }
  
  /* Selection Styling */
  ::selection {
    background-color: ${({ theme }) => theme.primary}40;
    color: ${({ theme }) => theme.textPrimary};
  }
  
  /* Focus Outline Styling */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
  
  /* Tooltip Styling */
  [data-tooltip] {
    position: relative;
    
    &:after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-4px);
      background-color: ${({ theme }) => theme.surfaceVariant};
      color: ${({ theme }) => theme.textPrimary};
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 100;
      box-shadow: ${({ theme }) => theme.shadow};
      pointer-events: none;
    }
    
    &:hover:after {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-8px);
    }
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }
`;
