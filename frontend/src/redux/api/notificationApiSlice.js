import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const notificationApiSlice = createApi({
    reducerPath: "notificationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include",
    }),
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: ({ type, read } = {}) => {
                const params = new URLSearchParams();
                if (type) params.append("type", type);
                if (read !== undefined) params.append("read", read);
                return `/api/notifications?${params.toString()}`;
            },
            providesTags: ["Notifications"],
        }),

        getNotificationById: builder.query({
            query: (id) => `/api/notifications/${id}`,
            providesTags: (result, error, id) => [{ type: "Notifications", id }],
        }),

        createNotification: builder.mutation({
            query: (notification) => ({
                url: "/api/notifications",
                method: "POST",
                body: notification,
            }),
            invalidatesTags: ["Notifications"],
        }),

        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/api/notifications/${id}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),

        markAllAsRead: builder.mutation({
            query: () => ({
                url: "/api/notifications/read-all",
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),

        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/api/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications"],
        }),

        getUnreadCount: builder.query({
            query: () => "/api/notifications/unread-count",
            providesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetNotificationByIdQuery,
    useCreateNotificationMutation,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useGetUnreadCountQuery,
} = notificationApiSlice;

export default notificationApiSlice;
