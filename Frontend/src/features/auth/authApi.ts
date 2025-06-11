import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/postProps';
import { notificationApi } from '../notifications/notificationApi';
import { usersApi } from '../user/userApi';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/auth',
    }),
    endpoints: (builder) => ({
        signup: builder.mutation<User, { fullName: string; username: string; email: string; password: string }>({
            query: (credentials) => ({
                url: '/signup',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(notificationApi.util.invalidateTags([{ type: 'Notification', id: 'LIST' }]));
                dispatch(usersApi.util.invalidateTags(['User']));
            },
        }),
        login: builder.mutation<User, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(notificationApi.util.invalidateTags([{ type: 'Notification', id: 'LIST' }]));
                dispatch(usersApi.util.invalidateTags(['User']));
            },
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(notificationApi.util.invalidateTags([{ type: 'Notification', id: 'LIST' }]));
                dispatch(usersApi.util.invalidateTags(['User']));
            },
        }),
        authCheck: builder.query<User, void>({
            query: () => '/me',
        }),
    }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation, useAuthCheckQuery } = authApi;