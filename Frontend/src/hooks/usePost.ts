import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { User } from "../types/postProps";
import toast from "react-hot-toast";
import { fetchPosts, addPost, deletePost, likePost, commentPost } from "../features/posts/postSlice";

export const usePost = (feedType?: string, authUser?: User | null) => {
    const dispatch = useDispatch<AppDispatch>();

    // Seleccionar el estado desde Redux
    const { posts, isLoading } = useSelector((state: RootState) => state.posts);

    // 📥 Obtener posts al montar el componente
    const getPostsEndpoint = useCallback(() => {
        dispatch(fetchPosts({ feedType, authUser }));
    }, [dispatch, feedType, authUser]);

    useEffect(() => {
        if(authUser){
            getPostsEndpoint();
        }
    }, [getPostsEndpoint, authUser]);

    // 📤 Funciones que disparan acciones de Redux con toasts

    const addPostAction = async (postData: { text: string; img: string | null }) => {
        try {
            await dispatch(addPost(postData)).unwrap();
            toast.success('Post created successfully');
        } catch (error) {
            toast.error('Failed to add post');
        }
    };

    const deletePostAction = async (postId: string) => {
        try {
            await dispatch(deletePost(postId)).unwrap();
            toast.success('Post deleted successfully');
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const likePostAction = async (postId: string) => {
        try {
            if (authUser?._id) {
                await dispatch(likePost({ postId, userId: authUser._id })).unwrap();
                toast.success('Post liked successfully');
            }
        } catch (error) {
            toast.error('Failed to like the post');
        }
    };

    const commentPostAction = async (postId: string, text: string) => {
        try {
            if (authUser) {
                await dispatch(commentPost({ postId, text, authUser })).unwrap();
                toast.success('Comment added successfully');
            }
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    return { posts, isLoading, addPostAction, deletePostAction, likePostAction, commentPostAction };
};