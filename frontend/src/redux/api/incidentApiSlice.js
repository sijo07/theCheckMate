import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const incidentApiSlice = createApi({
  reducerPath: "incidentApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Incidents", "Industries", "TopCountries", "DailyAttacks"], 
  endpoints: (builder) => ({
    getAllIncidents: builder.query({
      query: () => "/incidents",
      providesTags: ["Incidents"],
    }),

    getTopTargetedCountries: builder.query({
      query: () => "/incidents/top-targeted-countries",
      providesTags: ["TopCountries"],
    }),

    getTopTargetedIndustries: builder.query({
      query: () => "/incidents/top-targeted-industries",
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ industry }) => ({
                type: "Industries",
                id: industry,
              })),
              { type: "Industries", id: "LIST" },
            ]
          : [{ type: "Industries", id: "LIST" }],
    }),

    getAttacksOnThisDay: builder.query({
      query: () => "/incidents/attacks-on-this-day",
      providesTags: ["DailyAttacks"],
    }),

    addNewIncident: builder.mutation({
      query: (newIncident) => ({
        url: "/incidents",
        method: "POST",
        body: newIncident,
      }),
      invalidatesTags: [
        "Incidents",
        "Industries",
        "TopCountries",
        "DailyAttacks",
      ], 
    }),
  }),
});

export const {
  useGetAllIncidentsQuery,
  useGetTopTargetedCountriesQuery,
  useGetTopTargetedIndustriesQuery,
  useGetAttacksOnThisDayQuery,
  useAddNewIncidentMutation,
} = incidentApiSlice;

export default incidentApiSlice;
