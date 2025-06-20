import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import { usersApi } from "../features/user/userApi";
import { postApi } from "../features/posts/postApi";
import { notificationApi } from "../features/notifications/notificationApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware, postApi.middleware, notificationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;