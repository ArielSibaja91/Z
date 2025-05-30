import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import { usersApi } from "../features/user/userApi";
import { postApi } from "../features/posts/postApi";
import postReducer from "../features/posts/postSlice";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        posts: postReducer, [postApi.reducerPath]: postApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware, postApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;