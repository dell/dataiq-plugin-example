import React from 'react';
import Container from '@material-ui/core/Container';

class Main extends React.Component {
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

export default Main;