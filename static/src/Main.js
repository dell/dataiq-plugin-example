/**
 * This is the main action page of the plugin.
 */

import React, { useEffect, useState } from 'react';
import base64url from 'base64-url';

// Below are all components used from material-ui library to build the UI
import { Tooltip, CircularProgress } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Container from '@material-ui/core/Container';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingBottom: '10px',
    paddingTop: '10px',
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

function Main() {
  // Use material-ui's styling functionality
  const classes = useStyles();

  // Handle date picker changes. Initial value is the current Date.
  const [fromDate, handleFromDateChange] = useState(new Date());
  const [toDate, handleToDateChange] = useState(new Date());

  // Helper functions to format dates consistently
  const fromDateSeconds = () => Math.floor(new Date(fromDate).getTime() / 1000);
  const toDateSeconds = () => Math.floor(new Date(toDate).getTime() / 1000);

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

  // Define our API call here to fetch bin data
  const fetchBins = (data) => {
    /**
     * As a plugin, we get the authorization token from DataIQ, the parent window.
     * If this is running locally in development, parent.token() will not exist.
     *
     * TODO: better detect development vs. production, likely using Node environment variables.
     */
    let token = null;
    if (parent.location.hostname !== '127.0.0.1') {
      token = parent.token();
    }

    // Use the Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    fetch('/bins/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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
        const { paths } = data;

        // Clear error status and message
        handleError(null);

        // Set the `paths` data to use in the UI, after fetching it
        setPaths(paths);
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
     * In templates/index.html, we then set an HTML data attribute called data-path with this value.
     * It then can be accessed via the dataset property.
     *
     * See https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes for more.
     *
     * It comes as a URL-safe base64 encoded string, so we must decode it here.
     * For example, 'L3BhdGgvdGVzdA', decoded from /path/test.
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
  const createTreeNodes = (paths) => {
    const allPaths = paths.map((pathItem) => ({ name: pathItem[0], histogram: pathItem[1] }));
    let result = [];
    let level = { result };

    allPaths.forEach((path, id) => {
      // Reduce our array of paths into one tree object
      path.name.split('/').reduce((accumulator, name, index) => {
        // Check if we've already added this path name
        if (!accumulator[name]) {
          // If not, set this new path name in the tree
          accumulator[name] = { result: [] };
          accumulator.result.push({
            // Use the two indicies (outer loop and inner reducer) as a unique id in the tree
            id: `${id}${index}`,
            // Store the name of this piece
            name,
            // Store the full path of this piece
            fullPath: path.name,
            // Store the children paths of this piece
            children: accumulator[name].result,
            // The count of items between the "from" and "to" dates
            count: path.histogram
              // entry[0] is Unix timestamp in seconds, entry[1] is count
              .filter((entry) => {
                return fromDateSeconds() <= entry[0] && entry[0] <= toDateSeconds();
              })
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
            <Tooltip title="Number of files between the chosen dates" placement="right">
              <Typography variant="caption" color="inherit">
                {nodes.count}
              </Typography>
            </Tooltip>
          </div>
        }
        onLabelClick={() => onLabelClick(nodes.fullPath)}
      >
        {nodes.children.length > 0 ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem>
    );
  };

  // Return the UI for our main page
  return (
    <Container>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={4} className={classes.gridItem}>
            <Grid item xs={12} className={classes.datePicker}>
              <KeyboardDatePicker
                // autoOk
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
                // autoOk
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
      </div>
    </Container>
  );
}

export default Main;
