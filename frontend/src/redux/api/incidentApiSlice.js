import { apiSlice } from "./apiSlice";
import { INCIDENTS_URL } from "../constants";

export const incidentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllIncidents: builder.query({
      query: () => INCIDENTS_URL,
      providesTags: ["Incidents"],
    }),

    getTopTargetedCountries: builder.query({
      query: () => `${INCIDENTS_URL}/top-targeted-countries`,
      providesTags: ["TopCountries"],
    }),

    getTopTargetedIndustries: builder.query({
      query: () => `${INCIDENTS_URL}/top-targeted-industries`,
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
      query: () => `${INCIDENTS_URL}/attacks-on-this-day`,
      providesTags: ["DailyAttacks"],
    }),

    addNewIncident: builder.mutation({
      query: (newIncident) => ({
        url: INCIDENTS_URL,
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
