# Round Rock Urban Canopy Explorer

**Explore the tree canopy of Round Rock, Texas, remotely.**  

This is a **student side project** built using publicly available LiDAR and imagery from the City of Round Rock. It is **not an official publication**.  

Inspired by my summer internship on Monarch Tree Digitization, this app filters vegetation points from LiDAR datasets and integrates them into a web application built with React, ArcGIS Maps SDK, and Google Street View. By combining aerial imagery, canopy LiDAR, and street-level views, this app allows anyone to explore trees without fieldwork.

[Live Demo✨](https://cat-grep.github.io/RRTX_UrbanCanopyExplorer/)

## Features

- **3D WebScene**  
  Built with ArcGIS Maps SDK 4.33, providing an interactive 3D view of the urban canopy.

- **Street View panel**  
  Powered by Google Maps JavaScript API, enabling street-level exploration.

- **Two-way sync**  
  - Clicking on the 3D scene updates the Street View marker and camera.  
  - Moving in Street View pans the 3D map and updates the marker position.

## Quick start
### Prerequisites
- Node 18+ and npm
- Google Maps JavaScript API key with billing enabled

#### 1) Install deps
```bash
npm install
``` 

#### 2) Add your API key

Create `./.env.local` at the project root:
```config
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

After adding/changing .env.local, restart npm run dev.

#### 3) Run
```bash
npm run dev
```

## Project structure
```
RRTX_UrbanCanopyExplorer/
├─ index.html             # HTML template
├─ src/
│  ├─ index.jsx           # React root entry
│  ├─ App.jsx             # SceneView, layout, and marker logic
│  ├─ StreetViewPanel.jsx # Street View loader & events
│  └─ index.css           # Layout and banner styles
└─ package.json           # Project metadata and dependencies
```

## Resources

- **LiDAR data and imagery**
[Williamson County - LiDAR, Contour, and Orthoimagery Request](https://wilcomaps.wilco.org/vertigisstudio/web/?app=890fe4cc2634486ba1cd03a552c54aab)
- **Mapping SDK**
[ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
- **Street View API**
[Google Maps JavaScript API – Street View](https://developers.google.com/maps/documentation/javascript/streetview)

## Data Preprocessing: LiDAR Vegetation Filtering

To build this dataset, I created a custom [PDAL](https://pdal.io/en/2.9.1/) workflow:
1. Download & extract LAZ tiles from the Williamson County 2024 StratMap project.
2. Convert LAZ → LAS for easier manipulation.
3. Clip LAS to the City of Round Rock boundary.
4. Filter by classification code 5 (high vegetation) to isolate canopy points.
This filtered LAS dataset was then ingested into the 3D WebScene, making it possible to remotely visualize tree canopy extent and structure.

You can see the full LiDAR processing script here: 
👉 [LiDAR Vegetation Filter](https://github.com/cat-grep/LiDAR_VegetationFilter/)

## Internship Connection

This project extends my work as a Summer 2025 GIS Intern with the City of Round Rock.  
During the internship, I helped digitize 300+ Monarch trees and linked them to parcel boundaries for enforcement of the city’s tree protection ordinance.  

I documented the experience in a StoryMap here: 
👉 [Making the Most of My Summer with the City of Round Rock](https://storymaps.arcgis.com/stories/ef608abad1854ababbfd869bf3115107)

The Urban Canopy Explorer is a personal continuation of that work, exploring how LiDAR + street view can make canopy data more accessible to both professionals and the public.

## Contact

**Eugenie Huang**  
Summer 2025 Intern | Geospatial Services | Information Technology | City of Round Rock, TX  
Master’s Student in Cartography & Geographic Information Systems  
University of Wisconsin–Madison  
huang674@wisc.edu  
