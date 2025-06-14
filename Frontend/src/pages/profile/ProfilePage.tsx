import { ChangeEvent, useRef, useState } from "react";
import { useGetUserProfileQuery, useFollowUnfollowUserMutation, useUpdateUserProfileMutation } from "../../features/user/userApi";
import { useAuthCheckQuery } from "../../features/auth/authApi";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import { Posts } from "../../components/common/Posts";
import { ProfileHeaderSkeleton } from "../../components/skeletons/ProfileHeaderSkeleton";
import { EditProfileModal } from "./EditProfileModal";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { formatMemberSinceDate } from "../../utils/date/date";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { data: user, isLoading: isUserLoading, refetch: refetchUserProfile } = useGetUserProfileQuery(username || '', {
    skip: !username,
  });
  const { data: authUser } = useAuthCheckQuery();
  const [feedType, setFeedType] = useState<string>("posts");
  const { posts, isLoading, userPostsCount } = usePost(feedType, user);
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);

  const coverImgRef = useRef<HTMLInputElement | null>(null);
  const profileImgRef = useRef<HTMLInputElement | null>(null);

  const [followUnfollowUser, { isLoading: isFollowingOrUnfollowing }] = useFollowUnfollowUserMutation();
  const [updateUserProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();

  const isMyProfile = user?.username === authUser?.username;
  const isCurrentlyFollowing = authUser?._id ? user?.followers?.includes(authUser._id) : false;
  const formattedDate = user?.createdAt ? formatMemberSinceDate(user.createdAt) : undefined;

  const handleImgChange = (
    e: ChangeEvent<HTMLInputElement>,
    state: "coverImg" | "profileImg"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          if (state === "coverImg") {
            setCoverImg(reader.result);
          } else if (state === "profileImg") {
            setProfileImg(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

    const handleFollowUnfollow = async () => {
    if (!user || !authUser) return;
    try {
      await followUnfollowUser({ userId: user._id as string, currentUserFollowing: authUser?.following || [] }).unwrap();
    } catch (err) {
      console.error("Error al seguir/dejar de seguir:", err);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const updateData: {
        fullName?: string;
        email?: string;
        username?: string;
        bio?: string;
        link?: string;
        profileImg?: string;
        coverImg?: string;
      } = {};

      // Convert updateData to FormData
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      await updateUserProfile(formData).unwrap();
      toast.success("Perfil actualizado exitosamente!");
      refetchUserProfile();
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
    }
  };

  return (
    <main className="flex-[4_4_0] border-r border-white/20 min-h-screen">
      {isUserLoading && <ProfileHeaderSkeleton />}
      {!isUserLoading && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      <div className="flex flex-col">
        {!isUserLoading && user && (
          <>
            <div className="flex gap-10 px-4 py-2 items-center">
              <Link to="/">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg">{user?.fullName}</p>
                <span className="text-sm text-slate-500">
                  {userPostsCount} posts
                </span>
              </div>
            </div>
            <div className="relative group/cover">
              <img
                src={coverImg || user?.coverImg || "/vite.svg"}
                className="h-52 w-full object-cover"
                alt="cover image"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                  onClick={() => coverImgRef.current?.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </div>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              <div className="absolute -bottom-16 left-4">
                <div className="w-32 relative group/avatar">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={
                      profileImg ||
                      user?.profileImg ||
                      "/avatar-placeholder.png"
                    }
                  />
                  {isMyProfile && (
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 transition duration-200 cursor-pointer">
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current?.click()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end px-4 mt-5">
              {isMyProfile && <EditProfileModal />}
              {!isMyProfile && (
                <button
                  className="bg-black text-white hover:bg-white hover:text-black outline outline-1 outline-white/35 px-4 py-1.5 rounded-full duration-150"
                  onClick={handleFollowUnfollow}
                  disabled={isFollowingOrUnfollowing}
                >
                  {isFollowingOrUnfollowing ? <LoadingSpinner className="w-5 h-5 fill-white" /> : (isCurrentlyFollowing ? "Following" : "Follow")}
                </button>
              )}
              {(coverImg || profileImg) && isMyProfile && (
                <button
                  className="bg-primary rounded-full text-white px-4 ml-2 hover:brightness-[.85] duration-200"
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4 mt-14 px-4">
              <div className="flex flex-col">
                <span className="font-bold text-lg">{user?.fullName}</span>
                <span className="text-sm text-slate-500">
                  @{user?.username}
                </span>
                <span className="text-sm my-1">{user?.bio}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {user?.link && (
                  <div className="flex gap-1 items-center ">
                    <>
                      <FaLink className="w-3 h-3 text-slate-500" />
                      <a
                        href="https://youtube.com/@asaprogrammer_"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {user.link}
                      </a>
                    </>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">
                    {formattedDate || "Member since unknown"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user.following?.length}
                  </span>
                  <span className="text-slate-500 text-xs">Following</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user.followers?.length}
                  </span>
                  <span className="text-slate-500 text-xs">Followers</span>
                </div>
              </div>
            </div>
            <div className="flex w-full border-b border-white/20 mt-4">
              <div
                className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("posts")}
              >
                Posts
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                )}
              </div>
              <div
                className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("likes")}
              >
                Likes
                {feedType === "likes" && (
                  <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </>
        )}
        <Posts posts={posts} isLoading={isLoading} />
      </div>
    </main>
  );
};
