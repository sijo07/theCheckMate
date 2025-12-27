import { apiSlice } from "./apiSlice";
import { SERVICES_URL } from "../constants";

export const serviceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query({
            query: ({ category, status, search } = {}) => {
                const params = new URLSearchParams();
                if (category) params.append("category", category);
                if (status) params.append("status", status);
                if (search) params.append("search", search);
                return `${SERVICES_URL}?${params.toString()}`;
            },
            providesTags: ["Services"],
        }),
        getServiceById: builder.query({
            query: (id) => `${SERVICES_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: "Services", id }],
        }),
        createService: builder.mutation({
            query: (data) => ({
                url: SERVICES_URL,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Services"],
        }),
        updateService: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SERVICES_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Services", id }],
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `${SERVICES_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Services"],
        }),
        getServiceRequests: builder.query({
            query: ({ status, urgency } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append("status", status);
                if (urgency) params.append("urgency", urgency);
                return `${SERVICES_URL}/requests?${params.toString()}`;
            },
            providesTags: ["ServiceRequests"],
        }),
        getServiceRequestById: builder.query({
            query: (id) => `${SERVICES_URL}/requests/${id}`,
            providesTags: (result, error, id) => [{ type: "ServiceRequests", id }],
        }),
        createServiceRequest: builder.mutation({
            query: (data) => ({
                url: `${SERVICES_URL}/requests`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ServiceRequests"],
        }),
        updateServiceRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SERVICES_URL}/requests/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "ServiceRequests", id }],
        }),
        addNoteToRequest: builder.mutation({
            query: ({ id, text }) => ({
                url: `${SERVICES_URL}/requests/${id}/notes`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "ServiceRequests", id }],
        }),
        completeServiceRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SERVICES_URL}/requests/${id}/complete`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "ServiceRequests", id }],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
    useGetServiceRequestsQuery,
    useGetServiceRequestByIdQuery,
    useCreateServiceRequestMutation,
    useUpdateServiceRequestMutation,
    useAddNoteToRequestMutation,
    useCompleteServiceRequestMutation,
} = serviceApiSlice;
