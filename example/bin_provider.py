import csv
import datetime
import os
from abc import ABC, abstractmethod
from collections import namedtuple

from dateutil.relativedelta import relativedelta

from dataiq.plugin.user import User

Bin = namedtuple('Bin', 'latest count')


class BinProvider(ABC):
    @abstractmethod
    def bins_for(self, user, path, depth):
        pass


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
                self.histogram.append(Bin(int(then.total_seconds()), int(count)))

    def bins_for(self, user: User, path: str, depth: int):
        yield (path, self.histogram)
        if depth > 0:
            for c in self.children:
                yield from self.bins_for(user, os.path.join(path, c), depth-1)
