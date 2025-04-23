import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import userReducer from "../features/user/userSlice";
import postReducer from "../features/posts/postSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer, [authApi.reducerPath]: authApi.reducer,
        user: userReducer,
        posts: postReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;