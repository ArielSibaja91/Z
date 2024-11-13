import { useState, useEffect } from "react"
import axios from "axios"
import { User } from "../types/postProps"

type useUserResult = {
    isLoading: boolean;
    suggestedUsers: User[] | null;
    followUnfollowUser: (userId: string, isFollowing: boolean) => void
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
        try {
            const response = await axios.post(`/api/users/follow/${userId}`);
            if (response.status === 200) {
                setSuggestedUsers((prevUsers) =>
                    prevUsers?.map((user) =>
                        user._id === userId
                            ? { ...user, isFollowing: !isFollowing }
                            : user
                    ) || []
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return (error.response?.data?.error || "Something went wrong");
            }
        }
    };

    return { isLoading, suggestedUsers, followUnfollowUser }
}