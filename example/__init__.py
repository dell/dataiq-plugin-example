from dataiq.plugin.invalidator.clarity_now import PluginData
from dataiq.plugin.jobs import JobManager
from dataiq.plugin.plugin import Plugin


class Example(Plugin):
    def __init__(self, auth_override=None, static_folder=None, template_folder=None):
        super(Example, self).__init__('example', auth_override=auth_override,
                                      static_folder=static_folder, template_folder=template_folder)

    @property
    def active(self) -> bool:
        return True

    @property
    def job_manager(self) -> JobManager:
        pass

    def plugin_data(self) -> PluginData:
        pass
