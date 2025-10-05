import os
import csv
import json

input_folder = "./csv_files"
output_folder = "./json_files"


os.makedirs(output_folder, exist_ok=True)


FILL_VALUE = -9.999e3


for filename in os.listdir(input_folder):
    if filename.endswith(".csv"):
        csv_path = os.path.join(input_folder, filename)
        json_path = os.path.join(output_folder, filename.replace(".csv", ".json"))
        
        data_list = []
        with open(csv_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:

                entry = {k: (float(v) if float(v) != FILL_VALUE else None) for k, v in row.items()}
                data_list.append(entry)
        
        with open(json_path, 'w') as jsonfile:
            json.dump(data_list, jsonfile)
        
        print(f"Converted {filename} → {filename.replace('.csv','.json')}")
