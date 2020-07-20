from dataiq.plugin.invalidator.clarity_now import PluginData
from dataiq.plugin.jobs import JobManager
from dataiq.plugin.plugin import Plugin


class Example(Plugin):
    def __init__(self, auth_override=None):
        super(Example, self).__init__('example', auth_override=auth_override)

    @property
    def active(self) -> bool:
        return True

    @property
    def job_manager(self) -> JobManager:
        pass

    def plugin_data(self) -> PluginData:
        pass
