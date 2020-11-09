import unittest

from test import AppTest


class TestVersion(AppTest):
    @staticmethod
    def make_version_request(client, token):
        return client.get(
            '/version/',
            headers={'Authorization': token})

    def test_version(self, client, auth_provider):
        r = TestVersion.make_version_request(
            client, auth_provider('root', -1))
        assert 200 == r.status_code
        j = r.get_json()
        assert j is not None
        version = j['version']
        assert '1.0.0.0' == version

    def test_no_auth(self, client):
        r = TestVersion.make_version_request(
            client, '')
        assert 401 == r.status_code


if __name__ == '__main__':
    unittest.main()
