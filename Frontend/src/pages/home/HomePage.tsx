import { useState } from "react";
import { useAuthCheckQuery } from "../../features/auth/authApi";
import { CreatePost } from "./CreatePost";
import { MobileHeader } from "./MobileHeader";
import { Posts } from "../../components/common/Posts";
import { usePost } from "../../hooks/usePost";

export const HomePage = () => {
  const { data: user } = useAuthCheckQuery();
  const [feedType, setFeedType] = useState<string>("forYou");
  const { posts, isLoading, addPostAction } = usePost(feedType, user);

  return (
    <main className="flex-[4_4_0] xl:mr-auto xl:border-r border-white/20 min-h-screen">
      <MobileHeader />
      <header className="flex w-full border-b border-white/20">
        <button
          className={
            "flex justify-center flex-1 p-3 hover:bg-zinc-900 transition duration-300 cursor-pointer relative"
          }
          onClick={() => setFeedType("forYou")}
        >
          For you
          {feedType === "forYou" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
          )}
        </button>
        <button
          className="flex justify-center flex-1 p-3 hover:bg-zinc-900 transition duration-300 cursor-pointer relative"
          onClick={() => setFeedType("following")}
        >
          Following
          {feedType === "following" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
          )}
        </button>
      </header>
      {/*  CREATE POST INPUT */}
      {feedType === "forYou" && (
        <CreatePost addPost={addPostAction} />
      )}
      {/* POSTS */}
      <Posts posts={posts} isLoading={isLoading} />
    </main>
  );
};
