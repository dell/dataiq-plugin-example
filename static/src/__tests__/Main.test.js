// Import dependencies
import React from 'react';

// Import API mocking utilities from Mock Service Worker
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

// Import custom Jest matchers from jest-dom for easier testing
import '@testing-library/jest-dom/extend-expect';

// The component to test
import Main from '../Main';

// Our Main component relies on this wrapper, as seen in App.py
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

// document.createElement(<div id="plugin-example-root" data-path="dGVzdC9wYXRoL2hlcmU"></div>);
JSON.parse = jest.fn().mockImplementationOnce(() => {
  'dGVzdC9wYXRoL2hlcmU';
});

test('renders a Main component', () => {
  screen.debug();
  const { container, getByText } = render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Main />
    </MuiPickersUtilsProvider>,
  );
  expect(getByText('This is a configuration page.')).toBeInTheDocument();
});
