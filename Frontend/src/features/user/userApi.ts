import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/postProps";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUserProfile: builder.query<User, string>({
            query: (username) => `/profile/${username}`,
            providesTags: (_result, _error, username) => [{ type: 'User', id: username }],
        }),
        getSuggestedUsers: builder.query<User[], void>({
            query: () => '/suggested',
            providesTags: ['User'],
        }),
        followUnfollowUser: builder.mutation<
            { message: string },
            { userId: string }
        >({
            query: ({ userId }) => ({
                url: `/follow/${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['User'],
            // Opcional: optimistic update para una mejor UX
            async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
                // Acceder al estado actual si es necesario
                // const state = getState() as RootState; // Si necesitas el tipo RootState
                const patchResult = dispatch(
                    usersApi.util.updateQueryData('getSuggestedUsers', undefined, (draft) => {
                        if (draft) {
                            const userIndex = draft.findIndex(user => user._id === userId);
                            if (userIndex !== -1) {
                                // Aquí necesitarías ajustar el estado de seguimiento.
                                // Como tu backend solo devuelve un mensaje, y el isFollowing
                                // es algo que infieres en el frontend, esto es un poco más complejo.
                                // Idealmente, tu backend devolvería el estado actualizado del usuario seguido,
                                // o al menos una indicación si se siguió o se dejó de seguir.
                                // Por ahora, solo invalidaremos el tag.
                                // Si tu modelo `User` tiene un campo `isFollowing`, podrías actualizarlo aquí.
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateUserProfile: builder.mutation<
            User,
            FormData
        >({
            query: (userData) => ({
                url: '/update',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: (_result, _error, userData) => {
                const username = userData.get('username') as string;
                return [{ type: 'User', id: username }];
            },
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useGetSuggestedUsersQuery,
    useFollowUnfollowUserMutation,
    useUpdateUserProfileMutation,
} = usersApi;