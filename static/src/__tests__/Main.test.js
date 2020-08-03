import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Main from '../Main';

// Mock location and parent token function
beforeAll(() => {
  const { location } = window;
  delete window.location;

  window.location = {
    hostname: 'test.instance.com',
    pathname: '/jobs/dGVzdC9wYXRoL2hlcmU',
  };
  parent.token = () => {
    return 'Bearer ' + 'TEST TOKEN';
  };
});

beforeEach(() => {
  fetch.resetMocks();
});

afterAll(() => {
  window.location = location;
});

test('renders a Main component', async () => {
  fetch.mockResponseOnce(JSON.stringify({ path: 'dGVzdC9wYXRoL2hlcmU' }));

  render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Main />
    </MuiPickersUtilsProvider>,
  );

  // await waitFor(() => screen.getAllByText('From')[0]);
  // await waitFor(() => screen.getAllByText('To')[0]);

  expect(screen.getAllByText('From')[0]).toBeInTheDocument();
  expect(screen.getAllByText('To')[0]).toBeInTheDocument();
});
