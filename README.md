# Round Rock TX Urban Canopy Explorer

React app that pairs an ArcGIS 3D WebScene with Google Street View.

## Features
* 3D **WebScene** (ArcGIS Maps SDK 4.33)
* **Street View** panel (Google Maps JS API)
* **Two-way** sync
    * Scene click → Street View moves & marker updates
    * Street View move → marker moves & 3D map pans to it

## Quick start
### Prerequisites
* Node 18+ and npm
* Google Maps JavaScript API key with billing enabled

#### 1) Install deps
```
npm install
# If starting fresh:
# npm i react react-dom vite
# npm i @arcgis/core @googlemaps/js-api-loader 
``` 

#### 2) Add your API key

Create `./.env.local` at the project root:
```
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

After adding/changing .env.local, restart npm run dev.

#### 3) Run
```
npm run dev
```

## Project structure
```
your-app/
├─ index.html
├─ src/
│  ├─ index.jsx            # entry (React root)
│  ├─ App.jsx              # SceneView + layout + marker logic
│  ├─ StreetViewPanel.jsx  # Street View loader & events
│  └─ index.css            # banner/layout styles 
└─ package.json
```

## Acknowledgements

[ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)

[Google Maps JavaScript API – Street View](https://developers.google.com/maps/documentation/javascript/streetview)