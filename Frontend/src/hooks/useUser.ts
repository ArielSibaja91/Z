import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchSuggestedUsers, followUnfollowUser, getUserProfile } from "../features/user/userSlice";

export const useUser = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, suggestedUsers } = useSelector((state: RootState) => state.user);

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
        fetchSuggestedUsers: () => dispatch(fetchSuggestedUsers()),
        followUnfollowUser: followUnfollowUserHandler,
        getUser,
    };
};
