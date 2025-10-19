import React, { useEffect, useRef } from "react";
import { useGetAllIncidentsQuery } from "../../redux/api/incidentApiSlice";
import { FiAlertCircle } from "react-icons/fi";

const IncidentFeed = () => {
  const { data: incidents = [], error, isLoading } = useGetAllIncidentsQuery();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (incidents.length > 0) {
      const scrollContainer = scrollRef.current;
      let scrollAmount = 0;

      const scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollAmount += 1;
          scrollContainer.scrollTop = scrollAmount;
          if (
            scrollAmount >=
            scrollContainer.scrollHeight - scrollContainer.clientHeight
          ) {
            scrollAmount = 0; // Reset scrolling to top
          }
        }
      }, 50); // Adjust speed (smaller = faster)

      return () => clearInterval(scrollInterval);
    }
  }, [incidents]);

  if (isLoading)
    return <p className="text-gray-400 text-center">Loading incidents...</p>;
  if (error)
    return (
      <p className="text-[#ff335e] text-center">Error loading incidents.</p>
    );

  const reversedIncidents = [...incidents].reverse();

  return (
    <div className="mt-6 p-5 rounded-lg shadow-lg w-full max-w-screen-xl bg-gray-900 border border-gray-800">
      {/* Header with Flex Row for Icon & Title */}
      <div className="flex items-center justify-center gap-2 border-b border-gray-700 pb-3 mb-4">
        <FiAlertCircle className="text-[#ff335e] text-2xl" />
        <h1 className="text-lg font-semibold text-white">
          LIVE CYBER INCIDENT FEED
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm text-center mb-4">
        Real-time updates on cyber threats
      </p>

      {/* Scrolling Incident List */}
      <div ref={scrollRef} className="auto-scroll overflow-y-hidden h-[250px]">
        <div className="scroll-content">
          {reversedIncidents.length > 0 ? (
            reversedIncidents.map((incident) => (
              <div
                key={incident._id}
                className="bg-gray-800 p-3 rounded-md mb-3 shadow-md transition hover:bg-gray-700"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-white text-base font-medium">
                    {incident.title}
                  </h2>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-[#ff335e] text-white">
                    {incident.type}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  {incident.description}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(incident.date).toLocaleString()} -{" "}
                  {incident.country}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No incidents available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentFeed;
