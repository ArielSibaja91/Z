import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/postProps";
import { RootState } from '../../store/store';

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
            { userId: string; currentUserFollowing: string[] }
        >({
            query: ({ userId }) => ({
                url: `/follow/${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['User'],
            async onQueryStarted({ userId, currentUserFollowing }, { dispatch, queryFulfilled, getState }) {
                const state = getState() as RootState;
                const authUser = (getState() as RootState).authApi.queries['authCheck(undefined)']?.data as User | undefined;

                let patchResultForSuggested: any;
                let patchResultForProfile: any;
                patchResultForSuggested = dispatch(
                    usersApi.util.updateQueryData('getSuggestedUsers', undefined, (draft) => {
                        const userIndex = draft.findIndex(user => user._id === userId);
                        if (userIndex !== -1) {
                            const isCurrentlyFollowing = currentUserFollowing?.includes(userId);

                            if (draft[userIndex].followers && authUser?._id) {
                                if (isCurrentlyFollowing) {
                                    draft[userIndex].followers = draft[userIndex].followers.filter(
                                        (id: string) => id !== authUser._id
                                    );
                                } else {
                                    draft[userIndex].followers.push(authUser._id);
                                }
                            }
                        }
                    })
                );
                const targetUser = usersApi.endpoints.getSuggestedUsers.select(undefined)(state)?.data?.find(user => user._id === userId);
                if (targetUser?.username) {
                    patchResultForProfile = dispatch(
                        usersApi.util.updateQueryData('getUserProfile', targetUser.username, (draft) => {
                            if (draft && draft.followers && authUser?._id) {
                                const isCurrentlyFollowing = currentUserFollowing?.includes(userId);
                                if (isCurrentlyFollowing) {
                                    draft.followers = draft.followers.filter(
                                        (id: string) => id !== authUser._id
                                    );
                                } else {
                                    draft.followers.push(authUser._id);
                                }
                            }
                        })
                    );
                };
                try {
                    await queryFulfilled;
                } catch {
                    patchResultForSuggested?.undo();
                    if (patchResultForProfile) {
                        patchResultForProfile.undo();
                    }
                }
            },
        }),
        updateUserProfile: builder.mutation<
            User,
            FormData
        >({
            query: (userData) => ({
                url: '/update',
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: (_result, _error, userData) => {
                const username = userData.get('username') as string;
                return [{ type: 'User', id: username }];
            },
        }),
        deleteProfileImg: builder.mutation<void, void>({
            query: () => ({
                url: '/profile/delete-image',
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, _arg) => [{ type: 'User', id: 'profile' }],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    usersApi.util.updateQueryData('getUserProfile', 'profile', (draft) => {
                        if (draft) {
                            draft.profileImg = "";
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),
        deleteCoverImg: builder.mutation<void, void>({
            query: () => ({
                url: '/cover/delete-image',
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, _arg) => [{ type: 'User', id: 'cover' }],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    usersApi.util.updateQueryData('getUserProfile', 'cover', (draft) => {
                        if (draft) {
                            draft.coverImg = "";
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useGetSuggestedUsersQuery,
    useFollowUnfollowUserMutation,
    useUpdateUserProfileMutation,
    useDeleteProfileImgMutation,
    useDeleteCoverImgMutation
} = usersApi;