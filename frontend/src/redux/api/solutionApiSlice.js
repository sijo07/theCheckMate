import { apiSlice } from "./apiSlice";
import { SOLUTIONS_URL } from "../constants";

export const solutionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSolutions: builder.query({
            query: ({ category, severity, status, search } = {}) => {
                const params = new URLSearchParams();
                if (category) params.append("category", category);
                if (severity) params.append("severity", severity);
                if (status) params.append("status", status);
                if (search) params.append("search", search);
                return `${SOLUTIONS_URL}?${params.toString()}`;
            },
            providesTags: ["Solutions"],
        }),
        getSolutionById: builder.query({
            query: (id) => `${SOLUTIONS_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: "Solutions", id }],
        }),
        createSolution: builder.mutation({
            query: (data) => ({
                url: SOLUTIONS_URL,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Solutions"],
        }),
        updateSolution: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SOLUTIONS_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Solutions", id }],
        }),
        deleteSolution: builder.mutation({
            query: (id) => ({
                url: `${SOLUTIONS_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Solutions"],
        }),
        applySolution: builder.mutation({
            query: (id) => ({
                url: `${SOLUTIONS_URL}/${id}/apply`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Solutions", id }],
        }),
        rateSolution: builder.mutation({
            query: ({ id, effectiveness }) => ({
                url: `${SOLUTIONS_URL}/${id}/rate`,
                method: "POST",
                body: { effectiveness },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Solutions", id }],
        }),
    }),
});

export const {
    useGetSolutionsQuery,
    useGetSolutionByIdQuery,
    useCreateSolutionMutation,
    useUpdateSolutionMutation,
    useDeleteSolutionMutation,
    useApplySolutionMutation,
    useRateSolutionMutation,
} = solutionApiSlice;
