import React from "react";
import { useGetAllIncidentsQuery } from "../../redux/api/incidentApiSlice";

const TopTargetIndustry = () => {
  const { data: incidents = [], error, isLoading } = useGetAllIncidentsQuery();

  if (isLoading)
    return (
      <p className="text-gray-400 text-center">Loading top industries...</p>
    );

  if (error)
    return <p className="text-red-500 text-center">Error loading data</p>;

  // Process data: Count incidents per industry
  const industryCount = incidents.reduce((acc, incident) => {
    const industry = incident.industry || "Unknown Industry"; // Handle missing industry
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});

  // Sort and get top 5 industries
  const sortedIndustries = Object.entries(industryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([industry, count]) => ({ industry, count }));

  return (
    <div className="p-4 rounded-lg shadow-lg bg-gray-950 min-h-[350px]">
      <h2 className="text-lg font-semibold text-white mb-4 text-center">
        🎯 Top Targeted Industries
      </h2>
      <p className="text-gray-400 text-sm mb-4 text-center">
        Industries facing the most cyber attacks today.
      </p>

      {sortedIndustries.length > 0 ? (
        <ul className="space-y-3">
          {sortedIndustries.map((industry, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-800 p-3 rounded-md shadow-sm hover:bg-gray-700 transition-all"
            >
              {/* Red Indicator & Industry Name */}
              <div className="flex items-center space-x-3">
                <span className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></span>
                <span className="text-sm font-medium text-white">
                  {industry.industry}
                </span>
              </div>

              {/* Attack Count */}
              <span className="text-sm font-semibold text-gray-300">
                {industry.count} Attacks
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center">No data available</p>
      )}
    </div>
  );
};

export default TopTargetIndustry;
