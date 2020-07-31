from typing import Union, Any, Iterator

from dataiq.plugin.action import Action
from dataiq.plugin.action_filter import ActionFilter, TagFilter, ListedWithin, \
    AppliesTo, VolumeTypes
from dataiq.plugin.actions import Actions
from dataiq.plugin.configuration import Configuration
from dataiq.plugin.context import Parameter
from dataiq.plugin.invalidator.clarity_now import PluginData
from dataiq.plugin.jobs import JobManager, JobFactory, Job
from dataiq.plugin.plugin import Plugin
from dataiq.plugin.util.enum import EnumSet
from flask import Response

from example.bin_provider import DummyBinProvider


class Example(Plugin):
    def __init__(self, hostname, auth_override=None):
        super(Example, self).__init__('example', auth_override=auth_override)
        self.configuration = Configuration(
            groups=[],
            actions=Actions([
                Action(
                    name='Time Bound',
                    endpoint='/execute/',
                    parameters=EnumSet.of(Parameter.VPATH),
                    action_filter=ActionFilter(
                        groups=[],
                        tags=TagFilter('', ''),
                        listed_within=EnumSet.of(ListedWithin.BROWSE),
                        applies_to=EnumSet.of(AppliesTo.FOLDERS),
                        volume_types=EnumSet.all_of(VolumeTypes),
                        max_selections=1,
                        path_regex=None
                    )
                )
            ]),
            has_visible_settings=True
        )
        self._hostname = hostname

        self.bin_provider = DummyBinProvider()
        self._job_manager = NoJobsHere()

    @property
    def active(self) -> bool:
        return True

    @property
    def job_manager(self) -> JobManager:
        return self._job_manager

    def plugin_data(self) -> PluginData:
        return PluginData(
            self._hostname,
            'DateFilter',
            'DateFilter: The DataIQ Example Plugin',
            'unknown'
        )

    def settings(self) -> Union[str, Response]:
        pass


class NoJobsHere(JobManager):
    def __iter__(self) -> Iterator[Job]:
        return iter([])

    def _new_identifier(self) -> Any:
        pass

    def register(self, factory: JobFactory) -> Any:
        raise RuntimeError('This Job Manager does not support new jobs')
