import React from "react";
import { useGetTopTargetedCountriesQuery } from "../../redux/api/incidentApiSlice";

const TopTargetCountry = () => {
  const {
    data: countries = [],
    error,
    isLoading,
  } = useGetTopTargetedCountriesQuery();

  if (isLoading) {
    return (
      <p className="text-gray-400 text-center">
        Loading top targeted countries...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Error loading data</p>;
  }

  return (
    <div className="p-5 rounded-lg shadow-lg bg-gray-950 border border-gray-800 min-h-[350px]">
      {/* Title */}
      <div className="text-center border-b border-gray-800 pb-3 mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center justify-center gap-2">
          🌍 Targeted Countries Today
        </h2>
        <p className="text-gray-400 text-sm">
          Countries facing the highest number of cyber attacks.
        </p>
      </div>

      {/* Country List */}
      {countries.length > 0 ? (
        <ul className="space-y-3">
          {countries.map((country, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-800 p-3 rounded-md shadow-sm hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                {/* Animated attack dot */}
                <span className="relative w-3 h-3 bg-red-500 rounded-full flex-shrink-0">
                  <span className="absolute inset-0 w-5 h-5 bg-red-500 opacity-25 rounded-full animate-ping"></span>
                </span>
                <span className="text-sm font-medium text-white">
                  {country._id || "Unknown Country"}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-300">
                {country.count} Attacks
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center">
          No data available for today.
        </p>
      )}
    </div>
  );
};

export default TopTargetCountry;
