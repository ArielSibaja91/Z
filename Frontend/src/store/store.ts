import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { postApi } from "../features/posts/postApi";
import userReducer from "../features/user/userSlice";
import postReducer from "../features/posts/postSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer, [authApi.reducerPath]: authApi.reducer,
        user: userReducer,
        posts: postReducer, [postApi.reducerPath]: postApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, postApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;