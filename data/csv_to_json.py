import os
import csv
import json

# Input folder with CSV files
input_folder = "./csv_files"
# Output folder for JSON files
output_folder = "./json_files"

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Fill value in CSVs
FILL_VALUE = -9.999e3

# Loop through all CSV files
for filename in os.listdir(input_folder):
    if filename.endswith(".csv"):
        csv_path = os.path.join(input_folder, filename)
        json_path = os.path.join(output_folder, filename.replace(".csv", ".json"))
        
        data_list = []
        with open(csv_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Convert values to float, replace fill value with None
                entry = {k: (float(v) if float(v) != FILL_VALUE else None) for k, v in row.items()}
                data_list.append(entry)
        
        # Write JSON
        with open(json_path, 'w') as jsonfile:
            json.dump(data_list, jsonfile)
        
        print(f"Converted {filename} → {filename.replace('.csv','.json')}")
