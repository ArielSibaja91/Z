import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Post, User, Comment } from '../../types/postProps';
import { RootState } from '../../store/store';

interface FetchPostsArgs {
    feedType?: string;
    authUser?: User | null;
}

export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        fetchPosts: builder.query<Post[], FetchPostsArgs>({
            query: ({ feedType, authUser }) => {
                let endpoint = '';
                switch (feedType) {
                    case 'forYou':
                        endpoint = '/posts/all';
                        break;
                    case 'following':
                        endpoint = '/posts/following';
                        break;
                    case 'posts':
                        endpoint = `/posts/user/${authUser?.username}`;
                        break;
                    case 'likes':
                        endpoint = `/posts/likes/${authUser?._id}`;
                        break;
                }
                return endpoint;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Posts' as const, id: _id })),
                        { type: 'Posts', id: 'LIST' },
                    ]
                    : [{ type: 'Posts', id: 'LIST' }],
        }),
        addPost: builder.mutation<Post, { text: string; img: string | null }>({
            query: (postData) => ({
                url: '/posts/create',
                method: 'POST',
                body: postData,
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        deletePost: builder.mutation<string, string>({
            query: (postId) => ({
                url: `/posts/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
        }),
        likePost: builder.mutation<void, string>({
            query: (postId) => ({
                url: `/posts/like/${postId}`,
                method: 'POST',
            }),
            async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
                const authUser = (getState() as RootState).authApi.queries['authCheck(undefined)']?.data as User | undefined;
                const userId = authUser?._id;
                if (!userId) return;
                const patchResult = dispatch(
                    postApi.util.updateQueryData('fetchPosts', {}, (draft) => {
                        draft.forEach((post) => {
                            if (post._id === postId) {
                                const likedIndex = post.likes.indexOf(userId);
                                if (likedIndex === -1) {
                                    post.likes.push(userId);
                                } else {
                                    post.likes.splice(likedIndex, 1);
                                }
                            }
                        });
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (_, __, postId) => [{ type: 'Posts', id: postId }],
        }),
        commentPost: builder.mutation<{ postId: string; newComment: Comment }, { postId: string; text: string }>({
            query: ({ postId, text }) => ({
                url: `/posts/comment/${postId}`,
                method: 'POST',
                body: { text },
            }),
            async onQueryStarted({ postId, text }, { dispatch, queryFulfilled, getState }) {
                const authUser = (getState() as RootState).authApi.queries['authCheck(undefined)']?.data as User | undefined;
                if (!authUser) return;
                const newComment: Comment = {
                    _id: Date.now().toString(),
                    user: authUser,
                    text,
                };
                const patchResult = dispatch(
                    postApi.util.updateQueryData('fetchPosts', {}, (draft) => {
                        const post = draft.find((p) => p._id === postId);
                        if (post) {
                            post.comments = post.comments || [];
                            post.comments.push(newComment);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (_, __, { postId }) => [{ type: 'Posts', id: postId }],
        }),
    }),
});

export const {
    useFetchPostsQuery,
    useAddPostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useCommentPostMutation,
} = postApi;