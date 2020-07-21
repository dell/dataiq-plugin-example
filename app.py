import os

from dataiq.plugin.context import Context
from dataiq.plugin.user import HardcodedAdminUser
from flask import render_template

from example import Example

AUTH_OVERRIDE = os.getenv('AUTH_OVERRIDE')
AUTH_OVERRIDE = None if AUTH_OVERRIDE is None else HardcodedAdminUser(AUTH_OVERRIDE)


app = Example(AUTH_OVERRIDE)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hello')
def hello():
    return 'Hello from Flask'


@app.action('/execute')
def execute(context: Context):
    print(context)


@app.route('/bins', methods=['GET', 'POST'])
def bins():
    user = app.require_user()
    return str(user)


if __name__ == '__main__':
    app.run()
