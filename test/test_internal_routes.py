# Copyright 2020 Dell Inc, or its subsidiaries.
#
# SPDX-License-Identifier: Apache-2.0

import unittest

from test import AppTest


class TestConfiguration(AppTest):
    def test_configuration(self, client):
        expected_config = {
            'groups': [],
            'actions': [
                {'endpoint': '/execute/',
                 'name': 'Time Bound',
                 'filter': {'applies_to': ['folders'],
                            'groups': [],
                            'listed_within': ['browse'],
                            'max_selections': 1,
                            'path_regex': None,
                            'tag_categories': '',
                            'tags': '',
                            'volume_types': {'s3', 'nfs', 'vfs'}},
                 'parameters': ['v']}
            ],
            'has_visible_settings': True
        }

        c = client.get('/internal/configuration/')
        assert 200 == c.status_code
        assert 'application/json' == c.headers['Content-Type']
        j = c.get_json()
        for action in j['actions']:
            action['filter']['volume_types'] = set(action['filter']['volume_types'])

        assert expected_config == j


if __name__ == '__main__':
    unittest.main()
