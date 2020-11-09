// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

import { makeStyles } from '@material-ui/core/styles';

/**
 * In DataIQ, the theme values used for toggling are the strings 'day' and 'night', using the key of 'theme'.
 * We only have to care about 'day' for now; if it's not 'day', use 'night' (dark) theme.
 */
export const DATAIQ_THEME_KEY = 'theme';
export const DATAIQ_DAY_THEME_VALUE = 'day';

/**
 * Use material UI's built-in "palettes" for easy light/dark theming. It can be expanded or
 * customized if needed.
 *
 * https://material-ui.com/customization/palette/#dark-mode
 */
export const light = {
  palette: {
    type: 'light',
    primary: {
      // This color matches the blue color in DataIQ's "day" theme
      main: '#0076ce',
    },
  },
};

export const dark = {
  palette: {
    type: 'dark',
    primary: {
      // This color matches the blue color in DataIQ's "night" theme
      main: '#53b4c4',
    },
  },
};

const styles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  appContainer: {
    paddingTop: '20px',
  },
  tree: {
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  gridItem: {
    textAlign: 'center',
  },
  datePicker: {
    paddingBottom: '10%',
  },
  button: {
    textTransform: 'none',
  },
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
  },
}));

export default styles;
