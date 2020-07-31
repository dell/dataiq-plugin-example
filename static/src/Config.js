/**
 * This is the configuration page of the plugin.
 */

import React from 'react';
import Container from '@material-ui/core/Container';

class Config extends React.Component {
  componentDidMount() {
    console.log('Config component mounted');
  }

  render() {
    return (
      <Container>
        This is a configuration page.
      </Container>
    )
  }
}

export default Config;