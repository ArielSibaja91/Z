import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Post, User, Comment } from '../../types/postProps';

// Define initial state
interface PostsState {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    isLoading: false,
    error: null,
};

// 🔄 Async Thunks

// Fetch posts based on feed type
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async ({ feedType, authUser }: { feedType?: string; authUser?: User | null }) => {
        let endpoint = 'api/posts/all';
        switch (feedType) {
            case 'following':
                endpoint = 'api/posts/following';
                break;
            case 'posts':
                endpoint = `api/posts/user/${authUser?.username}`;
                break;
            case 'likes':
                endpoint = `api/posts/likes/${authUser?._id}`;
                break;
        }
        const response = await axios.get(endpoint);
        return response.data;
    }
);

// Add a new post
export const addPost = createAsyncThunk(
    'posts/addPost',
    async (postData: { text: string; img: string | null }) => {
        const response = await axios.post('api/posts/create', postData);
        return response.data;
    }
);

// Delete a post
export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId: string, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/posts/${postId}`);
            return postId;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Like a post (Optimistic UI)
export const likePost = createAsyncThunk(
    'posts/likePost',
    async ({ postId, userId }: { postId: string; userId: string }, { getState, dispatch }) => {
        const state = getState() as { posts: PostsState };
        const post = state.posts.posts.find((p) => p._id === postId);
        if (!post) return;

        const liked = post.likes.includes(userId);

        // Optimistic update
        dispatch(
            updatePostLikes({
                postId,
                userId,
                liked: !liked,
            })
        );

        try {
            await axios.post(`/api/posts/like/${postId}`);
        } catch (error) {
            // Rollback if error
            dispatch(
                updatePostLikes({
                    postId,
                    userId,
                    liked,
                })
            );
            throw error;
        }
    }
);

// Comment on a post
export const commentPost = createAsyncThunk(
    'posts/commentPost',
    async ({ postId, text, authUser }: { postId: string; text: string; authUser: User }) => {
        const tempId = Date.now().toString();

        const newComment: Comment = {
            _id: tempId,
            user: authUser,
            text,
        };

        return { postId, newComment };
    }
);

// 🎛️ Slice
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // Optimistic UI for likes
        updatePostLikes: (state, action: PayloadAction<{ postId: string; userId: string; liked: boolean }>) => {
            const { postId, userId, liked } = action.payload;
            const post = state.posts.find((p) => p._id === postId);
            if (post) {
                if (liked) {
                    post.likes.push(userId);
                } else {
                    post.likes = post.likes.filter((id) => id !== userId);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch posts';
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post._id !== action.payload);
            });
    },
});

// Export actions
export const { updatePostLikes } = postsSlice.actions;

// Export reducer
export default postsSlice.reducer;
