import { useState, useEffect } from "react"
import axios from "axios"
import { User } from "../types/postProps"

type useUserResult = {
    isLoading: boolean;
    suggestedUsers: User[] | null;
    followUnfollowUser: (userId: string, isFollowing: boolean) => void;
    getUser: (username: string) => Promise<User | null>;
}

export const useUser = (): useUserResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [suggestedUsers, setSuggestedUsers] = useState<User[] | null>(null);

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("/api/users/suggested");
                setSuggestedUsers(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    return (error.response?.data?.error || "Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }
        getSuggestedUsers();
    }, []);

    const followUnfollowUser = async (userId: string, isFollowing: boolean) => {
        if(!suggestedUsers) return;

        const previousUsers = [...suggestedUsers];

        setSuggestedUsers((prevUsers) =>
            prevUsers?.map((user) =>
                user._id === userId
                    ? { ...user, isFollowing: !isFollowing }
                    : user
            ) || []
        );
        try {
            await axios.post(`/api/users/follow/${userId}`);
        } catch (error) {
            setSuggestedUsers(previousUsers);
            if (axios.isAxiosError(error)) {
                return (error.response?.data?.error || "Something went wrong");
            };
        };
    };

    const getUser = async (username: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/users/profile/${username}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return (error.response?.data?.error || "Something went wrong");
            };
            return null;
        } finally {
            setIsLoading(false);
        };
    };

    return { isLoading, suggestedUsers, followUnfollowUser, getUser }
};