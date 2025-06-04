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
  console.log({posts, isLoading});
  return (
    <>
      {isLoading && (
        <div className='text-center text-gray-500 p-4'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts && posts.length > 0 && (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            isLoading={isLoading}
            deletePost={deletePostAction}
            likePost={likePostAction}
            commentPost={commentPostAction}
          />
        ))
      )}
      {!isLoading && posts && posts.length === 0 && (
        <div className='text-center text-gray-500 p-4'>
          <p>No posts found.</p>
        </div>
      )}
    </>
  );
};
