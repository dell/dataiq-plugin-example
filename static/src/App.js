// Main entry point for the UI
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import styles from './styles';
import Main from './Main';
import Settings from './Settings';

function App() {
  const classes = styles();

  // Declare a state variable 'page', a function 'setPage', and a default value of 'null'
  const [page, setPage] = useState(null);

  /**
   * Similar to the componentDidMount lifecycle method: https://reactjs.org/docs/hooks-effect.html.
   * When the component mounts, parse which page to show which is  passed to us from Flask.
   */
  useEffect(() => {
    setPage(document.getElementById('plugin-example-root').dataset.page);
  }, []);

  return (
    // Set the appropriate UI component based on the page requested in the back end
    <React.Fragment>
      {page === 'main' && <Main />}
      {page === 'settings' && <Settings />}
      {page === null && (
        <div className={classes.loading}>
          <Typography variant="body2">Loading...</Typography>
          <CircularProgress />
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
