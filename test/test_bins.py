import unittest

from example import DummyBinProvider
from test import AppTest


class TestDummyBins(unittest.TestCase):
    def test_dummy(self):
        dummy_bp = DummyBinProvider()

        self.assertEqual(dummy_bp.children, ('childA', 'childB', 'childC'))

        depth = 2
        bins = list(dummy_bp.bins_for(None, 'start', depth))
        self.assertEqual(13, len(bins))

        for path, histogram in bins:
            self.assertEqual(dummy_bp.histogram, histogram)


class TestBinsApi(AppTest):
    @staticmethod
    def make_bin_request(client, token, path, depth):
        return client.post(
            '/bins/',
            headers={'Authorization': token},
            data={'path': path, 'depth': depth})

    def test_immediate(self, client, auth_provider):
        r = TestBinsApi.make_bin_request(
            client, auth_provider('root', -1), '/vol1/path', 0)
        assert 200 == r.status_code
        j = r.get_json()
        assert j is not None
        paths = j['paths']
        assert 1 == len(paths)

    def test_two_deep(self, client, auth_provider):
        r = TestBinsApi.make_bin_request(
            client, auth_provider('root', -1), '/vol1/path', 2)
        j = r.get_json()
        paths = j['paths']
        assert 13 == len(paths)

    def test_string_depth(self, client, auth_provider):
        r = TestBinsApi.make_bin_request(
            client, auth_provider('root', -1), '/vol1/path', 'not_an_int')
        assert 400 == r.status_code

    def test_no_auth(self, client):
        r = TestBinsApi.make_bin_request(
            client, '', '/vol1/path', 1)
        assert 401 == r.status_code


if __name__ == '__main__':
    unittest.main()
