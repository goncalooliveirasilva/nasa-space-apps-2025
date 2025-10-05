import os
import h5py
import numpy as np
import json

INPUT_FOLDER = "./he5_files"
OUTPUT_FOLDER = "./json_files"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def convert_he5_to_json(filename):
    print(f"Processing {filename}...")
    file_path = os.path.join(INPUT_FOLDER, filename)

    with h5py.File(file_path, "r") as f:
        group = f["/HDFEOS/GRIDS/MOP03/Data Fields"]

        lat = group["Latitude"][:]
        lon = group["Longitude"][:]

        co_day = group["RetrievedCOTotalColumnDay"][:]
        co_night = group["RetrievedCOTotalColumnNight"][:]
        fv_co = group["RetrievedCOTotalColumnDay"].attrs["_FillValue"]

        co_day = np.where(co_day == fv_co, np.nan, co_day)
        co_night = np.where(co_night == fv_co, np.nan, co_night)
        co_data = np.nanmean(np.stack([co_day, co_night]), axis=0)

        # # Temperature: average Day/Night
        # temp_day = group["RetrievedSurfaceTemperatureDay"][:]
        # temp_night = group["RetrievedSurfaceTemperatureNight"][:]
        # fv_temp = group["RetrievedSurfaceTemperatureDay"].attrs["_FillValue"]

        # temp_day = np.where(temp_day == fv_temp, np.nan, temp_day)
        # temp_night = np.where(temp_night == fv_temp, np.nan, temp_night)
        # temp_data = np.nanmean(np.stack([temp_day, temp_night]), axis=0)

        nlat, nlon = co_data.shape
        lat_grid = np.linspace(lat.min(), lat.max(), nlat)
        lon_grid = np.linspace(lon.min(), lon.max(), nlon)
        LON, LAT = np.meshgrid(lon_grid, lat_grid)

        data = []
        # for i in range(nlat):
        #     for j in range(nlon):
        #         if not np.isnan(co_data[i, j]) and not np.isnan(temp_data[i, j]):
        #             data.append({
        #                 "lat": float(LAT[i, j]),
        #                 "lon": float(LON[i, j]),
        #                 "co": float(co_data[i, j]),
        #                 "temp": float(temp_data[i, j])
        #             })
        for i in range(nlat):
            for j in range(nlon):
                if not np.isnan(co_data[i, j]):
                    data.append({
                        "lat": float(LAT[i, j]),
                        "lon": float(LON[i, j]),
                        "co": float(co_data[i, j]),
                    })

        out_file = os.path.join(OUTPUT_FOLDER, filename.replace(".he5", ".json"))
        with open(out_file, "w") as f_out:
            json.dump(data, f_out)

        print(f"Saved {len(data)} points to {out_file}")

for fname in os.listdir(INPUT_FOLDER):
    if fname.endswith(".he5"):
        convert_he5_to_json(fname)
