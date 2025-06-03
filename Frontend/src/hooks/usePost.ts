import { User } from '../types/postProps';
import toast from 'react-hot-toast';
import {
    useFetchPostsQuery,
    useAddPostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useCommentPostMutation,
} from '../features/posts/postApi';

export const usePost = (feedType?: string, authUser?: User | null) => {
    const {
        data: posts,
        isLoading,
        refetch: getPostsEndpoint,
    } = useFetchPostsQuery({ feedType, authUser }, { skip: !authUser });

    const [addPostAction] = useAddPostMutation();
    const [deletePostAction] = useDeletePostMutation();
    const [likePostAction] = useLikePostMutation();
    const [commentPostAction] = useCommentPostMutation();

    const handleAddPost = async (postData: { text: string; img: string | null }) => {
        try {
            await addPostAction(postData).unwrap();
            toast.success('Post created successfully');
        } catch (error) {
            toast.error('Failed to add post');
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await deletePostAction(postId).unwrap();
            toast.success('Post deleted successfully');
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const handleLikePost = async (postId: string) => {
        try {
            await likePostAction(postId).unwrap();
            toast.success('Post liked successfully');
        } catch (error) {
            toast.error('Failed to like the post');
        }
    };

    const handleCommentPost = async (postId: string, text: string) => {
        try {
            await commentPostAction({ postId, text }).unwrap();
            toast.success('Comment added successfully');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    return {
        posts,
        isLoading,
        addPostAction: handleAddPost,
        deletePostAction: handleDeletePost,
        likePostAction: handleLikePost,
        commentPostAction: handleCommentPost,
        refetchPosts: getPostsEndpoint,
    };
};