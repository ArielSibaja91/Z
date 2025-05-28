import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/postProps';

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
        }),
        login: builder.mutation<User, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        authCheck: builder.query<User, void>({
            query: () => '/me',
        }),
    }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation, useAuthCheckQuery } = authApi;