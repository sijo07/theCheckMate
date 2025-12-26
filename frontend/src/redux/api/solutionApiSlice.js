import { apiSlice } from "./apiSlice";

const SOLUTIONS_URL = "/api/solutions";

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
            providesTags: ["Solution"],
        }),
        getSolutionById: builder.query({
            query: (id) => `${SOLUTIONS_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: "Solution", id }],
        }),
        createSolution: builder.mutation({
            query: (data) => ({
                url: SOLUTIONS_URL,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Solution"],
        }),
        updateSolution: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SOLUTIONS_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Solution", id }],
        }),
        deleteSolution: builder.mutation({
            query: (id) => ({
                url: `${SOLUTIONS_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Solution"],
        }),
        applySolution: builder.mutation({
            query: (id) => ({
                url: `${SOLUTIONS_URL}/${id}/apply`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Solution", id }],
        }),
        rateSolution: builder.mutation({
            query: ({ id, effectiveness }) => ({
                url: `${SOLUTIONS_URL}/${id}/rate`,
                method: "POST",
                body: { effectiveness },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Solution", id }],
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
