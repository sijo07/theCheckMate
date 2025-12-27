import { apiSlice } from "./apiSlice";
import { NOTIFICATIONS_URL } from "../constants";

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: ({ type, read } = {}) => {
                const params = new URLSearchParams();
                if (type) params.append("type", type);
                if (read !== undefined) params.append("read", read);
                return `${NOTIFICATIONS_URL}?${params.toString()}`;
            },
            providesTags: ["Notifications"],
        }),

        getNotificationById: builder.query({
            query: (id) => `${NOTIFICATIONS_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: "Notifications", id }],
        }),

        createNotification: builder.mutation({
            query: (notification) => ({
                url: NOTIFICATIONS_URL,
                method: "POST",
                body: notification,
            }),
            invalidatesTags: ["Notifications"],
        }),

        markAsRead: builder.mutation({
            query: (id) => ({
                url: `${NOTIFICATIONS_URL}/${id}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),

        markAllAsRead: builder.mutation({
            query: () => ({
                url: `${NOTIFICATIONS_URL}/read-all`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),

        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `${NOTIFICATIONS_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications"],
        }),

        getUnreadCount: builder.query({
            query: () => `${NOTIFICATIONS_URL}/unread-count`,
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
