import { Link } from "react-router-dom";
import { RightPanelSkeleton } from "../skeletons/RightPanelSkeleton";
import { useGetSuggestedUsersQuery, useFollowUnfollowUserMutation } from "../../features/user/userApi";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { LoadingSpinner } from "./LoadingSpinner";

export const RightPanel = () => {
  const { data: suggestedUsers, isLoading, isError, error } = useGetSuggestedUsersQuery();
  const [followUnfollowUser, { isLoading: isMutatingFollow }] = useFollowUnfollowUserMutation();
  const authUser = (useSelector((state: RootState) => state.authApi.queries['authCheck(undefined)']?.data) as any) || null;
  const currentUserFollowing = authUser?.following || [];

  if (isError) {
    console.error("Error fetching suggested users:", error);
      <div className="md:w-64 w-0">Error fetching suggestions.</div>;
  }

  if (!isLoading && (!suggestedUsers || suggestedUsers.length === 0)) {
    return <div className="md:w-64 w-0"></div>;
  
  }

    if (isLoading) {
    return (
      <aside className="hidden lg:block my-4 mx-2">
        <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
          <p className="font-bold">Who to follow</p>
          <div className="flex flex-col gap-4">
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          </div>
        </div>
      </aside>
    );
  }

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return <div className="md:w-64 w-0"></div>;
  }

  const handleFollowUnfollow = async (userId: string, isFollowing: boolean) => {
    try {
      await followUnfollowUser({ userId, currentUserFollowing }).unwrap();
      toast.success(isFollowing ? "User unfollowed" : "User followed");
    } catch (err: any) {
      console.error("Follow/Unfollow error", err);
      toast.error(err.data?.error || "Something went wrong.");
    }
  };

  return (
    <aside className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="w-full">
                    <img
                      className="w-8 rounded-full"
                      src={user.profileImg || "/avatar-placeholder.png"}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                <button
                  className="bg-white px-3 py-1 text-black hover:bg-white hover:opacity-90 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFollowUnfollow(user._id!, (user.isFollowing || false));
                  }}
                  disabled={isMutatingFollow}
                >
                  {isMutatingFollow ? <LoadingSpinner className="w-5 h-5 fill-black" /> : (user.isFollowing ? "Unfollow" : "Follow")}
                </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </aside>
  );
};
