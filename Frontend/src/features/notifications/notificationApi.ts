import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Notification } from '../../types/notification';

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/notifications',
    }),
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<Notification[], void>({
            query: () => '/',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Notification' as const, id: _id })),
                        { type: 'Notification', id: 'LIST' },
                    ]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),
        deleteNotifications: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/',
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
        }),
        deleteNotification: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Notification', id }],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useDeleteNotificationsMutation,
    useDeleteNotificationMutation,
} = notificationApi;