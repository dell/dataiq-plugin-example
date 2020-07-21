# Copyright © 2016-2020 Dell Inc. or its subsidiaries.
# All Rights Reserved.

set -x

# This script is mounted into its respective plugin container and is
# executed as the default CMD. It sets up the plugin environment and
# installs runtime dependencies.


# These variables explicitly set the container to expect and use UTF-8
# encodings in all file systems. Undefined Behavior may occur if the
# executor is expected to handle text that is not UTF-8.
export LANG=en_US.utf-8
export LC_ALL=en_US.utf-8
export PYTHONUNBUFFERED=1


# Hostname and port to access ClarityNow from within DataIQ.
export CN_HOSTNAME=claritynow:30080


# Uncoment the following line to override all authentication and authorization
# checks in the Flask application. All requests will be authorized as if they
# were a root user with the given username. USE WITH CAUTION.
#export AUTH_OVERRIDE=root_override


# Install the Python 3 dependencies for the plugin code, located in /plugin/deps
python3.8 -m pip install /plugin/deps/* --no-index || exit 1
python3.8 -m pip install -e /plugin/dataiq-plugin -e /plugin/plugin-legacy --no-index || exit 1


# Begin executing the plugin server.
cd /hoststorage/ || exit 1
gunicorn app:app --bind 0.0.0.0:5000