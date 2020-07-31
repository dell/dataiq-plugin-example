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
import Config from '../Config';

test('renders a Config component', () => {
  screen.debug();
  const { container, getByText } = render(<Config />);
  expect(getByText('This is a configuration page.')).toBeInTheDocument();
});
