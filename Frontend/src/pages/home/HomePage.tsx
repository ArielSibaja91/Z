import { useState } from "react";
import { CreatePost } from "./CreatePost";
import { Posts } from "../../components/common/Posts";

export const HomePage = () => {
  const [feedType, setFeedType] = useState<string>("forYou");
  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-white/20 min-h-screen">
        <div className="flex w-full border-b border-white/20">
          <button
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </button>
          <button
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </button>
        </div>
        {/*  CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts />
      </div>
    </>
  );
};
