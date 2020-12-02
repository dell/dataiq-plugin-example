// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Main from '../Main';

// Mock document and parent token function
let spy;
beforeAll(() => {
  spy = jest.spyOn(document, 'getElementById');
  parent.token = () => {
    return 'Bearer ' + 'TEST TOKEN';
  };
});

beforeEach(() => {
  fetch.resetMocks();
});

test('renders a Main component', async () => {
  let mockElement;
  mockElement = document.createElement('div');
  mockElement.setAttribute('id', 'plugin-example-root');
  mockElement.dataset.path = 'dGVzdC9wYXRoL2hlcmU';
  spy.mockReturnValue(mockElement);

  render(
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Main />
    </MuiPickersUtilsProvider>,
  );

  await waitFor(() => expect(screen.queryByTestId('date-picker-from')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByTestId('date-picker-to')).toBeInTheDocument());

  // 'isLoading' boolean is initially true, so the "Loading..." string should show
  waitFor(() => expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument());

  // Mock the fetch
  fetch.mockResponseOnce(JSON.stringify({ path: 'dGVzdC9wYXRoL2hlcmU' }));

  // 'isLoading' boolean is set to false after fetching, so the "Loading..." string should be gone
  await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

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
