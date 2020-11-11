# Copyright 2020 Dell Inc, or its subsidiaries.
#
# SPDX-License-Identifier: Apache-2.0

import csv
import datetime
import os
import sys
from abc import ABC, abstractmethod
from collections import namedtuple
from typing import Tuple, List, Iterator

from dateutil.relativedelta import relativedelta

from dataiq.plugin.user import User

# If LOCAL_DEV environment variable is not set, use ClarityNow API
if os.environ.get('LOCAL_DEV') is None:
    try:
        import claritynowapi
    except ImportError:
        sys.path.append('/usr/local/claritynow/scripts/python')
        import claritynowapi

Bin = namedtuple('Bin', 'latest count')


class BinProvider(ABC):
    @abstractmethod
    def bins_for(self, user: User, path: str, depth: int) -> Iterator[Tuple[str, List[Bin]]]:
        pass


class ClarityNowApiBinProvider(BinProvider):
    def __init__(self):
        pass

    def bins_for(self, user: User, path: str, depth: int):
        kind = "mtime"
        mode = "condensed"
        date_fmt = "yyyy-MM-dd"

        api = claritynowapi.ClarityNowConnection(
            # hostname="localhost", port=8443, override_localhost=False,
            plugin_name="TimeBound")
        bins = api.getBins(user.username, path, depth, depth,
                           kind, mode, date_fmt, count=True, size=False)
        return bins['paths']


class DummyBinProvider(BinProvider):
    CSV_SOURCE = os.path.join(os.path.dirname(__file__), 'dummy_bin.csv')

    def __init__(self):
        self.children = ('childA', 'childB', 'childC')
        self.histogram = []
        epoch = datetime.datetime(1970, 1, 1)
        now = datetime.datetime.today()
        with open(DummyBinProvider.CSV_SOURCE) as fp:
            for relative, count in csv.reader(fp):
                then = now - eval(relative, {'delta': relativedelta}) - epoch
                self.histogram.append(Bin(datetime.datetime.fromtimestamp(
                    then.total_seconds()).strftime('%Y-%m-%d'), int(count)))

    def bins_for(self, user: User, path: str, depth: int):
        # 'path' and 'bins' are the keys ClarityNow uses for respective values
        yield {'path': path, 'bins': self.histogram}
        if depth > 0:
            for c in self.children:
                yield from self.bins_for(user, os.path.join(path, c), depth-1)
