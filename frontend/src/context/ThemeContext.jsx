/*import { createContext, useContext, useState, useEffect, Children } from "react";

const ThemeContext = createContext();

export const ThemeProvider =({Children}) => {
    const[IsDark,setIsDark] = useState(localStorage.getItem('them')==='dark');

    useEffect(()=>{
        if (IsDark){
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme','dark');
        } else {
            document.documentElement.classList.add('light');
            localStorage.setItem('theme','light');
        }
    }, [IsDark]);    

    const toggleTheme = () => setIsDark((prev) => !prev);
    return (
        <ThemeContext.Provider value={{IsDark, toggleTheme}}>
            {Children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
*/
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// This hook intentionally shares the provider's context from this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);