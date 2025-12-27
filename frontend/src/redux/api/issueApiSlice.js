import { apiSlice } from "./apiSlice";
import { ISSUES_URL } from "../constants";

export const issueApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getIssues: builder.query({
            query: ({ type, priority, status, assignedTo, search } = {}) => {
                const params = new URLSearchParams();
                if (type) params.append("type", type);
                if (priority) params.append("priority", priority);
                if (status) params.append("status", status);
                if (assignedTo) params.append("assignedTo", assignedTo);
                if (search) params.append("search", search);
                return `${ISSUES_URL}?${params.toString()}`;
            },
            providesTags: ["Issues"],
        }),
        getIssueById: builder.query({
            query: (id) => `${ISSUES_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: "Issues", id }],
        }),
        createIssue: builder.mutation({
            query: (data) => ({
                url: ISSUES_URL,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Issues"],
        }),
        updateIssue: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${ISSUES_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Issues", id }],
        }),
        assignIssue: builder.mutation({
            query: ({ id, userId }) => ({
                url: `${ISSUES_URL}/${id}/assign`,
                method: "PUT",
                body: { userId },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Issues", id }],
        }),
        addComment: builder.mutation({
            query: ({ id, text }) => ({
                url: `${ISSUES_URL}/${id}/comments`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Issues", id }],
        }),
        resolveIssue: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${ISSUES_URL}/${id}/resolve`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Issues", id }],
        }),
        deleteIssue: builder.mutation({
            query: (id) => ({
                url: `${ISSUES_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Issues"],
        }),
    }),
});

export const {
    useGetIssuesQuery,
    useGetIssueByIdQuery,
    useCreateIssueMutation,
    useUpdateIssueMutation,
    useAssignIssueMutation,
    useAddCommentMutation,
    useResolveIssueMutation,
    useDeleteIssueMutation,
} = issueApiSlice;
