import { apiSlice } from "./apiSlice";

const SERVICES_URL = "/api/services";

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
            providesTags: ["Service"],
        }),
        getServiceById: builder.query({
            query: (id) => `${SERVICES_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: "Service", id }],
        }),
        createService: builder.mutation({
            query: (data) => ({
                url: SERVICES_URL,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Service"],
        }),
        updateService: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SERVICES_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Service", id }],
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `${SERVICES_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Service"],
        }),
        getServiceRequests: builder.query({
            query: ({ status, urgency } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append("status", status);
                if (urgency) params.append("urgency", urgency);
                return `${SERVICES_URL}/requests?${params.toString()}`;
            },
            providesTags: ["ServiceRequest"],
        }),
        getServiceRequestById: builder.query({
            query: (id) => `${SERVICES_URL}/requests/${id}`,
            providesTags: (result, error, id) => [{ type: "ServiceRequest", id }],
        }),
        createServiceRequest: builder.mutation({
            query: (data) => ({
                url: `${SERVICES_URL}/requests`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ServiceRequest"],
        }),
        updateServiceRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SERVICES_URL}/requests/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "ServiceRequest", id }],
        }),
        addNoteToRequest: builder.mutation({
            query: ({ id, text }) => ({
                url: `${SERVICES_URL}/requests/${id}/notes`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "ServiceRequest", id }],
        }),
        completeServiceRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${SERVICES_URL}/requests/${id}/complete`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "ServiceRequest", id }],
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
