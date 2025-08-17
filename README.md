# Round Rock TX Urban Canopy Explorer

Explore the urban tree canopy of Round Rock, Texas, remotely with this interactive map. Inspired by my summer internship on Monarch Tree Digitization, this app uses publicly available LiDAR data from the City of Round Rock to filter vegetation points. Built with React, ArcGIS Maps SDK, and Google Street View, it combines aerial imagery, canopy LiDAR, and street-level views, allowing anyone to explore trees without fieldwork.

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
# If starting fresh:
# npm i react react-dom vite
# npm i @arcgis/core @googlemaps/js-api-loader 
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

## Contact

**Eugenie Huang**  
Master’s Student in Cartography & Geographic Information Systems  
University of Wisconsin–Madison  
huang674@wisc.edu  
