import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Post } from "./Post";
import { PostSkeleton } from "../skeletons/PostSkeleton";
import { Post as PostType } from "../../types/postProps";

export const Posts = ({ feedType }: { feedType?: string }) => {
  const [posts, setPosts] = useState<PostType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPostsEndpoint = useCallback(() => {
    switch (feedType) {
      case "forYou":
        return "api/posts/all";
        break;
      case "following":
        return "api/posts/following";
        break;
      default:
        return "api/posts/all";
        break;
    }
  }, [feedType]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(getPostsEndpoint());
        setPosts(response.data);
      } catch (error) {
        if (axios.isAxiosError(error))
          return error.response?.data?.error || "Something went wrong";
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [getPostsEndpoint]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
