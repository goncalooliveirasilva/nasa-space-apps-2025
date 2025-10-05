# Visualizing Carbon Monoxide with MOPITT Data (2021-2025)

## 🛰️ About the Project

This project was developed for the **NASA International Space Apps Challenge 2025** under the theme **"Celebration of TERRA Data"**. Our goal is to make **MOPITT (Measurements of Pollution in the Troposphere)** data more accessible and engaging through an interactive platform.  
We focused on **Carbon Monoxide (CO) Total Column** from the **MOPITT instrument aboard NASA's Terra Satellite**, providing a clear picture of atmospheric CO concentration trends between **2021-2025**.

## 💡 Inspiration

Carbon Monoxide (CO) is an atmospheric pollutant that affects air quality and climate. Understanding its spatial and temporal distribution helps scientists monitor pollution sources and study Earth's atmosphere.  
We want to create a **visual and educational tool** that shows this data in an intuitive way.

## 🔬 Data Source

We used [NASA's MOPITT Level 3 Gridded Monthly Mean Data (HDF5 format)](https://search.earthdata.nasa.gov/search/granules?p=C3442474626-LARC_CLOUD&pg[0][v]=f&pg[0][gsk]=-start_date&q=MOPITT&tl=1629115200!4!!).  
Each dataset was processed to extract and average day/night observations for:

- `RetrievedCOTotalColumnDay`
- `RetrievedCOTotalColumnNight`
- `RetrievedSurfaceTemperatureDay`
- `RetrievedSurfaceTemperatureNight`

We also converted the `.h5` files into `.json` files each month to power the web visualization.

## 🌐 The Website

Our website presents:

- 🌎 An **interactive 3D globe** showing CO concentration using color-coded particles
- 📊 **Dynamic data visualization** that updates across time (2021–2025)
- 🧠 **Educational content** explaining MOPITT, CO measurements, and the importance of monitoring Earth’s atmosphere.
- 🔍 User controls to explore specific years

## 🧰 Tech Stack

Data processing:

- Python

Frontend:

- HTML / CSS / JavaScript - Three.js

Hosting:

- Vercel

## 🚀 How to Run Locally

1. Clone the Repo

```bash
git clone git@github.com:goncalooliveirasilva/nasa-space-apps-2025.git
cd nasa-space-apps-2025
```

2. Install dependencies and start

```bash
npm install
npm run dev
```

## 👩‍💻 Team

**Team Name:** Spotlight  
**Challenge Category**: Celebration of Terra Data  
**Members**:

- [António Santos](https://github.com/Apmds)
- [Gonçalo Silva](https://github.com/goncalooliveirasilva)

## 📚 References and Data Sources

- [NASA Earthdata - MOPITT](https://search.earthdata.nasa.gov/search/granules?p=C3442474626-LARC_CLOUD&pg[0][v]=f&pg[0][gsk]=-start_date&q=MOPITT&tl=1629115200!4!!)
- [University of Toronto](https://mopitt.physics.utoronto.ca/)
- [NASA Visible Earth](https://visibleearth.nasa.gov/collection/1484/blue-marble)
- [Measurements of Pollution in the Troposphere (MOPITT) Data Portal](https://donnees-data.asc-csa.gc.ca/en/dataset/ef42819f-35bb-49c0-a368-1e61fa876ee6)
- [Terra satellite image](https://commons.wikimedia.org/wiki/File:Terra_spacecraft_model.png)
- [Aqua satellite image](https://commons.wikimedia.org/wiki/File:Aqua_spacecraft_model.png)
- [Aura satellite image](https://commons.wikimedia.org/wiki/File:Aura_spacecraft_model.png)
