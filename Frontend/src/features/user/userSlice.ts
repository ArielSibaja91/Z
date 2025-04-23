import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/postProps";

interface UserState {
    isLoading: boolean;
    suggestedUsers: User[] | null;
    user : User | null;
}

const initialState: UserState = {
    isLoading: false,
    suggestedUsers: null,
    user: null,
};

export const fetchSuggestedUsers = createAsyncThunk(
    "user/fetchSuggestedUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/users/suggested");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Something went wrong");
        }
    }
);

export const followUnfollowUser = createAsyncThunk(
    "user/followUnfollowUser",
    async ({ userId, isFollowing }: { userId: string; isFollowing: boolean }, { rejectWithValue }) => {
        try {
            await axios.post(`/api/users/follow/${userId}`);
            return { userId, isFollowing };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Something went wrong");
        }
    }
);

export const getUserProfile = createAsyncThunk(
    "user/getUserProfile",
    async (username: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/users/profile/${username}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Something went wrong");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestedUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSuggestedUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.isLoading = false;
                state.suggestedUsers = action.payload;
            })
            .addCase(fetchSuggestedUsers.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(followUnfollowUser.fulfilled, (state, action) => {
                if (state.suggestedUsers) {
                    state.suggestedUsers = state.suggestedUsers.map((user) =>
                        user._id === action.payload.userId
                            ? { ...user, isFollowing: !action.payload.isFollowing }
                            : user
                    );
                }
            })
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(getUserProfile.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default userSlice.reducer;
