import os
import h5py
import numpy as np

INPUT_FOLDER = './raw_data'
OUTPUT_FOLDER = './csv_files'
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

for file_name in os.listdir(INPUT_FOLDER):
    if not file_name.endswith('.he5'):
        continue

    file_path = os.path.join(INPUT_FOLDER, file_name)
    print(f'Processing {file_name}...')

    with h5py.File(file_path, 'r') as f:
        group = f['/HDFEOS/GRIDS/MOP03/Data Fields']

        # 1D lat/lon
        lat_1d = group['Latitude'][:]
        lon_1d = group['Longitude'][:]

        # 2D data arrays (example: using DAY)
        co_total = group['RetrievedCOTotalColumnDay'][:]
        co_surf = group['RetrievedCOSurfaceMixingRatioDay'][:]
        temp = group['RetrievedSurfaceTemperatureDay'][:]

        # Make 2D grids of lat/lon to match the shape of data arrays
        lon_grid, lat_grid = np.meshgrid(lon_1d, lat_1d)

        # Flatten everything to make rows = points
        Tab = np.vstack([
            lat_grid.flatten(),
            lon_grid.flatten(),
            co_total.flatten(),
            co_surf.flatten(),
            temp.flatten()
        ]).T

        header = 'Latitude,Longitude,COTotalColumn,COMixingRatioSurface,SurfaceTemperature'

        out_file = os.path.join(OUTPUT_FOLDER, file_name.replace('.he5', '.csv'))
        np.savetxt(out_file, Tab, delimiter=',', header=header, comments='')

    print(f'{file_name} -> {out_file}')


# import h5py

# filename = './raw_data/MOP03JM-200003-L3V95.9.3.he5'

# with h5py.File(filename, 'r') as f:
#     def print_name(name):
#         print(name)
#     f.visit(print_name)