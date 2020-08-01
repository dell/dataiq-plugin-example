import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Config from '../Config';

test('renders a Config component', () => {
  const { container, getByText } = render(<Config />);
  expect(getByText('This is a configuration page.')).toBeInTheDocument();
});
