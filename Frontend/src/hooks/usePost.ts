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
        await toast.promise(addPostAction(postData).unwrap(), {
            loading: 'Posting...',
            success: 'Post created successfully!',
            error: 'Failed to add post'
        });
        refetchUserPostsCount(); // Refetch user posts count after adding a post
    };

    const handleDeletePost = async (postId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) {
            return;
        };
        await toast.promise(deletePostAction(postId).unwrap(), {
            loading: 'Deleting...',
            success: 'Post deleted successfully',
            error: 'Failed to delete post'
        });
        refetchUserPostsCount(); // Refetch user posts count after deleting a post
    };

    const handleLikePost = async (postId: string) => {
        try {
            await likePostAction(postId).unwrap();
        } catch (error) {
            toast.error('Failed to like the post');
        }
    };

    const handleCommentPost = async (postId: string, text: string) => {
        await toast.promise(commentPostAction({ postId, text }).unwrap(), {
            loading: 'Adding comment...',
            success: 'Comment added successfully',
            error: 'Failed to add comment'
        });
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