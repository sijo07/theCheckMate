import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    return headers;
  },
  credentials: "include"
});


export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Incidents", "Industries", "TopCountries", "DailyAttacks", "Notifications", "Reports", "Solutions", "Issues", "Services"],
  endpoints: () => ({}),
});
