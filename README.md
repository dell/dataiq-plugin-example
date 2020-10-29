# plugin-example

This plugin example uses a Python/Flask back end and a JavaScript/React front end.

The front end code lives under `/static/`.

## Development

### Build and run the front end UI

The UI will be built and bundled into `/static/dist/bundle.js`. This `bundle.js` file is what is loaded into the browser for the UI.

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
4. Going to `/127.0.0.1:5000/jobs/dGVzdC9wYXRoL2hlcmU`, for example, will show the front end UI.
   - The `<ident>` is a URL-safe Base64 encoded path. The UI will decode it and fetch binning information for this path.

## Packaging

To run the example plugin inside DataIQ it must first be packaged in the way
that the Plugin Manager is expecting. This is accomplished by running
`build.sh <version>`, which will generate a tar.gz that can be passed to the
`plugin_manager install example plugin-centos-base -f <build tar.gz>`

The build tar.gz contains a direct representation of the plugin host storage.
Every file that the flask application needs to run must be contained here, and
will be read into the generated plugin container under the `/hoststorage/`
directory.

Kubernetes will launch the plugin container using `startup.sh`. Use this script
file to configure any runtime behaviors for the plugin.
