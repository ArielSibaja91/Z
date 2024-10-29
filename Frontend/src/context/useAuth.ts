import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");

    const { setUser } = context;
    const navigate = useNavigate();

    const signup = async (userData: { email?: string; username?: string; fullName?: string; password?: string; }) => {
        try {
            const response = await axios.post("api/auth/signup", userData);
            setUser(response.data);
            toast.success("Account created successfully");
            navigate(`/profile/${userData.username}`)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.error || "Something went wrong";
                toast.error(errorMessage);
            } else {
                toast.error("An unexpected error occurred.");
            };
        };
    };

    const login = async (userData: { username?: string; password?: string; }) => {
        try {
            const response = await axios.post("/api/auth/login", userData);
            setUser(response.data);
            toast.success("Logged in successfully");
            navigate(`/profile/${userData.username}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || "Something went wrong";
                toast.error(errorMessage);
            } else {
                toast.error("An unexpected error occurred.");
            };
        };
    };
    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
            setUser(null);
            toast.success("Logged out successfully");
            navigate("/signup");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || "Something went wrong";
                toast.error(errorMessage);
            };
        };
    };
    return { ...context, signup, login, logout };
};