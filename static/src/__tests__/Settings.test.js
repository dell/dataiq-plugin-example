import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Settings from '../Settings';

test('renders a Settings component', () => {
  const { getByText } = render(<Settings />);
  expect(getByText('This is a settings page.')).toBeInTheDocument();
});
