/**
 * This is the settings page of the plugin.
 */

import React from 'react';
import Container from '@material-ui/core/Container';

class Settings extends React.Component {
  componentDidMount() {
    console.log('Settings component mounted');
  }

  render() {
    return (
      <Container>
        This is a settings page.
      </Container>
    )
  }
}

export default Settings;