import { Link } from "react-router-dom";
import { RightPanelSkeleton } from "../skeletons/RightPanelSkeleton";
import { useUser } from "../../hooks/useUser";
import toast from "react-hot-toast";

export const RightPanel = () => {
  const { isLoading, suggestedUsers, followUnfollowUser } = useUser();
  // Just in case that they are not any suggested users
  if(suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>
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
                      if (user.isFollowing) {
                        followUnfollowUser(user._id!, true);
                        toast.success("User unfollowed");
                      } else {
                        followUnfollowUser(user._id!, false);
                        toast.success("User followed");
                      }
                    }}
                  >
                    {user.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </aside>
  );
};
