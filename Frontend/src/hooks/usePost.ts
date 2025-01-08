import { useState, useEffect, useCallback } from "react";
import { Post as PostType, User } from "../types/postProps";
import axios from "axios";
import toast from "react-hot-toast";

type UsePostResult = {
    posts: PostType[] | null;
    isLoading: boolean;
    addPost: (postData: { text: string; img: string | null; }) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
    likePost: (postId: string) => Promise<void>;
    commentPost: (postId: string, text: string) => Promise<void>;
}

export const usePost = (feedType?: string, authUser?: User | null ): UsePostResult => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getPostsEndpoint = useCallback(() => {
        switch (feedType) {
            case "forYou":
                return "api/posts/all";
            case "following":
                return "api/posts/following";
            case "posts":
                return `api/posts/user/${authUser?.username}`;
            case "likes":
                return `api/posts/likes/${authUser?._id}`;
            default:
                return "api/posts/all";
        }
    }, [feedType, authUser]);

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
                prevPosts ? prevPosts.filter((post) => post._id !== postId) : []
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

    const addPost = async (postData: { text: string; img: string | null; }) => {
        setIsLoading(true);
        try {
            const response = await axios.post("api/posts/create", postData);
            const newPost = response.data;
            setPosts((prevPosts) =>
                prevPosts ? [newPost, ...prevPosts] : [newPost]
            );
            toast.success("Post created successfully");
            console.log(response.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to add post");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const likePost = async (postId: string) => {
        if (!posts || !authUser?._id) return;
        // Copy of the current posts
        const previousPosts = [...posts];
        // Optimistic UI implementation
        setPosts((prevPosts) =>
            prevPosts
                ? prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: post.likes.includes(authUser._id as string)
                                ? post.likes.filter((id) => id !== authUser._id)
                                : [...post.likes, authUser._id as string],
                        }
                        : post
                )
                : []
        );
        try {
            await axios.post(`/api/posts/like/${postId}`);
        } catch (error) {
            // In case the operation in the server fails, return the state of posts to the copy created
            setPosts(previousPosts);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to like the post");
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const commentPost = async (postId: string, text: string) => {
        if(!posts || !authUser?._id) return;
        const tempId = Date.now().toString();
        const previousPosts = [...posts];
        const newComment = { 
            _id: tempId, 
            user: {
                _id: authUser._id,
                fullName: authUser?.fullName,
                username: authUser?.username,
                profileImg: authUser?.profileImg
                
            }, 
            text 
        };
        setPosts((prevPosts) => 
            prevPosts
                ? prevPosts.map((post) => 
                    post._id === postId
                        ? {
                            ...post,
                            comments: [
                                ...post.comments, newComment
                            ]
                        }
                    : post
                )
            : []
        );
        try {
            await axios.post(`/api/posts/comment/${postId}`, {text});
            toast.success("Comment added successfully");
        } catch (error) {
            setPosts(previousPosts);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to comment on the post");
            } else {
                toast.error("An unexpected error occurred.");
            };
        };
    };

    return { posts, isLoading, addPost, deletePost, likePost, commentPost }
};