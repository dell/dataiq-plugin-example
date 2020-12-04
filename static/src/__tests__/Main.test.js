// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Main from '../Main';

// Mock document and parent token function
let spy;
let mockElement;

beforeAll(() => {
  jest.spyOn(window, 'fetch');
  parent.token = () => {
    return 'Bearer ' + 'TEST TOKEN';
  };

  // Mock where we render our Main component
  mockElement = document.createElement('div');
  mockElement.setAttribute('id', 'plugin-example-root');
  mockElement.dataset.path = 'dGVzdC9wYXRoL2hlcmU';
  spy = jest.spyOn(document, 'getElementById');
  spy.mockReturnValue(mockElement);
});

beforeEach(() => {
  fetch.resetMocks();
});

test('renders a Main component', async () => {
  // Mock fetch response for a folder with child folders
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      paths: [
        { path: '/test1', bins: [] },
        { path: '/test1/test2', bins: [] },
      ],
    }),
  });

  render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Main />
    </MuiPickersUtilsProvider>,
  );

  // 'isLoading' boolean is initially true, so the "Loading..." string should show
  expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument();

  // Check fetch response after component was mounted
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
      '../../bins/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          path: 'test/path/here',
          depth: 1,
        }),
        headers: {
          Authorization: 'Bearer TEST TOKEN',
          'Content-Type': 'application/json',
        },
      }),
    ),
  );
  expect(fetch).toHaveBeenCalledTimes(1);

  // Verify "From" and "To" date pickers are there
  expect(screen.queryByTestId('date-picker-from')).toBeInTheDocument();
  expect(screen.queryByTestId('date-picker-to')).toBeInTheDocument();

  // 'isLoading' boolean is set to false after fetching, so the "Loading..." string should be gone
  expect(screen.queryByText('Loading...')).toBeNull();

  // Find our 'To' date picker input
  const toDateInput = screen.queryByTestId('date-picker-to').querySelectorAll('input')[0];

  // Change 'To' date to be earlier than 'From' date
  await waitFor(() => fireEvent.change(toDateInput, { target: { value: "12/31/1900" } }));

  // Check error text
  expect(screen.getAllByText(`Date cannot be earlier than 'From' date`)[0]).toBeInTheDocument();

  // Change 'To' date to be later than today's date
  await waitFor(() => fireEvent.change(toDateInput, { target: { value: "12/31/9999" } }));

  // Check error text
  expect(screen.getAllByText('Date cannot be later than today')[0]).toBeInTheDocument();
});

test('renders a Main component when no data is available to display', async () => {
  // Mock fetch response for an empty folder
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ paths: [] }),
  });

  render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Main />
    </MuiPickersUtilsProvider>,
  );

  // Check fetch response after component was mounted
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
      '../../bins/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          path: 'test/path/here',
          depth: 1,
        }),
        headers: {
          Authorization: 'Bearer TEST TOKEN',
          'Content-Type': 'application/json',
        },
      }),
    ),
  );
  expect(fetch).toHaveBeenCalledTimes(1);

  // Error string should show
  expect(screen.getAllByText('No data to display.')[0]).toBeInTheDocument();
});
