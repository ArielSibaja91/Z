import { useState, useEffect, useCallback } from "react";
import { Post as PostType } from "../types/postProps";
import axios from "axios";
import toast from "react-hot-toast";

type UsePostResult = {
    posts: PostType[] | null;
    isLoading: boolean;
    deletePost: (postId: string) => Promise<void>;
}

export const usePost = (feedType?: string): UsePostResult => {
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getPostsEndpoint = useCallback(() => {
        switch (feedType) {
            case "forYou":
                return "api/posts/all";
            case "following":
                return "api/posts/following";
            default:
                return "api/posts/all";
        }
    }, [feedType]);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(getPostsEndpoint());
                setPosts(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    return (error.response?.data?.error || "Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [getPostsEndpoint]);

    const deletePost = async (postId: string) => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/posts/${postId}`);
            setPosts((prevPosts) =>
                prevPosts ? prevPosts.filter((post) => post._id !== postId) : null
            );
            toast.success("Post deleted successfully");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to delete post");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { posts, isLoading, deletePost}
};