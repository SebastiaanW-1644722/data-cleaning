from fd_discovery.fd_discovery import discover_all_fds
from fd_discovery.process_results import _sort_results, group_fds


class FunctionalDependencyDiscovery:
    def __init__(self, name, data_frame):
        self.name = name
        self.data_frame = data_frame
        self.results = {}
        self.sample = False
        self.sample_size = 0.5
        self.threshold_table = True
        self.fd_threshold = 0.90
        self.workers = 1
        self.bin_columns = False
        self.only_fds = True
        self.include_nulls = False
        self.arity = 1

    def calc_fds(self):
        
        data_frames = {
            self.name: self.data_frame
        }
        
        results = discover_all_fds(data_frames, threshold_table=self.threshold_table, arity=self.arity, include_nulls=self.include_nulls, fd_threshold=self.fd_threshold, bin_columns = self.bin_columns, workers=self.workers, sample=self.sample, sample_size=self.sample_size)
    
        self.results = results[self.name].results

        return self.results

    def set_parameters(self, json):
        self.sample = json["sample"]
        self.sample_size = json["sample_size"]
        self.threshold_table = json["threshold_table"]
        self.fd_threshold = json["fd_threshold"]
        self.workers = json["workers"]
        self.bin_columns = json["bin_columns"]
        self.include_nulls = json["include_nulls"]
        self.arity = json["arity"]

    def get_parameters(self):

        par = {
            "sample": self.sample,
            "sample_size": self.sample_size,
            "threshold_table": self.threshold_table,
            "fd_threshold": self.fd_threshold,
            "workers": self.workers,
            "bin_columns": self.bin_columns,
            "include_nulls": self.include_nulls,
            "arity": self.arity
        }

        return par
