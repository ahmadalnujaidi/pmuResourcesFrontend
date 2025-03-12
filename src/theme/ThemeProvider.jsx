import { createContext, useMemo, useState } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Create a context for theme control
export const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: 'dark',
});

export const ThemeProvider = ({ children }) => {
  // Always start with dark mode
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                // Dark mode palette
                primary: {
                  main: '#90caf9',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#fff',
                  secondary: 'rgba(255, 255, 255, 0.7)',
                },
              }
            : {
                // Light mode palette (in case we need it in the future)
                primary: {
                  main: '#1976d2',
                },
                secondary: {
                  main: '#dc004e',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#fff',
                },
              }),
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'dark' 
                  ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
