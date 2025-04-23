import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    useMeQuery,
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
} from "../features/auth/authApi";
import { setUser } from "../features/auth/authSlice"; // Imports setUser action
import React from "react";

export const useAuth = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { data: user, isLoading, isError, refetch } = useMeQuery();

    const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();
    const [signupApi, { isLoading: isSignupLoading }] = useSignupMutation();
    const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();

    React.useEffect(() => {
        if (user) {
            dispatch(setUser(user));
        }
    }, [user, dispatch]);

    const signup = async (userData: { email?: string; username?: string; fullName?: string; password?: string }) => {
        try {
            const result = await signupApi(userData).unwrap();
            dispatch(setUser(result));
            toast.success("Account created successfully");
            navigate(`/profile/${result.username}`);
        } catch (error: any) {
            toast.error(error?.data?.error || "Something went wrong during signup");
        }
    };

    const handleLogin = async (userData: { username?: string; password?: string }) => {
        try {
            const result = await loginApi(userData).unwrap();
            dispatch(setUser(result));
            toast.success("Logged in successfully");
            navigate(`/profile/${result.username}`);
        } catch (error: any) {
            toast.error(error?.data?.error || "Login failed");
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
            dispatch(setUser(null));
            toast.success("Logged out successfully");
            navigate("/signup");
        } catch (error: any) {
            toast.error(error?.data?.error || "Logout failed");
        }
    };

    return {
        user: authState.user,
        isLoading: isLoading || isLoginLoading || isSignupLoading || isLogoutLoading,
        isError,
        login: handleLogin,
        logout: handleLogout,
        fetchUser: refetch,
        signup,
    };
};