// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

/**
 * This is the main action page of the plugin.
 */
import React, { useEffect, useState } from 'react';
import base64url from 'base64-url';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

// Below are all components used from material-ui library to build the UI
import { Tooltip, CircularProgress } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Container from '@material-ui/core/Container';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import { getToken } from '.';

function Main() {
  // Use material-ui's styling functionality
  const classes = styles();

  // Handle date picker changes. Initial value is the current Date.
  const [fromDate, handleFromDateChange] = useState(new Date());
  const [toDate, handleToDateChange] = useState(new Date());

  // Helper functions to format dates consistently
  const fromDateSeconds = () => Math.floor(new Date(fromDate).getTime() / 1000);
  const toDateSeconds = () => Math.floor(new Date(toDate).getTime() / 1000);
  const getEpochSeconds = (date) => moment.utc(date, 'YYYY-MM-DD').valueOf() / 1000;

  // Store paths data in state. Initial value is an empty array.
  const [paths, setPaths] = useState([]);

  // Store error status in state. Initial value is null.
  const [error, handleError] = useState(null);

  // Store loading status in state. Initial value is true.
  const [isLoading, handleIsLoading] = useState(true);

  // Fetch more info for this path when expanding parent folders
  const onLabelClick = (path) => {
    const data = {
      path,
      depth: 1,
    };
    fetchBins(data);
  };

  /**
   * We do not yet roll-up the binning count to a parent folder, so if this is a parent node,
   * do not show the count. Otherwise the numbers would appear to not add up correctly.
   */
  const showCount = (nodes) => nodes.children.length === 0;

  // Define our API call here to fetch bin data
  const fetchBins = (data) => {
    /**
     * Use the Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API.
     * This must be a relative path for proper URL parsing when the plugin is running in DataIQ.
     */
    fetch('../../bins/', {
      method: 'POST',
      headers: {
        Authorization: getToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        /**
         * Handle non-200 responses.
         * https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
         */
        const { ok } = response;
        if (!ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        // Format response into JSON
        return response.json();
      })
      // Handle JSON-formatted response from previous block
      .then((data) => {
        // Store new paths from response data
        const { paths: newPaths } = data;

        // Clear error status and message
        handleError(null);

        // Combine the existing path data with the new path data after fetching it
        setPaths([...paths, ...newPaths]);
      })
      .catch((error) => {
        console.log({ error });

        // Set a default error message if we cannot pull a message from the error
        const {
          message = 'An error occurred. Please try again. If the problem persists, please contact support.',
        } = error;
        handleError(message);
      })
      .finally(() => {
        // Set loading status after success or failure
        handleIsLoading(false);
      });
  };

  /**
   * Similar to the componentDidMount lifecycle method: https://reactjs.org/docs/hooks-effect.html.
   * When the component mounts, fetch the bins for the passed in path.
   */
  useEffect(() => {
    /**
     * The path to fetch when the component mounts (when the plugin is first loaded) comes
     * in the URL from the Flask back end.
     *
     * In the @app.route('/jobs/<ident>') route in app.py, we set the path value.
     * In templates/index.html, we then set an HTML data attribute called data-path with this
     * value.
     * It then can be accessed via the dataset property.
     *
     * See https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes for more.
     *
     * It comes as a URL-safe base64 encoded string, so we must decode it here.
     * For example, the path comes as 'L3BhdGgvdGVzdA'; this encoded piece gets decoded
     * into "/path/test".
     */
    let path = document.getElementById('plugin-example-root').dataset.path;
    path = base64url.decode(base64url.unescape(path));

    const data = {
      path,
      depth: 1,
    };
    fetchBins(data);
  }, []);

  /**
   * Construct an array to represent a tree using the paths from the API response.
   * This combines the material-ui documentation with a Stack Overflow question.
   *
   * https://material-ui.com/components/tree-view/#rich-object
   * https://stackoverflow.com/a/57344801
   */
  const createTreeNodes = (data) => {
    let result = [];
    let level = { result };

    data.forEach((item, id) => {
      // Reduce our array of paths into one tree object
      const pathArray = item.path.split('/');
      pathArray.reduce((accumulator, name, index) => {
        /**
         * Create parent path so we can form the full path of this piece.
         * Used for fetching child bin info of parent paths.
         */
        let parent = '';
        for (let i = 0; i < index; i++) {
          parent += pathArray[i] + '/';
        }
        const fullPath = parent + name;

        // Check if we've already added this path name
        if (!accumulator[name]) {
          // If not, set this new path name in the tree
          accumulator[name] = { result: [] };
          accumulator.result.push({
            // Use the two indicies (outer loop and inner reducer) as a unique id in the tree
            id: `${id}${index}`,
            // Store the name of this piece. Use '/' for root path.
            name: name === '' ? '/' : name,
            // Store the full path of this piece. Use '/' for root path.
            fullPath: fullPath === '' ? '/' : fullPath,
            // Store the children paths of this piece
            children: accumulator[name].result,
            // The count of items between the "from" and "to" dates
            count: item.bins
              .filter((entry) => {
                // The "date" value is stored in entry[0], formatted as yyyy-MM-dd
                return (
                  fromDateSeconds() <= getEpochSeconds(entry[0]) &&
                  getEpochSeconds(entry[0]) <= toDateSeconds()
                );
              })
              // The "count" value is stored in entry[1]
              .map((entry) => entry[1])
              .reduce((accumulator, currentValue) => {
                return (accumulator += currentValue);
              }, 0),
          });
        }

        return accumulator[name];
        // Provide an inital value to our reducer
      }, level);
    });

    return result[0];
  };

  /**
   * Construct our tree of TreeItem UI components.
   * https://material-ui.com/api/tree-item/
   */
  const renderTree = (nodes) => {
    if (!nodes) {
      return null;
    }

    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <div className={classes.labelRoot}>
            <Typography variant="body2" className={classes.labelText}>
              {nodes.name}
            </Typography>
            {showCount(nodes) && (
              <Tooltip title="Number of files modified between the two dates" placement="right">
                <Typography variant="caption" color="inherit">
                  {nodes.count}
                </Typography>
              </Tooltip>
            )}
          </div>
        }
        // Fetching bin information for the root path is not supported
        onLabelClick={() => (nodes.fullPath === '/' ? null : onLabelClick(nodes.fullPath))}
      >
        {nodes.children.length > 0 ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem>
    );
  };

  // Return the UI for our main page
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={4} className={classes.gridItem}>
            <Grid item xs={12} className={classes.datePicker}>
              <KeyboardDatePicker
                disableFuture
                variant="inline"
                inputVariant="outlined"
                label="From"
                format="MM/DD/yyyy"
                value={fromDate}
                InputAdornmentProps={{ position: 'start' }}
                onChange={(date) => handleFromDateChange(date)}
              />
            </Grid>
            <Grid item xs={12} className={classes.datePicker}>
              <KeyboardDatePicker
                disableFuture
                variant="inline"
                inputVariant="outlined"
                label="To"
                format="MM/DD/yyyy"
                value={toDate}
                InputAdornmentProps={{ position: 'start' }}
                onChange={(date) => handleToDateChange(date)}
              />
            </Grid>
          </Grid>
          <Grid item xs={8}>
            {isLoading && (
              <div className={classes.loading}>
                <Typography variant="body2">Loading...</Typography>
                <CircularProgress />
              </div>
            )}
            {error ? (
              <div className={classes.error}>
                <Typography variant="body2">{error}</Typography>
              </div>
            ) : (
              <TreeView
                className={classes.tree}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultExpanded={['00']}
              >
                {/* Use the paths value in the state, from earlier fetching, to render the tree */}
                {renderTree(createTreeNodes(paths))}
              </TreeView>
            )}
          </Grid>
        </Grid>
      </Container>
    </MuiPickersUtilsProvider>
  );
}

export default Main;
