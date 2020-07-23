import os
from base64 import urlsafe_b64encode

from dataiq.plugin.context import Context, Parameter
from dataiq.plugin.user import HardcodedAdminUser
from flask import render_template, request, Response

from example import Example

AUTH_OVERRIDE = os.getenv('AUTH_OVERRIDE')
AUTH_OVERRIDE = None if AUTH_OVERRIDE is None else HardcodedAdminUser(AUTH_OVERRIDE)


app = Example(AUTH_OVERRIDE)


@app.route('/hello')
def hello():
    return 'Hello from Flask'


@app.action('/execute/')
def execute(context: Context):
    vpath = context[Parameter.VPATH]
    return Response(status=200, mimetype='text/uri-list',
                    response='../jobs/' + urlsafe_b64encode(vpath)) # L3BhdGgvdGVzdA for example, as encoded /path/test


@app.route('/jobs/<ident>')
def display(ident):
    return render_template('index.html')


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

    files = list(app.bin_provider.bins_for(user, path, depth))

    return {
        'paths': files
    }


if __name__ == '__main__':
    app.run()
