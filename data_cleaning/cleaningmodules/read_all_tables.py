import os
from data_cleaning.cleaningmodules.table import Table
from data_cleaning.cleaningmodules.foreign_key_discovery import ForeignKeyDiscovery
from data_cleaning.cleaningmodules.settings import Settings
import traceback
import warnings
from io import StringIO
import pandas as pd
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive

def read_all_tables(path_to_tables_file):
    """
    Read all tables mentioned in path_to_tables_file and return a dictionary containing all tables."
    :param path_to_tables_file: path to file that contains all absolute paths to the csv files.
    :return: a dictionary of key-value pairs where key is the table name and value the Table object
    and the foreign keys in JSON format
    """
    # Initialise global settings
    settings = Settings()

    dict_of_tables = {}
    list_of_tables = []
    list_of_tablenames = []
    drive = None

    with open(path_to_tables_file) as f:
        for path in f:
            try:
                if path.strip().startswith("#"):
                    continue

                if path.startswith("id:"):
                    file_id = path.replace("id:", "").strip(" ")
                    if not drive:
                        drive = _auth_drive()
                    df,name = _read_drive_table(file_id, drive)
                    table_object = Table(name, path, df)
                else:
                    stripped_path = path.rstrip()
                    (head, tail) = os.path.split(stripped_path)
                    extension = tail[tail.rfind('.'):]
                    if extension != '.csv':
                        raise Exception("File extension must be .csv")
                    name = tail[:tail.rfind('.')]
                    name = name.replace(" ", "")
                    df = _read_csv_table(stripped_path)
                    table_object = Table(name, head, df)
                
                dict_of_tables[name] = table_object
                list_of_tables.append(table_object)
                list_of_tablenames.append(name)
            except Exception as e:
                traceback.print_exc()
                print("Could not read file", path, "due to the following error:", e)

    print("Discovering foreign keys...")
    fk_discovery = ForeignKeyDiscovery(list_of_tables)
    fk_discovery.discover_fks()
    fks = fk_discovery.get_foreign_keys()
    fks.sort()

    return dict_of_tables, list_of_tablenames, fks, settings

def _read_csv_table(path):
    warnings.simplefilter("ignore")
    flag_columns = ["FOREIGN_KEY_VIOLATION", "SMALLER_THAN_VIOLATION", "NULL_FLAG", "FUTURE_DATE_FLAG",
                    "FOREIGN_KEY_VIOLATION_INFO", "SMALLER_THAN_VIOLATION_INFO", "NULL_FLAG_INFO",
                    "FUTURE_DATE_FLAG_INFO", "DUPLICATE_FLAG_MESSAGE", "OUTLIER_FLAG_INFO"]
    df = pd.read_csv(path, usecols=lambda x: x not in flag_columns, sep=None)
    warnings.simplefilter("default")

    return df

def _read_drive_table(file_id, drive):
    drive_file = drive.CreateFile({'id': file_id})
    drive_file_content = drive_file.GetContentString()
    drive_file_title = drive_file['title']

    data = StringIO(drive_file_content)
    data_frame = pd.read_csv(data)

    return data_frame, drive_file_title

def _auth_drive():
    g_auth = GoogleAuth()
    g_auth.LocalWebserverAuth()

    return GoogleDrive(g_auth)
