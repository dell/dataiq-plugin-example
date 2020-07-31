# plugin-example

This plugin example uses a Python/Flask back end and a JavaScript/React front end.

The front end code lives under `/static/`.

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