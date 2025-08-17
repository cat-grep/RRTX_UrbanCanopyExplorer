import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function StreetViewPanel({ position, onChange }) {
  const panoDivRef = useRef(null);
  const panoRef = useRef(null);
  const googleRef = useRef(null);

  const lastLatLngRef = useRef({ lat: null, lng: null });
  const suppressNextEmitRef = useRef(false); // guard to ignore echo after external setPosition

  // Initialize Street View once
  useEffect(() => {
    let cleanup = () => {};

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader
      .load()
      .then((google) => {
        googleRef.current = google;

        panoRef.current = new google.maps.StreetViewPanorama(panoDivRef.current, {
          position: position || { lat: 30.509388, lng: -97.679721 }, 
          //30.509388262176845, -97.67972179833342
          //lat: 37.86926, lng: -122.254811
          zoom: 1,
          motionTracking: false,
          addressControl: true,
          linksControl: true,
          panControl: true,
          zoomControl: true,
          fullscreenControl: true,
        });

        const emit = () => {
          if (!panoRef.current) return;

          // If this change came from an external setPosition, skip one emit
          if (suppressNextEmitRef.current) {
            suppressNextEmitRef.current = false;
            return;
          }

          const p = panoRef.current.getPosition();
          if (!p) return;

          const lat = p.lat();
          const lng = p.lng();

          // only notify if position actually changed
          if (lat !== lastLatLngRef.current.lat || lng !== lastLatLngRef.current.lng) {
            lastLatLngRef.current = { lat, lng };
            onChange?.({ position: { lat, lng } });
          }
        };

        const posListener = panoRef.current.addListener("position_changed", emit);

        // Emit once on init
        const p0 = panoRef.current.getPosition();
        if (p0) {
          lastLatLngRef.current = { lat: p0.lat(), lng: p0.lng() };
          onChange?.({ position: { lat: p0.lat(), lng: p0.lng() } });
        }

        cleanup = () => posListener?.remove?.();
      })
      .catch((e) => {
        console.error("Google Maps JS API failed to load:", e);
      });

    return () => cleanup();
  }, [onChange]);

  // Apply external updates (SceneView clicks)
  useEffect(() => {
    if (!panoRef.current || !googleRef.current || !position) return;

    // Set guard to ignore the next internal "position_changed" from this external update
    suppressNextEmitRef.current = true;
    panoRef.current.setPosition(position);
  }, [position]);

  return <div ref={panoDivRef} style={{ width: "100%", height: "100%" }} />;
}
