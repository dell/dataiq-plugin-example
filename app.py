from dataiq.plugin.user import HardcodedAdminUser

from example import Example


AUTH_OVERRIDE = HardcodedAdminUser('override')


app = Example(AUTH_OVERRIDE)


@app.route('/hello')
def hello():
    return 'Hello World'


if __name__ == '__main__':
    app.run()
