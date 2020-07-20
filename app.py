from os import getcwd
from dataiq.plugin.user import HardcodedAdminUser
from example import Example
from flask import render_template

AUTH_OVERRIDE = HardcodedAdminUser('override')


app = Example(AUTH_OVERRIDE)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hello')
def hello():
    return 'Hello from Flask'


if __name__ == '__main__':
    app.run()
