import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const reportApiSlice = createApi({
    reducerPath: "reportApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include",
    }),
    tagTypes: ["Reports"],
    endpoints: (builder) => ({
        getReports: builder.query({
            query: () => "/api/reports",
            providesTags: ["Reports"],
        }),

        getReportById: builder.query({
            query: (id) => `/api/reports/${id}`,
            providesTags: (result, error, id) => [{ type: "Reports", id }],
        }),

        createReport: builder.mutation({
            query: (report) => ({
                url: "/api/reports",
                method: "POST",
                body: report,
            }),
            invalidatesTags: ["Reports"],
        }),

        deleteReport: builder.mutation({
            query: (id) => ({
                url: `/api/reports/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Reports"],
        }),

        getReportData: builder.query({
            query: (id) => `/api/reports/${id}/data`,
            providesTags: (result, error, id) => [{ type: "Reports", id }],
        }),
    }),
});

export const {
    useGetReportsQuery,
    useGetReportByIdQuery,
    useCreateReportMutation,
    useDeleteReportMutation,
    useGetReportDataQuery,
} = reportApiSlice;

export default reportApiSlice;
