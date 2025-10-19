import React from "react";
import { useGetAllIncidentsQuery } from "../../redux/api/incidentApiSlice";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-ant-path"; // Animated attack paths

// Map Configuration
const MAP_CONFIG = {
  center: [20, 0],
  zoom: 2.0,
  minZoom: 2.0,
  maxZoom: 3.0, // Slight zoom flexibility
  maxBounds: [
    [-90, -180],
    [90, 180],
  ],
  maxBoundsViscosity: 1.0,
  worldCopyJump: false,
};

const CyberMap = () => {
  const { data: incidents = [], error, isLoading } = useGetAllIncidentsQuery();

  if (isLoading)
    return <p className="text-gray-400 text-center">Loading map data...</p>;
  if (error)
    return <p className="text-red-500 text-center">Error loading map data</p>;

  // Filter valid incidents
  const validIncidents = incidents.filter(
    (incident) =>
      incident.source?.lat !== undefined &&
      incident.source?.lng !== undefined &&
      incident.target?.lat !== undefined &&
      incident.target?.lng !== undefined
  );

  if (validIncidents.length === 0) {
    return <p className="text-gray-400 text-center">No incidents available.</p>;
  }

  return (
    <div className="relative flex-grow h-full w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        maxBounds={MAP_CONFIG.maxBounds}
        maxBoundsViscosity={MAP_CONFIG.maxBoundsViscosity}
        worldCopyJump={MAP_CONFIG.worldCopyJump}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* 🌍 Tile layer with country names */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap contributors'
        />

        {validIncidents.map((incident, index) => (
          <React.Fragment key={index}>
            {/* Source Marker */}
            <Marker position={[incident.source.lat, incident.source.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    <strong>Source:</strong> {incident.source.country}
                  </p>
                  <p className="text-gray-700">
                    <strong>Industry:</strong> {incident.industry || "Unknown"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Type:</strong> {incident.type || "General Threat"}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Target Marker */}
            <Marker position={[incident.target.lat, incident.target.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    <strong>Target:</strong> {incident.target.country}
                  </p>
                  <p className="text-gray-700">
                    <strong>Industry:</strong> {incident.industry || "Unknown"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Type:</strong> {incident.type || "General Threat"}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Animated Attack Path */}
            <Polyline
              positions={[
                [incident.source.lat, incident.source.lng],
                [incident.target.lat, incident.target.lng],
              ]}
              pathOptions={{
                color: "red",
                weight: 2.5,
                opacity: 0.8,
                dashArray: "5, 10",
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default CyberMap;
