// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Settings from '../Settings';

test('renders a Settings component', () => {
  const { getByText } = render(<Settings />);
  expect(getByText('Settings for your plugin can be defined here.')).toBeInTheDocument();
});
