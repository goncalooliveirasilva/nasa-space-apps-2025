import os
import json

data_folder = "./json_files"

json_files = [f for f in os.listdir(data_folder) if f.endswith(".json")]
json_files.sort()

output_file = os.path.join(data_folder, "fileList.json")
with open(output_file, "w") as f:
    json.dump(json_files, f, indent=2)
