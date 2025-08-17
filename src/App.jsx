import { useEffect, useRef, useState, useCallback } from "react";
import WebScene from "@arcgis/core/WebScene";
import SceneView from "@arcgis/core/views/SceneView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import "@arcgis/core/assets/esri/themes/light/main.css";
import StreetViewPanel from "./StreetViewPanel.jsx";

export default function App() {
    const viewDivRef = useRef(null);
    const viewRef = useRef(null);

    const [svPos, setSvPos] = useState({ lat: 30.509862, lng: -97.678003 });

    // dot layer/graphic
    const dotLayerRef = useRef(null);
    const dotGraphicRef = useRef(null);

    // A 3D pillar (cylinder) that stands on the ground at the clicked/StreetView position
    const pillarSymbol = {
        type: "point-3d",
        symbolLayers: [
            {
                type: "object",
                resource: { primitive: "diamond" }, // options: "cylinder", "cone", "cube", "sphere"...
                height: 25,        // meters
                width: 10,        // meters (diameter in x)
                depth: 10,        // meters (diameter in y)
                material: { color: [0, 122, 255, 1] },
                anchor: "bottom",  // sit the pillar on the ground
                castShadows: true,
            },
        ],
    };

    const upsertDot = useCallback((lat, lng) => {
        if (!dotLayerRef.current) return;
        const pt = new Point({ latitude: lat, longitude: lng, spatialReference: { wkid: 3857 } });

        if (!dotGraphicRef.current) {
            dotGraphicRef.current = new Graphic({ geometry: pt, symbol: pillarSymbol });
            dotLayerRef.current.add(dotGraphicRef.current);
        } else {
            dotGraphicRef.current.geometry = pt;
            dotGraphicRef.current.symbol = pillarSymbol;
        }
    }, []);

    useEffect(() => {
        if (!viewDivRef.current) return;

        const webscene = new WebScene({
            portalItem: { id: "85ac5c8fe29845ea819f72cdc59008b6" },
        });

        const view = new SceneView({ container: viewDivRef.current, map: webscene });
        viewRef.current = view;

        const dotLayer = new GraphicsLayer({ elevationInfo: { mode: "on-the-ground" } });
        webscene.add(dotLayer);
        dotLayerRef.current = dotLayer;

        // Scene click => move dot + drive Street View (via state)
        const clickHandle = view.on("click", (e) => {
            const { latitude, longitude } = e.mapPoint;
            setSvPos({ lat: latitude, lng: longitude }); // will update SV (prop)
            upsertDot(latitude, longitude);               // move dot immediately
            // Optionally pan to click
            view.goTo({ center: [longitude, latitude] }, { duration: 250 }).catch(() => { });
        });

        view.when(() => upsertDot(svPos.lat, svPos.lng));

        return () => {
            clickHandle.remove();
            view.destroy();
            viewRef.current = null;
            dotLayerRef.current = null;
            dotGraphicRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Street View movement => move dot + pan SceneView, but DO NOT setSvPos
    const handleStreetViewChange = useCallback(
        ({ position }) => {
            if (!position) return;
            const { lat, lng } = position;

            upsertDot(lat, lng);

            if (viewRef.current) {
                viewRef.current
                    .goTo({ center: [lng, lat] }, { animate: true, duration: 250 })
                    .catch(() => { });
            }
            // IMPORTANT: do NOT call setSvPos here -> avoids feeding back to StreetViewPanel
        },
        [upsertDot]
    );

    return (
        <div className="app">
            <header className="banner">
                <a className="logo" href="https://www.roundrocktexas.gov/">
                    <img className="brandimg" src="https://www.roundrocktexas.gov/wp-content/uploads/2020/11/CORR_WEB_LOGO.png" type="image/webp" />
                    </a>
                <div className="brand">Urban Canopy Explorer</div>
            </header>

            <div className="content" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "calc(100vh - 56px)" }}>
                <div ref={viewDivRef} className="mapPane" />
                <div className="svPane">
                    <StreetViewPanel position={svPos} onChange={handleStreetViewChange} />
                </div>
            </div>
        </div>
    );
}
