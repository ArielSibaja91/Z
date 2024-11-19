import { Post } from "./Post";
import { PostSkeleton } from "../skeletons/PostSkeleton";
import { Post as PostType } from "../../types/postProps";

type PostsProps = {
  posts: PostType[] | null;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentPost: (postId: string, text: string) => Promise<void>;
  isLoading: boolean;
};

export const Posts: React.FC<PostsProps> = ({ posts, deletePost, likePost, commentPost, isLoading}) => {
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
        <p className="text-center my-4">No posts in this tab.</p>
      )}
      {!isLoading && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} deletePost={deletePost} likePost={likePost} commentPost={commentPost} />
          ))}
        </div>
      )}
    </>
  );
};
