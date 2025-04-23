import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/postProps';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
    endpoints: (builder) => ({
        me: builder.query<User, void>({
            query: () => "/me",
        }),
        login: builder.mutation<User, { username?: string; password?: string }>({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
        }),
        signup: builder.mutation<User, { email?: string; username?: string; fullName?: string; password?: string }>({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useMeQuery,
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
} = authApi;