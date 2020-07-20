from os import getcwd
from dataiq.plugin.user import HardcodedAdminUser
from example import Example
from flask import render_template

AUTH_OVERRIDE = HardcodedAdminUser('override')

# Tell the plugin to use our front end directory for serving files
cwd = getcwd()
STATIC_FOLDER = cwd + '/example/static'
TEMPLATE_FOLDER = cwd + '/example/templates'

app = Example(AUTH_OVERRIDE, STATIC_FOLDER, TEMPLATE_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/hello')
def hello():
    return 'Hello from Flask'


if __name__ == '__main__':
    app.run()
