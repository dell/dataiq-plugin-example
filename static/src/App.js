// Main entry point for the UI
import React, { useEffect, useState } from 'react';
import { AppBar, CircularProgress, CssBaseline, FormControlLabel, Switch, Toolbar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import styles, { light, dark, DATAIQ_THEME_KEY, DATAIQ_DAY_THEME_VALUE } from './styles';
import Main from './Main';
import Settings from './Settings';

function App() {
  const classes = styles();

  /**
   * Declare a state variable 'theme', a function 'setTheme', and a default value whatever
   * DataIQ's theme is set to.
   * Used for toggling light/dark theme.
   */
  const dataIQTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(dataIQTheme === DATAIQ_DAY_THEME_VALUE ? true : false);

  // Set our applied theme based on the theme value
  const appliedTheme = createMuiTheme(theme ? light : dark);

  // Toggle our light/dark theme if the user clicks the slider button
  const themeToggleButton = (
    <FormControlLabel
      className={classes.gridItem}
      control={<Switch checked={theme} color="primary" onChange={() => setTheme(!theme)} />}
      labelPlacement="start"
      label="Toggle theme"
    />
  );

  /**
   * Toggle our light/dark theme if DataIQ's theme changes.
   * Uses https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event to listen for
   * storage change events.
   */
  window.onstorage = (event) => {
    // Pull out the 'key' and 'newValue' fields from this storage event
    const { key, newValue } = event;

    // Only change the plugin theme if this storage event is related to DataIQ's theme changing
    if (key === DATAIQ_THEME_KEY) {
      setTheme(newValue === DATAIQ_DAY_THEME_VALUE ? true : false);
    }
  };

  /**
   * Declare a state variable 'page', a function 'setPage', and a default value of 'null'.
   * Used for determining which page to show in the UI.
   */
  const [page, setPage] = useState(null);

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
        {/* This provides a toolbar area at the top of the plugin window for each page */}
        <AppBar position="static" color="default">
          <Toolbar>
            {themeToggleButton}
          </Toolbar>
        </AppBar>
        <div className={classes.appContainer}>
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
      </div>
    </ThemeProvider>
  );
}

export default App;
