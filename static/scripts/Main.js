/**
 * This is the main action page of the plugin.
 */

import React, { useEffect, useState } from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';

// Below are all components used from material-ui library to build the UI
import { Button, Tooltip, CircularProgress } from '@material-ui/core';
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
  },
  tree: {
    paddingLeft: '30%',
    paddingRight: '30%',
  },
  gridItem: {
    textAlign: 'center',
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

  // Store paths data in state. Initial value is an empty array.
  const [paths, setPaths] = useState([]);

  // Store error status in state. Initial value is null.
  const [error, handleError] = useState(null);

  // Store loading status in state. Initial value is true.
  const [isLoading, handleIsLoading] = useState(true);

  // TODO: if needed, we can fetch more info for this path when expanding parent folders
  const onLabelClick = (label) => {
    console.log(`Clicked ${label}`);
  };

  /**
   * TODO: The token will be passed from IXUI and used here. Will need to implement a listener
   * to accept the token from IXUI, possibly using the `postMessage` Window API.
   */
  const token = null;

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
     * It comes encoded from the back end, so we must decode it here.
     * For example, 'L3BhdGgvdGVzdA', decoded from /path/test.
     */
    let path = JSON.parse(document.getElementById('plugin-example-root').dataset.path);
    path = base64.decode(path);
    path = utf8.decode(path);

    const data = {
      path,
      depth: 2,
    };

    fetch('/bins/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      // Format the response into JSON
      .then((response) => response.json())
      .then((data) => {
        const { paths } = data;

        // Clear error status and message
        handleError(null);

        // Set the `paths` data to use in the UI here, after fetching it
        setPaths(paths);
      })
      .catch((error) => {
        // Set error status and message
        handleError(error);
      })
      .finally(() => {
        // Set loading status after success or failure
        handleIsLoading(false);
      });
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
            name,
            histogram: path.histogram,
            children: accumulator[name].result,
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
                {nodes.histogram.length}
              </Typography>
            </Tooltip>
          </div>
        }
        onLabelClick={() => onLabelClick(nodes.name)}
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
          <Grid item xs={6} className={classes.gridItem}>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="From"
              format="MM/DD/yyyy"
              value={fromDate}
              InputAdornmentProps={{ position: 'start' }}
              onChange={(date) => handleFromDateChange(date)}
            />
          </Grid>
          <Grid item xs={6} className={classes.gridItem}>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="To"
              format="MM/DD/yyyy"
              value={toDate}
              InputAdornmentProps={{ position: 'start' }}
              onChange={(date) => handleToDateChange(date)}
            />
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => {
                console.log(`Submit new dates: ${fromDate} to ${toDate}`);
              }}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12}>
            {isLoading && (
              <div className={classes.loading}>
                <Typography variant="body2">Loading...</Typography>
                <CircularProgress />
              </div>
            )}
            {error && (
              <div className={classes.error}>
                <Typography variant="body2">{error}</Typography>
              </div>
            )}
            <TreeView
              className={classes.tree}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultExpanded={['00']}
            >
              {/* Use the paths value in the state, from earlier fetching, to render the tree */}
              {renderTree(createTreeNodes(paths))}
            </TreeView>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default Main;
