import React, { createContext, useContext, useEffect, useState } from 'react';

// Create app context
const AppContext = createContext();

// Default initial Java code
const DEFAULT_JAVA_CODE = `// Write your solution here
public class Solution {
    
    /**
     * Implement the method as specified in the FRQ.
     * Don't forget to include any needed helper methods.
     */
    public static int[] getColumn(int[][] arr2D, int c) {
        // Your implementation here
        
    }
    
    // Optional: Add a main method to test your solution
    public static void main(String[] args) {
        // Test cases
        int[][] test = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        
        int[] result = getColumn(test, 1);
        for (int val : result) {
            System.out.print(val + " ");
        }
    }
}`;

// Sample FRQs database
const SAMPLE_FRQS = [
  {
    id: 1,
    year: 2021,
    number: 1,
    title: "Methods and Control Structures",
    description: "This free-response question involves implementing methods that manipulate arrays and ArrayLists using control structures. You will need to extract a column from a 2D array and return it as a new 1D array.",
    methodSignature: "public static int[] getColumn(int[][] arr2D, int c)",
    constraints: [
      "The array arr2D is rectangular.",
      "The value of c is a valid column index in arr2D.",
      "You may assume that all values in the array are between 1 and 100, inclusive."
    ],
    testCases: [
      {
        input: "arr2D = [[1, 2, 3], [4, 5, 6], [7, 8, 9]], c = 1",
        output: "[2, 5, 8]"
      },
      {
        input: "arr2D = [[10, 20], [30, 40], [50, 60], [70, 80]], c = 0",
        output: "[10, 30, 50, 70]"
      }
    ],
    difficulty: "Medium",
    timeEstimate: "15 min"
  },
  {
    id: 2,
    year: 2020,
    number: 2,
    title: "Classes and Objects",
    description: "This free-response question involves implementing class methods related to a custom data structure. You will implement a method to add a student to a class roster, ensuring no duplicates are created.",
    methodSignature: "public boolean addStudent(Student student)",
    constraints: [
      "The Student class has a getName() method that returns a String.",
      "No two students in the class roster have the same name.",
      "The method should return true if the student was added, false otherwise."
    ],
    testCases: [
      {
        input: "student.getName() returns \"John\", roster is empty",
        output: "true (John is added to the roster)"
      },
      {
        input: "student.getName() returns \"John\", roster already contains John",
        output: "false (John is not added again)"
      }
    ],
    difficulty: "Medium",
    timeEstimate: "20 min"
  },
  {
    id: 3,
    year: 2019,
    number: 3,
    title: "Array Traversal and Manipulation",
    description: "This free-response question involves implementing a method to find consecutive sequences in an array. You will need to count the number of times a specific value appears consecutively in an array.",
    methodSignature: "public static int countConsecutive(int[] values, int target)",
    constraints: [
      "The array values will contain at least one element.",
      "A sequence must have at least two consecutive occurrences to be counted.",
      "Overlapping sequences should be counted separately."
    ],
    testCases: [
      {
        input: "values = [1, 2, 2, 2, 3, 4, 2, 2], target = 2",
        output: "2 (two sequences of consecutive 2s)"
      },
      {
        input: "values = [5, 5, 5, 5], target = 5",
        output: "3 (three overlapping sequences of consecutive 5s)"
      }
    ],
    difficulty: "Hard",
    timeEstimate: "25 min"
  },
  {
    id: 4,
    year: 2022,
    number: 4,
    title: "ArrayList Operations",
    description: "This free-response question involves implementing a method that filters elements in an ArrayList based on certain criteria. You will create a method to remove elements from an ArrayList that do not meet a specified condition.",
    methodSignature: "public static void filterList(ArrayList<Integer> list, int minValue)",
    constraints: [
      "You must modify the original list, not create a new one.",
      "After the method execution, the list should only contain elements greater than or equal to minValue.",
      "The order of remaining elements should be preserved."
    ],
    testCases: [
      {
        input: "list = [5, 1, 8, 3, 7, 2], minValue = 4",
        output: "list becomes [5, 8, 7]"
      },
      {
        input: "list = [10, 20, 30], minValue = 25",
        output: "list becomes [30]"
      }
    ],
    difficulty: "Easy",
    timeEstimate: "15 min"
  }
];

// Default preferences
const DEFAULT_PREFERENCES = {
  fontSize: 14,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  autoSave: true,
  minimap: { enabled: true },
  wordWrap: 'on',
  tabSize: 2
};

// Provider component
export function AppProvider({ children }) {
  // State variables
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode !== null ? JSON.parse(savedDarkMode) : DEFAULT_PREFERENCES.darkMode;
  });
  
  const [currentFRQ, setCurrentFRQ] = useState(null);
  const [javaCode, setJavaCode] = useState(DEFAULT_JAVA_CODE);
  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : DEFAULT_PREFERENCES;
  });
  const [savedCodes, setSavedCodes] = useState(() => {
    const saved = localStorage.getItem('savedCodes');
    return saved ? JSON.parse(saved) : {};
  });
  const [completionHistory, setCompletionHistory] = useState(() => {
    const history = localStorage.getItem('completionHistory');
    return history ? JSON.parse(history) : [];
  });
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  // Update preferences
  const updatePreferences = (newPrefs) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      
      // If darkMode is included in the new preferences, update it separately
      if ('darkMode' in newPrefs) {
        setDarkMode(newPrefs.darkMode);
      }
      
      return updated;
    });
  };
  
  // Get a random FRQ
  const getRandomFRQ = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_FRQS.length);
    setCurrentFRQ(SAMPLE_FRQS[randomIndex]);
  };
  
  // Save code for a specific FRQ
  const saveCode = (frqId, code) => {
    setSavedCodes(prev => {
      const updated = { ...prev, [frqId]: code };
      return updated;
    });
  };
  
  // Get saved code for a specific FRQ
  const getSavedCode = (frqId) => {
    return savedCodes[frqId] || '';
  };
  
  // Record completion of an FRQ
  const recordCompletion = (frqId, success, timeSpent) => {
    setCompletionHistory(prev => {
      const completion = {
        frqId,
        success,
        timeSpent,
        date: new Date().toISOString()
      };
      return [...prev, completion];
    });
  };
  
  // Get completion history for a specific FRQ
  const getFRQCompletionHistory = (frqId) => {
    return completionHistory.filter(item => item.frqId === frqId);
  };
  
  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Update darkMode in preferences too
    setPreferences(prev => ({
      ...prev,
      darkMode
    }));
  }, [darkMode]);
  
  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);
  
  // Save codes to localStorage
  useEffect(() => {
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }, [savedCodes]);
  
  // Save completion history to localStorage
  useEffect(() => {
    localStorage.setItem('completionHistory', JSON.stringify(completionHistory));
  }, [completionHistory]);
  
  // Load a random FRQ on initial load
  useEffect(() => {
    getRandomFRQ();
  }, []);
  
  // Create context value object
  const contextValue = {
    darkMode,
    toggleDarkMode,
    currentFRQ,
    setCurrentFRQ,
    javaCode,
    setJavaCode,
    preferences,
    updatePreferences,
    getRandomFRQ,
    saveCode,
    getSavedCode,
    recordCompletion,
    getFRQCompletionHistory,
    completionHistory
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
