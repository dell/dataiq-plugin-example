// Main entry point for the UI
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Main from './Main';
import Config from './Config';

class App extends React.Component {
  componentDidMount() {
    document.title = 'Plugin Example';
  }

  render() {
    return (
      /**
       * Wrap our application in react-router's BrowserRouter to handle endpoints from Flask.
       * See https://reactrouter.com/web/guides/quick-start for more info.
       */
      <BrowserRouter>
        {/* Tell all date pickers to use moment.js library */}
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Switch>
            {/* Depending on the route from Flask, show the appropriate component */}
            <Route path="/jobs/" component={Main} />
            <Route path="/configuration/" component={Config} />
          </Switch>
        </MuiPickersUtilsProvider>
      </BrowserRouter>
    );
  }
}

export default App;
