import jwt
import pytest

import app


class AppTest:
    @pytest.fixture
    def auth_provider(self):
        def token(sub: str, priv: int):
            return b'Bearer ' + jwt.encode({
                'sub': sub,
                'priv': priv,
                'preferred_username': sub
            }, 'secret')
        yield token

    @pytest.fixture
    def client(self):
        app.app.config['TESTING'] = True

        with app.app.test_client() as client:
            yield client
