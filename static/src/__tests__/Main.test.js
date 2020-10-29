import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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

  fetch.mockResponseOnce(JSON.stringify({ path: 'dGVzdC9wYXRoL2hlcmU' }));

  expect(screen.getAllByText('From')[0]).toBeInTheDocument();
  expect(screen.getAllByText('To')[0]).toBeInTheDocument();

  // Test loading status
  expect(screen.getAllByText('Loading...')[0]).toBeInTheDocument();
});
