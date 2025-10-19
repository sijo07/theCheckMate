import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import CyberThreatMap from "./threadMap";

const Map = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const handleNewIncident = (incident) => {
      console.log("New incident received:", incident);
      setIncidents((prevIncidents) => [incident, ...prevIncidents]);
    };

    socket.on("new-incident", handleNewIncident);

    return () => {
      socket.off("new-incident", handleNewIncident);
    };
  }, []);

  return (
    <>
      <CyberThreatMap incidents={incidents} />
    </>
  );
};

export default Map;
