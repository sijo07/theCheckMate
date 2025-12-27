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

    resolveIncident: builder.mutation({
      query: (id) => ({
        url: `${INCIDENTS_URL}/${id}/resolve`,
        method: "PUT",
      }),
      invalidatesTags: ["Incidents"],
    }),

    deleteIncident: builder.mutation({
      query: (id) => ({
        url: `${INCIDENTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Incidents"],
    }),
  }),
});

export const {
  useGetAllIncidentsQuery,
  useGetTopTargetedCountriesQuery,
  useGetTopTargetedIndustriesQuery,
  useGetAttacksOnThisDayQuery,
  useAddNewIncidentMutation,
  useResolveIncidentMutation,
  useDeleteIncidentMutation,
} = incidentApiSlice;

export default incidentApiSlice;
