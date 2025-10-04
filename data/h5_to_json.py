import os
import h5py
import numpy as np
import json

input_folder = "./he5_files"   # your folder with .he5
output_folder = "./json_files"
os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if not filename.endswith(".he5"):
        continue

    print(f"Processing {filename}...")
    file_path = os.path.join(input_folder, filename)

    with h5py.File(file_path, "r") as f:
        group = f["/HDFEOS/GRIDS/MOP03/Data Fields"]

        # Latitude & Longitude
        lat = group["Latitude"][:]
        lon = group["Longitude"][:]

        # CO Total Column: average Day/Night
        co_day = group["RetrievedCOTotalColumnDay"][:]
        co_night = group["RetrievedCOTotalColumnNight"][:]
        fillvalue_co = group["RetrievedCOTotalColumnDay"].attrs["_FillValue"]

        co_data = (co_day + co_night) / 2
        co_data = np.where(co_data == fillvalue_co, np.nan, co_data)

        # Temperature: average Day/Night
        temp_day = group["RetrievedSurfaceTemperatureDay"][:]
        temp_night = group["RetrievedSurfaceTemperatureNight"][:]
        fillvalue_temp = group["RetrievedSurfaceTemperatureDay"].attrs["_FillValue"]
        temp_data = (temp_day + temp_night) / 2
        temp_data = np.where(temp_data == fillvalue_temp, np.nan, temp_data)

        # Flatten and create JSON list
        json_list = []
        for i in range(lat.size):
            if np.isnan(co_data.flat[i]):
                continue
            entry = {
                "lat": float(lat.flat[i]),
                "lon": float(lon.flat[i]),
                "co": float(co_data.flat[i]),
                "temp": float(temp_data.flat[i])
            }
            json_list.append(entry)

        # Save JSON
        json_filename = filename.replace(".he5", ".json")
        json_path = os.path.join(output_folder, json_filename)
        with open(json_path, "w") as outfile:
            json.dump(json_list, outfile)

        print(f"Saved {len(json_list)} points to {json_filename}")
