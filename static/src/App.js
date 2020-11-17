// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

// Main entry point for the UI
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  CircularProgress,
  CssBaseline,
  FormControlLabel,
  Switch,
  Toolbar,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import styles, { light, dark, DATAIQ_THEME_KEY, DATAIQ_DAY_THEME_VALUE } from './styles';
import Main from './Main';
import Settings from './Settings';
import { getToken } from '.';

function App() {
  const classes = styles();

  /**
   * Declare a state variable 'theme', a function 'setTheme', and a default value whatever
   * DataIQ's theme is set to.
   * Used for toggling light/dark theme.
   */
  const dataIQTheme = localStorage.getItem(DATAIQ_THEME_KEY);
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
   * Declare a state variable 'version', a function 'setVersion', and a default value of ''.
   * Used for fetching the version of the plugin via the back end.
   */
  const [version, setVersion] = useState('');
  useEffect(() => {
    /**
     * Fetch the version from the back end.
     *
     * Note: We need to do this string parsing becuase DataIQ's UI service sets a base href that
     * alters our relative routes based on where the plugin window is opened.
     *
     * The plugin window launched from the 'execute' call has a different base href compared to the
     * plugin window launched from the 'settings' call. Since the version string is shown in both
     * views, we need to accommodate for this.
     *
     * Main base href:      https://10.199.194.130/clarity/plugin/DateFilter/jobs/<ident>/
     * Go up two levels to hit /clarity/plugin/DateFilter/version/ route.
     *
     * Settings base href:  https://10.199.194.130/clarity/plugins/DateFilter/settings/
     * Append /version/ to hit /clarity/plugins/DateFilter/settings/version/ route.
     */
    const page = document.getElementById('plugin-example-root').dataset.page;
    const versionPath = page === 'main' ? '../../version/' : './version/';
    fetch(versionPath, {
      method: 'GET',
      headers: {
        Authorization: getToken(),
        'Content-Type': 'text/plain',
      },
    })
      .then((response) => {
        const { ok } = response;
        if (!ok) {
          throw new Error('Error fetching plugin version.');
        }
        return response.text();
      })
      // If the fetch was successful, set the version string
      .then((data) => setVersion(data))
      // If the fetch was unsuccessful or an error otherwise occurred, set an error string
      .catch((error) => {
        const { message } = error;
        setVersion(message);
      });
  }, []);

  // Component to display the plugin version string
  const versionString = (
    <Box flexGrow={1}>
      <Typography display="inline" variant="body1">
        Version:
      </Typography>
      <Box fontSize="body1.fontSize" ml={1} display="inline" fontFamily="Monospace">
        {version}
      </Box>
    </Box>
  );

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
            {versionString}
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
