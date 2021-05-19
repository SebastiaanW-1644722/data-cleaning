from fd_discovery.fd_discovery import discover_all_fds
from fd_discovery.process_results import sort_results
from fd_discovery.utils import Parameters

class FunctionalDependencyDiscovery:
    def __init__(self, name, data_frame):
        self.name = name
        self.data_frame = data_frame
        self.results = {}
        self.sample = Parameters().sample
        self.sample_size = Parameters().sample_size
        self.threshold_table = Parameters().threshold_table
        self.fd_threshold = Parameters().fd_threshold
        self.workers = Parameters().workers
        self.bin_columns = Parameters().bin_columns
        self.only_fds = Parameters().only_fds
        self.include_nulls = Parameters().include_nulls
        self.arity = Parameters().arity
        self.conf_low_pct_rows = Parameters().conf_low_pct_rows
        self.conf_rfi_threshold = Parameters().conf_rfi_threshold
        self.conf_dominant_y_pct = Parameters().conf_dominant_y_pct
        self.conf_large_group = Parameters().conf_large_group
        self.conf_high_score = Parameters().conf_high_score

    def calc_fds(self):
        
        data_frames = {
            self.name: self.data_frame
        }
        
        results = discover_all_fds(data_frames, threshold_table=self.threshold_table, arity=self.arity, include_nulls=self.include_nulls, fd_threshold=self.fd_threshold, bin_columns = self.bin_columns, workers=self.workers, sample=self.sample, sample_size=self.sample_size, conf_dominant_y_pct=self.conf_dominant_y_pct, conf_rfi_threshold=self.conf_rfi_threshold, conf_low_pct_rows=self.conf_low_pct_rows, conf_high_score=self.conf_high_score, conf_large_group=self.conf_large_group)
    
        self.results = results[self.name].results

        return self.results

    def set_results(self, json):
        self.results = json

        return self.results
    
    def get_results(self, threshold=None):
        if not threshold:
            return self.results

        threshold = float(threshold)

        adjusted_results = []

        for rhs_dict in self.results:
            for rhs, dict in rhs_dict.items():
                    new_fds = [fd for fd in dict["fds"] if fd["reasoning"]["confidence"] >= threshold]
                    average_confidence = sum(fd["reasoning"]["confidence"] for fd in dict["fds"])/len(dict["fds"])
                    if len(new_fds) > 0:
                        adjusted_results.append({
                            rhs: {
                                "fds": new_fds,
                                "average_confidence": average_confidence
                            }
                        })

        return sort_results(adjusted_results)

    def set_parameters(self, json):
        self.sample = json["sample"]
        self.sample_size = json["sample_size"]
        self.threshold_table = json["threshold_table"]
        self.fd_threshold = json["fd_threshold"]
        self.workers = json["workers"]
        self.bin_columns = json["bin_columns"]
        self.include_nulls = json["include_nulls"]
        self.arity = json["arity"]
        self.conf_dominant_y_pct = json["conf_dominant_y_pct"]
        self.conf_rfi_threshold = json["conf_rfi_threshold"]
        self.conf_low_pct_rows = json["conf_low_pct_rows"]
        self.conf_large_group = json["conf_large_group"]
        self.conf_high_score = json["conf_high_score"]

    def get_parameters(self):

        par = {
            "sample": self.sample,
            "sample_size": self.sample_size,
            "threshold_table": self.threshold_table,
            "fd_threshold": self.fd_threshold,
            "workers": self.workers,
            "bin_columns": self.bin_columns,
            "include_nulls": self.include_nulls,
            "arity": self.arity,
            "conf_low_pct_rows": self.conf_low_pct_rows,
            "conf_rfi_threshold": self.conf_rfi_threshold,
            "conf_dominant_y_pct": self.conf_dominant_y_pct,
            "conf_large_group": self.conf_large_group,
            "conf_high_score": self.conf_high_score
        }

        return par
