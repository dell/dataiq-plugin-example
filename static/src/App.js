// Main entry point for the UI
import React, { useEffect, useState } from 'react';
import { CircularProgress, CssBaseline, FormControlLabel, Switch } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import styles, { light, dark } from './styles';
import Main from './Main';
import Settings from './Settings';

function App() {
  const classes = styles();

  // Check the theme set in DataIQ. Use it for our plugin theme initially.
  const dataIQTheme = localStorage.getItem('theme');

  /**
   * Declare a state variable 'theme', a function 'setTheme', and a default value whatever
   * DataIQ's theme is set to.
   * Used for toggling light/dark theme.
   */
  const [theme, setTheme] = useState(dataIQTheme === 'day' ? true : false);

  // Set our applied theme based on the theme value
  const appliedTheme = createMuiTheme(theme ? light : dark);

  /**
   * Declare a state variable 'page', a function 'setPage', and a default value of 'null'.
   * Used for determining which page to show in the UI.
   */
  const [page, setPage] = useState(null);

  // Toggle our light/dark theme
  const themeToggleButton = (
    <FormControlLabel
      control={<Switch checked={theme} color="primary" onChange={() => setTheme(!theme)} />}
      labelPlacement="start"
      label="Toggle theme"
    />
  );

  /**
   * Similar to the componentDidMount lifecycle method: https://reactjs.org/docs/hooks-effect.html.
   * When the component mounts, parse which page to show. The 'page' data attribute is passed to us
   * from Flask.
   */
  useEffect(() => {
    setPage(document.getElementById('plugin-example-root').dataset.page);
  }, []);

  return (
    <ThemeProvider theme={appliedTheme}>
      <div className={classes.root}>
        {/* This provides a nice blank slate for CSS/styling. https://material-ui.com/components/css-baseline/ */}
        <CssBaseline />
        {themeToggleButton}
        {/* Set the appropriate UI component based on the page requested in the back end */}
        {page === 'main' && <Main />}
        {page === 'settings' && <Settings />}
        {page === null && (
          <div className={classes.loading}>
            <Typography variant="body2">Loading...</Typography>
            <CircularProgress />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
