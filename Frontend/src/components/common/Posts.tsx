import { usePost } from "../../hooks/usePost";
import { Post as PostType } from "../../types/postProps";
import { PostSkeleton } from "../skeletons/PostSkeleton";
import { Post } from "./Post";

type PostsProps = {
  posts: PostType[] | null | undefined;
  isLoading: boolean;
};

export const Posts: React.FC<PostsProps> = ({ posts, isLoading }) => {
  const { deletePostAction, likePostAction, commentPostAction } = usePost();
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>No posts available.</p>;
  };
  return (
    <>
      {isLoading && <PostSkeleton />}
      {!isLoading && posts && posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          isLoading={isLoading}
          deletePost={deletePostAction}
          likePost={likePostAction}
          commentPost={commentPostAction}
        />
      ))}
    </>
  );
};
