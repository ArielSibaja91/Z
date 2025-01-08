import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { login, logout, fetchUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const useAuth = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const signup = async (userData: { email?: string; username?: string; fullName?: string; password?: string }) => {
        try {
            const response = await axios.post("/api/auth/signup", userData);
            dispatch(login(response.data));
            toast.success("Account created successfully");
            navigate(`/profile/${response.data.username}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || "Something went wrong";
                toast.error(errorMessage);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const handleLogin = async (userData: { username?: string; password?: string }) => {
        const result = await dispatch(login(userData));
        if (login.fulfilled.match(result)) {
            toast.success("Logged in successfully");
            navigate(`/profile/${result.payload.username}`);
        } else if (login.rejected.match(result)) {
            toast.error(String(result.payload || "Login failed"));
        }
    };

    const handleLogout = async () => {
        const result = await dispatch(logout());
        if (logout.fulfilled.match(result)) {
            toast.success("Logged out successfully");
            navigate("/signup");
        } else if (logout.rejected.match(result)) {
            toast.error(String(result.payload || "Logout failed"));
        }
    };

    return {
        ...authState,
        login: handleLogin,
        logout: handleLogout,
        fetchUser: () => dispatch(fetchUser()),
        signup,
    };
};