import { User } from '../types/postProps';
import toast from 'react-hot-toast';
import {
    useFetchPostsQuery,
    useAddPostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useCommentPostMutation,
} from '../features/posts/postApi';

export const usePost = (feedType?: string, profileUser?: User | null) => {
    const {
        data: posts,
        isLoading,
        refetch: getPostsEndpoint,
    } = useFetchPostsQuery({ feedType, profileUser }, { skip: !profileUser });

    const {
        data: userPostsCountData,
        refetch: refetchUserPostsCount,
    } = useFetchPostsQuery({ feedType: 'posts', profileUser }, { skip: !profileUser });

    const [addPostAction] = useAddPostMutation();
    const [deletePostAction] = useDeletePostMutation();
    const [likePostAction] = useLikePostMutation();
    const [commentPostAction] = useCommentPostMutation();

    const handleAddPost = async (postData: { text: string; img: string | null }) => {
        try {
            await addPostAction(postData).unwrap();
            toast.success('Post created successfully');
            refetchUserPostsCount(); // Refetch user posts count after adding a post
        } catch (error) {
            toast.error('Failed to add post');
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await deletePostAction(postId).unwrap();
            toast.success('Post deleted successfully');
            refetchUserPostsCount(); // Refetch user posts count after deleting a post
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleLikePost = async (postId: string) => {
        try {
            await likePostAction(postId).unwrap();
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
        userPostsCount: userPostsCountData?.length || 0,
        addPostAction: handleAddPost,
        deletePostAction: handleDeletePost,
        likePostAction: handleLikePost,
        commentPostAction: handleCommentPost,
        refetchPosts: getPostsEndpoint,
    };
};