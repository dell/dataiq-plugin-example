// Main entry point for the UI
import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment';

import Main from './Main';

class App extends React.Component {
  componentDidMount() {
    document.title = 'Plugin Example';
  }

  render() {
    return (
      // Tell all date pickers to use moment.js library
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {/* The Main component is the "action" page of the plugin */}
        <Main />
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
