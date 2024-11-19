import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { CreatePost } from "./CreatePost";
import { Posts } from "../../components/common/Posts";
import { usePost } from "../../hooks/usePost";

export const HomePage = () => {
  const {user: authUser} = useAuth();
  const [feedType, setFeedType] = useState<string>("forYou");
  const { posts, isLoading, addPost, deletePost, likePost, commentPost } = usePost(feedType, authUser);

  return (
    <main className="flex-[4_4_0] mr-auto border-r border-white/20 min-h-screen">
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
      <CreatePost addPost={addPost} />
      {/* POSTS */}
      <Posts posts={posts} deletePost={deletePost} likePost={likePost} commentPost={commentPost} isLoading={isLoading} />
    </main>
  );
};
