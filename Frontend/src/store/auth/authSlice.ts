import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types/postProps";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isError: boolean;
};

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isError: false,
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/api/auth/me");
        return response.data;
    } catch (error) {
        return rejectWithValue("No authenticated user found");
    };
});

export const login = createAsyncThunk(
    "auth/login",
    async (userData: { username?: string; password?: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/auth/login", userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Something went wrong");
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await axios.post("/api/auth/logout");
        return null;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || "Something went wrong");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;