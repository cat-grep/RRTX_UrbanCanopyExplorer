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

    // A 3D diamond that stands on the ground at the clicked/StreetView position
    const diamondSymbol = {
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
            dotGraphicRef.current = new Graphic({ geometry: pt, symbol: diamondSymbol });
            dotLayerRef.current.add(dotGraphicRef.current);
        } else {
            dotGraphicRef.current.geometry = pt;
            dotGraphicRef.current.symbol = diamondSymbol;
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
                    <img
                        className="brandimg"
                        src="https://www.roundrocktexas.gov/wp-content/uploads/2020/11/CORR_WEB_LOGO.png"
                        alt="City of Round Rock"
                    />
                </a>

                <h1 className="brand">Urban Canopy Explorer</h1>

                <a
                    className="btn-gh"
                    href="https://github.com/cat-grep/RRTX_UrbanCanopyExplorer/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" data-view-component="true" >
                        <path fill="currentColor" d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
                    </svg>
                    <span>Source</span>
                </a>
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
