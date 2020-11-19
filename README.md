# plugin-example

This example plugin uses a Python/[Flask](https://flask.palletsprojects.com/) back end and a JavaScript/[React](https://reactjs.org/) front end.

## Overview

The plugin defines two pages: a main page and a settings page.
They are React components that use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to
retrieve data from the back end Flask server.

The main page fetches ClarityNow binning information for a given path and displays the count of files in each bin in the UI.
The UI provides two date picker components to filter bin information based on the two selected dates.

The settings page shows placeholder text, but provides a page where a developer can define whatever settings they deem necessary.
Examples include rich HTML controls (checkboxes, radio buttons, toggles) or a text area with a configuration file that
was loaded from the back end which can be edited and saved.

## Installation

You can find a tarball distribution for the example plugin in the releases section of this repository.
The DataIQ Plugin Manager can be used to install these releases into an existing DataIQ installation.
It can be found at the following path on your DataIQ host, but will be abbreviated in the remainder of this document.

```
/opt/dataiq/plugin_manager/bin/plugin_manager
```

Be sure to initialize the plugin manager at least once between DataIQ installs and updates.
Then you can use it to install and start the release tarball.

```
plugin_manager init
plugin_manager install example plugin-centos-base -f <release tar.gz>
plugin_manager start example
```


## Local Development

Export an environment variable called `LOCAL_DEV`. 
This flag will be checked when launching the plugin. 
If it is set, the plugin will use a "dummy" data source in place of actual ClarityNow API binning data:

```
export LOCAL_DEV=true
```

Follow the below steps to run the plugin locally for development.

### Build and run the front end UI

The UI will be built and bundled into `/static/dist/bundle.js`. 
This `bundle.js` file is what is loaded into the browser for the UI.

Note: `node` and `npm` (Node package manager) are required to be installed on your system to develop the front end. `npm` is included with Node. Download and install instructions can be found [here for node on Ubuntu/Debian](https://nodejs.org/en/download/). We recommend the "Latest LTS Version".

1. Go into the `/static` directory.
2. From the command line, run `npm install`.
   - This will install front end dependencies from the `package.json` "dependencies" block.
3. From the command line, run `npm run build`
   - You can also run `npm run watch`. This will listen and build the UI as you make edits.

The UI file is now ready to be served by the back end server.

### Run the back end server

1. Run the back end server from the `app.py` file.
2. The server will listen at `127.0.0.1:5000`.
3. Looking at the routes defined in `app.py`, see that `render_template` is defined in the `/jobs/<ident>` route.
4. Going to `127.0.0.1:5000/jobs/dGVzdC9wYXRoL2hlcmU/`, for example, will show the main page of the front end UI.
   - The `<ident>` is a URL-safe Base64 encoded path. The UI will decode it and fetch binning information for this path.

You can view the settings page locally by going to `127.0.0.1:5000/internal/settings/`.

## Packaging and Installing in DataIQ

Before packaging the example plugin for use in DataIQ, be sure to unset the `LOCAL_DEV` environment variable, if one was set:

```
unset LOCAL_DEV
```

To run the example plugin inside DataIQ it must first be packaged in the way that the Plugin Manager is expecting.
This is accomplished by running `build.sh <version>`, which will generate a tar.gz that can be passed to the plugin 
manager install command:

```
plugin_manager install example plugin-centos-base -f <build tar.gz>
```

The build tar.gz contains a direct representation of the plugin host storage.
Every file that the flask application needs to run must be contained here, and will be read into the generated plugin
container under the `/hoststorage/` directory.

Kubernetes will launch the plugin container using `startup.sh`. Use this script
file to configure any runtime behaviors for the plugin.

After installing, start the plugin with the plugin manager:
```
plugin_manager start example
```

## Using the Example Plugin in DataIQ

After the plugin is installed, be sure to first enable the plugin via the DataIQ "Data management configuration" page, using the kebab (three vertical dots) button.

The plugin's setting page can be launched from the same "Data management configuration" page by clicking "Edit configuration" via the kebab button.

The plugin's main page can be launched from DataIQ's "Actions" side panel tab when a path is selected in the UI. Note that the example plugin is not supported on the root path (`/`); select a folder under the root path for the example plugin's main action to appear in the actions menu. It is labeled "Time Bound".
