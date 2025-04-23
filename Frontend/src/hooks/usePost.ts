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
    // Usamos el hook generado por RTK Query para obtener los datos y el estado
    const {
        data: posts,
        isLoading,
        refetch: getPostsEndpoint, // Renombramos refetch para que coincida con la lógica anterior
    } = useFetchPostsQuery({ feedType, authUser }, { skip: !authUser }); // Skip la query si no hay usuario autenticado

    // Usamos los hooks de mutación generados por RTK Query
    const [addPostAction] = useAddPostMutation();
    const [deletePostAction] = useDeletePostMutation();
    const [likePostAction] = useLikePostMutation();
    const [commentPostAction] = useCommentPostMutation();

    // Ya no necesitamos un useEffect separado para la carga inicial,
    // useFetchPostsQuery lo maneja automáticamente.
    // Sin embargo, si necesitas un comportamiento adicional al montar el componente, puedes usar useEffect.

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
        addPostAction: handleAddPost, // Usamos las funciones envueltas con toast
        deletePostAction: handleDeletePost,
        likePostAction: handleLikePost,
        commentPostAction: handleCommentPost,
        refetchPosts: getPostsEndpoint, // Expón la función refetch si la necesitas manualmente
    };
};