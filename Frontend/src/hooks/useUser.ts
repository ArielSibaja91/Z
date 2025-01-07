import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "../store/store";
import { fetchSuggestedUsers, followUnfollowUser, getUserProfile } from "../store/user/userSlice";

export const useUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, suggestedUsers, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchSuggestedUsers());
    }, [dispatch]);

    const followUnfollowUserHandler = (userId: string, isFollowing: boolean) => {
        dispatch(followUnfollowUser({ userId, isFollowing }));
    };

    const getUser = async (username: string) => {
        const user = await dispatch(getUserProfile(username)).unwrap();
        return user;
    };

    return {
        isLoading,
        suggestedUsers,
        error,
        followUnfollowUser: followUnfollowUserHandler,
        getUser,
    };
};
