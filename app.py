# Copyright 2020 Dell Inc, or its subsidiaries.
#
# SPDX-License-Identifier: Apache-2.0

import os
from base64 import urlsafe_b64encode

from dataiq.plugin.context import Context, Parameter
from dataiq.plugin.user import HardcodedAdminUser
from flask import render_template, request, Response, send_from_directory

from example import Example

# If provided, authenticate every incoming request as a
#  root account with the given username.
AUTH_OVERRIDE = os.getenv('AUTH_OVERRIDE')
AUTH_OVERRIDE = None if AUTH_OVERRIDE is None else HardcodedAdminUser(AUTH_OVERRIDE)

# Lop off the pod id (last component) from the K8s provided HOSTNAME.
HOSTNAME = os.getenv('HOSTNAME', 'localhost')
HOSTNAME = 'localhost' if HOSTNAME == 'localhost' \
    else '-'.join(HOSTNAME.split('-')[:-1])
PLUGIN_URL = 'http://' + HOSTNAME + ':5000'

app = Example(PLUGIN_URL, AUTH_OVERRIDE)


@app.action('/execute/')
def execute(context: Context):
    vpath = context[Parameter.VPATH]
    vpath_bytes = bytes(vpath, 'utf-8')
    # L3BhdGgvdGVzdA for example, as encoded /path/test,
    # then hits the /jobs/<ident> endpoint below
    return Response(status=200, mimetype='text/uri-list',
                    response=b'../jobs/' + urlsafe_b64encode(vpath_bytes))


@app.route('/jobs/<ident>/')
def display(ident):
    return render_template('index.html', bundle='../../static/dist/bundle.js', page='main', path=ident)


@app.route('/bins/', methods=['POST'])
def bins():
    user = app.require_user()
    form = request.json
    path = form['path']
    depth = form['depth']

    try:
        depth = int(depth)
    except ValueError:
        return 'depth must be an integer', 400

    # files must be a list or iterator of (path, [[date, count]...])
    try:
        bins_list = app.bin_provider.bins_for(user, path, depth)
    except Exception as e:
        return str(e), 400
    if not isinstance(bins_list, list):
        bins_list = list(bins_list)
    return {'paths': bins_list}


@app.route('/internal/settings/static/<path:resource>')
def settings_static(resource):
    return send_from_directory('../static', resource)


@app.route('/version/', methods=['GET'])
def version():
    with app.open_resource('../version') as f:
        contents = f.read()
        return contents


@app.route('/internal/settings/version/', methods=['GET'])
def settings_version():
    with app.open_resource('../version') as f:
        contents = f.read()
        return contents


if __name__ == '__main__':
    app.run()
