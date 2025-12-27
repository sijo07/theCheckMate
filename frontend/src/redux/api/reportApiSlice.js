import { apiSlice } from "./apiSlice";
import { REPORTS_URL } from "../constants";

export const reportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReports: builder.query({
            query: () => REPORTS_URL,
            providesTags: ["Reports"],
        }),

        getReportById: builder.query({
            query: (id) => `${REPORTS_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: "Reports", id }],
        }),

        createReport: builder.mutation({
            query: (report) => ({
                url: REPORTS_URL,
                method: "POST",
                body: report,
            }),
            invalidatesTags: ["Reports"],
        }),

        deleteReport: builder.mutation({
            query: (id) => ({
                url: `${REPORTS_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Reports"],
        }),

        getReportData: builder.query({
            query: (id) => `${REPORTS_URL}/${id}/data`,
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
