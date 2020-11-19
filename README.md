# plugin-example

This example plugin, "Time Bound", demonstrates how to add a view into the DataIQ Data Management screens that shows a view of the folder contents using time-bound categories. 

## Overview

The example plugin uses a Python/[Flask](https://flask.palletsprojects.com/) back end and a JavaScript/[React](https://reactjs.org/) front end.

The plugin defines two pages: a main page and a settings page.
The pages are React components that use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to
retrieve data from the back-end Flask server.

The main page displays the filecount for each folder, grouped into data bins by how recently the data has been accessed. The plugin fetches the time ranges for these bins from the DataIQ settings.
The UI provides two date picker components to filter bin information based on the two selected dates.

The settings page shows placeholder text and can be modified to define whatever settings a developer deems necessary.
Examples include rich HTML controls (checkboxes, radio buttons, toggles) or a text area with a configuration file that
was loaded from the back end which can be edited and saved.

## Installation

Download the tarball distribution for the example plugin in the releases section of this repository.
The DataIQ Plugin Manager can be used to install these releases into an existing DataIQ installation.
The Plugin Manager can be found at the following path on your DataIQ host:

```
/opt/dataiq/plugin_manager/bin/plugin_manager
```

Initialize the Plugin Manager at least once between DataIQ installs and updates.
Then, use it to install and start the release tarball.

```
plugin_manager init
plugin_manager install example plugin-centos-base -f <release tar.gz>
plugin_manager start example
```


## Local Development

Export an environment variable called `LOCAL_DEV`. 
At launch, the plugin checks this flag. 
When this flag is set, the plugin uses a test data source in place of actual DataIQ API binning data:

```
export LOCAL_DEV=true
```

Follow the below steps to run the plugin locally for development.

### Build and run the front end UI

The UI is built and bundled into `/static/dist/bundle.js`. 
The `bundle.js` file is loaded into the browser for the UI.

Note: `node` and `npm` (Node package manager) are required to be installed on your system to develop the front end. `npm` is included with Node. Download and install instructions can be found [here for node on Ubuntu/Debian](https://nodejs.org/en/download/). We recommend downloading the "Latest LTS Version".

1. Go into the `/static` directory.
2. Install NPM, including front end dependencies from the `package.json` "dependencies" block:
   - `npm install`
3. Run the build:
   - `npm run build`
   - Or, listen and build the UI as you make edits:
   - `npm run watch`

After you have completed building the UI file, it is ready to be added to the back end server, where it can be served to users.

### Run the back end server

1. Run the back end server from the `app.py` file.
2. The server will listen at `127.0.0.1:5000`.
3. Looking at the routes defined in `app.py`, make sure that `render_template` is defined in the `/jobs/<ident>` route.

To see the main page of the UI, go to `127.0.0.1:5000/jobs/dGVzdC9wYXRoL2hlcmU/`.
 
The `<ident>` is a URL-safe Base64 encoded path. The UI will decode it and fetch binning information for this path.

You can view the settings page locally by going to `127.0.0.1:5000/internal/settings/`.

## Packaging and Installing in DataIQ

Before packaging the example plugin for use in DataIQ, be sure to unset the `LOCAL_DEV` environment variable, if one was set:

```
unset LOCAL_DEV
```

To run the example plugin inside DataIQ it must first be packaged in the way that the Plugin Manager is expecting.
Run `build.sh <version>`. 

This command generates a tar.gz file. Use this file to install the plugin, for example:

```
plugin_manager install example plugin-centos-base -f <build tar.gz>
```

The build tar.gz contains a direct representation of the plugin host storage.
Every file that the flask application needs to run must be contained here, and will be read into the generated plugin
container under the `/hoststorage/` directory.

Kubernetes launches the plugin container using `startup.sh`. Use this script
file to configure any runtime behaviors for the plugin.

After installing, start the plugin with the plugin manager:

```
plugin_manager start example
```

## Using the Example Plugin in DataIQ

After the plugin is installed, enable the plugin: in the DataIQ UI, select Settings > Data management configuration. In the plugin section, select the  ⋮ (vertical ellipses) icon next to the plugin, and select Enable.

To configure the plugin, select the ⋮ (vertical ellipses) icon next to the plugin, and select `Edit configuration`. This opens the ca.control file, where you can configure your plugins.

To use the plugin, select Data Management > Browse, and select a folder under the root path. (The sample plugin does not support using root path: `/`.) In the Actions side panel, select 'Time Bound'. This shows a new window that displays the data in bins according to how recently the file has been accessed.
