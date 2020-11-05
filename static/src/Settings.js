// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

/**
 * This is the settings page of the plugin.
 */
import React from 'react';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

function Settings() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" gutterBottom>
        Settings for your plugin can be defined here.
      </Typography>
    </Container>
  );
}

export default Settings;
